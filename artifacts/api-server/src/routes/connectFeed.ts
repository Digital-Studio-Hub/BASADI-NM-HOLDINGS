import { Router, type IRouter, type Request, type Response } from "express";
import { submitOrder, type ConnectOrderRequest, ConnectOrderError } from "../lib/submitOrder";

const router: IRouter = Router();

const DEFAULT_CONNECT_BASE_URL =
  "https://lekker.network/api/connect/9e4d7a2c-ad66-4b8f-a947-837d4139a324";

function getToken(): string | null {
  return process.env["LEKKER_CONNECT_TOKEN"] ?? null;
}

function getBaseUrl(): string {
  return (process.env["LEKKER_CONNECT_BASE_URL"] ?? DEFAULT_CONNECT_BASE_URL).replace(
    /\/$/,
    "",
  );
}

function buildUpstreamUrl(pathname: string, query: Request["query"]): URL | null {
  const token = getToken();
  if (!token) {
    return null;
  }

  const endpoint = new URL(`${getBaseUrl()}${pathname}`);
  endpoint.searchParams.set("token", token);

  for (const [key, rawValue] of Object.entries(query)) {
    if (key === "token" || rawValue === undefined) {
      continue;
    }

    if (Array.isArray(rawValue)) {
      rawValue.forEach((value) => endpoint.searchParams.append(key, String(value)));
    } else {
      endpoint.searchParams.set(key, String(rawValue));
    }
  }

  return endpoint;
}

async function relayJson(
  req: Request,
  res: Response,
  method: "GET" | "POST",
  upstreamPath: string,
  options?: { requirePortalToken?: boolean; includeBody?: boolean },
): Promise<void> {
  const endpoint = buildUpstreamUrl(upstreamPath, req.query);
  if (!endpoint) {
    res.status(500).json({
      error:
        "Connect API token is not configured on the server. Set LEKKER_CONNECT_TOKEN.",
    });
    return;
  }

  const headers: Record<string, string> = {
    Accept: "application/json",
  };

  if (options?.requirePortalToken) {
    const portalToken = req.header("x-portal-token");
    if (!portalToken) {
      res.status(400).json({
        error: "validation_error",
        message: "Missing X-Portal-Token header",
      });
      return;
    }
    headers["X-Portal-Token"] = portalToken;
  }

  let body: string | undefined;
  if (options?.includeBody) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(req.body ?? {});
  }

  try {
    const upstreamRes = await fetch(endpoint.toString(), {
      method,
      headers,
      body,
    });

    const contentType = upstreamRes.headers.get("content-type") ?? "";
    const rawText = await upstreamRes.text();
    const isJson = contentType.includes("application/json");

    if (!isJson) {
      if (!upstreamRes.ok) {
        res.status(upstreamRes.status).json({
          error: "upstream_error",
          message: rawText || "Upstream request failed",
        });
        return;
      }

      res.status(upstreamRes.status).send(rawText);
      return;
    }

    const payload = rawText ? (JSON.parse(rawText) as unknown) : {};
    res.status(upstreamRes.status).json(payload);
  } catch {
    res.status(502).json({
      error: "network_error",
      message: "Unable to reach Connect API. Please try again shortly.",
    });
  }
}

router.get("/connect-feed", async (req: Request, res: Response): Promise<void> => {
  const token = process.env["LEKKER_CONNECT_TOKEN"];
  if (!token) {
    res.status(500).json({
      error:
        "Connect API token is not configured on the server. Set LEKKER_CONNECT_TOKEN.",
    });
    return;
  }

  const configuredBaseUrl = process.env["LEKKER_CONNECT_BASE_URL"];
  const baseUrl = (configuredBaseUrl ?? DEFAULT_CONNECT_BASE_URL).replace(
    /\/$/,
    "",
  );

  const publishedParam = String(req.query.published ?? "true").toLowerCase();
  const published = publishedParam === "false" ? "false" : "true";

  const endpoint = new URL(`${baseUrl}/feed`);
  endpoint.searchParams.set("token", token);
  endpoint.searchParams.set("published", published);

  try {
    const upstreamRes = await fetch(endpoint.toString(), {
      headers: {
        Accept: "application/json",
      },
    });

    if (!upstreamRes.ok) {
      const upstreamBody = await upstreamRes.text();
      res.status(502).json({
        error: "Failed to fetch product feed from Connect API",
        upstreamStatus: upstreamRes.status,
        details: upstreamBody.slice(0, 500),
      });
      return;
    }

    const payload = (await upstreamRes.json()) as unknown;
    res.json(payload);
  } catch {
    res.status(502).json({
      error: "Unable to reach Connect API. Please try again shortly.",
    });
  }
});

router.get("/connect/feed", async (req: Request, res: Response): Promise<void> => {
  await relayJson(req, res, "GET", "/feed");
});

router.post(
  "/connect/contacts",
  async (req: Request, res: Response): Promise<void> => {
    await relayJson(req, res, "POST", "/contacts", { includeBody: true });
  },
);

router.post(
  "/connect/checkout",
  async (req: Request, res: Response): Promise<void> => {
    await relayJson(req, res, "POST", "/checkout", { includeBody: true });
  },
);

router.post("/connect/orders", async (req: Request, res: Response): Promise<void> => {
  try {
    const payload = req.body as ConnectOrderRequest;
    const result = await submitOrder(payload);
    res.json(result);
  } catch (err) {
    if (err instanceof ConnectOrderError) {
      res.status(err.status).json(err.data);
      return;
    }

    if (err instanceof Error) {
      res.status(500).json({
        error: "internal_error",
        message: err.message,
      });
      return;
    }

    res.status(500).json({
      error: "internal_error",
      message: "Order submission failed",
    });
  }
});

router.post(
  "/connect/shipping/quote",
  async (req: Request, res: Response): Promise<void> => {
    await relayJson(req, res, "POST", "/shipping/quote", { includeBody: true });
  },
);

router.get(
  "/connect/shipping/pickup-points",
  async (req: Request, res: Response): Promise<void> => {
    await relayJson(req, res, "GET", "/shipping/pickup-points");
  },
);

router.get(
  "/connect/shipping/rates",
  async (req: Request, res: Response): Promise<void> => {
    await relayJson(req, res, "GET", "/shipping/rates", {
      requirePortalToken: true,
    });
  },
);

router.post(
  "/connect/portal/request-otp",
  async (req: Request, res: Response): Promise<void> => {
    await relayJson(req, res, "POST", "/portal/request-otp", { includeBody: true });
  },
);

router.post(
  "/connect/portal/verify-otp",
  async (req: Request, res: Response): Promise<void> => {
    await relayJson(req, res, "POST", "/portal/verify-otp", { includeBody: true });
  },
);

router.get(
  "/connect/portal/me",
  async (req: Request, res: Response): Promise<void> => {
    await relayJson(req, res, "GET", "/portal/me", { requirePortalToken: true });
  },
);

router.get(
  "/connect/gift-cards/validate",
  async (req: Request, res: Response): Promise<void> => {
    await relayJson(req, res, "GET", "/gift-cards/validate");
  },
);

router.post(
  "/connect/gift-cards/redeem",
  async (req: Request, res: Response): Promise<void> => {
    await relayJson(req, res, "POST", "/gift-cards/redeem", { includeBody: true });
  },
);

export default router;