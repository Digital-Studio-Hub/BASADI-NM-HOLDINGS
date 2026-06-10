import { Router, type IRouter, type Request, type Response } from "express";
import { asc, eq } from "drizzle-orm";
import { db, collectionsTable } from "@workspace/db";
import {
  ListCollectionsResponse,
  GetCollectionResponse,
} from "@workspace/api-zod";
import { getAllProducts, matchesCollection } from "../lib/catalog";

const router: IRouter = Router();

router.get(
  "/collections",
  async (_req: Request, res: Response): Promise<void> => {
    const [collections, products] = await Promise.all([
      db
        .select()
        .from(collectionsTable)
        .orderBy(asc(collectionsTable.sortOrder)),
      getAllProducts(),
    ]);

    const data = ListCollectionsResponse.parse(
      collections.map((c) => ({
        slug: c.slug,
        name: c.name,
        description: c.description,
        image: c.image,
        productCount: products.filter((p) => matchesCollection(p, c.slug))
          .length,
      })),
    );
    res.json(data);
  },
);

router.get(
  "/collections/:slug",
  async (req: Request, res: Response): Promise<void> => {
    const slug = String(req.params.slug);
    const [collection] = await db
      .select()
      .from(collectionsTable)
      .where(eq(collectionsTable.slug, slug))
      .limit(1);

    if (!collection) {
      res.status(404).json({ error: "Collection not found" });
      return;
    }

    const products = await getAllProducts();
    const data = GetCollectionResponse.parse({
      slug: collection.slug,
      name: collection.name,
      description: collection.description,
      image: collection.image,
      productCount: products.filter((p) => matchesCollection(p, collection.slug))
        .length,
    });
    res.json(data);
  },
);

export default router;
