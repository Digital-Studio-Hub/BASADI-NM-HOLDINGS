import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import path from "node:path";
import { existsSync } from "node:fs";
import router from "./routes";
import { logger } from "./lib/logger";
import { notFoundHandler, errorHandler } from "./middlewares/errorHandler";

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

const configuredWebDistDir = process.env["WEB_DIST_DIR"];
const resolvedWebDistDir = configuredWebDistDir
  ? path.resolve(configuredWebDistDir)
  : path.resolve(process.cwd(), "artifacts", "modern-muse", "dist", "public");

if (existsSync(resolvedWebDistDir)) {
  logger.info({ webDistDir: resolvedWebDistDir }, "Serving web assets");

  app.use(
    express.static(resolvedWebDistDir, {
      index: false,
    }),
  );

  app.get(/^\/(?!api(?:\/|$)).*/, (req, res, next) => {
    if (req.method !== "GET") {
      return next();
    }

    res.sendFile(path.join(resolvedWebDistDir, "index.html"), (err) => {
      if (err) {
        next(err);
      }
    });
  });
} else {
  logger.warn({ webDistDir: resolvedWebDistDir }, "Web asset directory not found");
}

app.use("/api", notFoundHandler);
app.use(errorHandler);

export default app;
