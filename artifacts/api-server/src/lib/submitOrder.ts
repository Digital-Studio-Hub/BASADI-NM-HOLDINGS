import { logger } from "./logger";

const DEFAULT_CONNECT_BASE_URL =
  "https://lekker.network/api/connect/9e4d7a2c-ad66-4b8f-a947-837d4139a324";

export type ConnectPaymentStatus = "paid" | "pending";

export type ConnectOrderItem = {
  description: string;
  quantity: number;
  unitPriceInCents: number;
  productId?: string;
  variantId?: string;
  sku?: string;
};

export type ConnectParcel = {
  submitted_length_cm: number;
  submitted_width_cm: number;
  submitted_height_cm: number;
  submitted_weight_kg: number;
};

export type ConnectOrderRequest = {
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  platform?: string;
  platformOrderId?: string;
  items: ConnectOrderItem[];
  paymentStatus?: ConnectPaymentStatus;
  shippingCost?: number;
  tax?: number;
  shippingAddress?: string;
  shippingCity?: string;
  shippingProvince?: string;
  shippingPostalCode?: string;
  notes?: string;
  shipLogicQuoteId?: string;
  shipLogicServiceCode?: string;
  shipLogicServiceId?: number;
  shipLogicRate?: number;
  parcels?: ConnectParcel[];
  lekkerGiftCardCode?: string;
  lekkerGiftCardAmountCents?: number;
};

export type ConnectOrderResponse = {
  orderId: string;
  orderNumber: string;
  duplicate: boolean;
  giftCardRedeemedCents?: number;
};

export class ConnectOrderError extends Error {
  readonly status: number;
  readonly data: unknown;

  constructor(message: string, status: number, data: unknown) {
    super(message);
    this.name = "ConnectOrderError";
    this.status = status;
    this.data = data;
  }
}

function getConnectBaseUrl(): string {
  return (process.env["LEKKER_CONNECT_BASE_URL"] ?? DEFAULT_CONNECT_BASE_URL).replace(
    /\/$/,
    "",
  );
}

function getConnectToken(): string {
  const token = process.env["LEKKER_CONNECT_TOKEN"];
  if (!token) {
    throw new Error("LEKKER_CONNECT_TOKEN is not configured on the server");
  }
  return token;
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function isNetworkFailure(err: unknown): boolean {
  return err instanceof TypeError;
}

async function callConnectOrders(
  orderData: ConnectOrderRequest,
): Promise<ConnectOrderResponse> {
  const endpoint = new URL(`${getConnectBaseUrl()}/orders`);
  endpoint.searchParams.set("token", getConnectToken());

  const response = await fetch(endpoint.toString(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(orderData),
  });

  const rawText = await response.text();
  const data = rawText ? (JSON.parse(rawText) as unknown) : null;

  if (!response.ok) {
    throw new ConnectOrderError(
      `Order submission failed with status ${response.status}`,
      response.status,
      data,
    );
  }

  const parsed = data as ConnectOrderResponse;
  if (parsed.duplicate) {
    logger.warn(
      { platformOrderId: orderData.platformOrderId, orderId: parsed.orderId },
      "Connect order duplicate detected; treating as success",
    );
  }

  return parsed;
}

export async function submitOrder(
  orderData: ConnectOrderRequest,
): Promise<ConnectOrderResponse> {
  try {
    return await callConnectOrders(orderData);
  } catch (err) {
    if (!isNetworkFailure(err)) {
      throw err;
    }

    logger.warn("Network failure while submitting order; retrying once in 2 seconds");
    await wait(2000);
    return callConnectOrders(orderData);
  }
}