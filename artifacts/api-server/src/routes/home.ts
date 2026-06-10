import { Router, type IRouter, type Request, type Response } from "express";
import { asc } from "drizzle-orm";
import { db, collectionsTable } from "@workspace/db";
import { GetHomeSummaryResponse } from "@workspace/api-zod";
import { getAllProducts, matchesCollection } from "../lib/catalog";

const router: IRouter = Router();

router.get(
  "/home/summary",
  async (_req: Request, res: Response): Promise<void> => {
    const [products, collections] = await Promise.all([
      getAllProducts(),
      db
        .select()
        .from(collectionsTable)
        .orderBy(asc(collectionsTable.sortOrder)),
    ]);

    const newArrivals = products
      .filter((p) => p.isNewArrival)
      .slice(0, 8);
    const bestSellers = products.filter((p) => p.isBestSeller).slice(0, 8);
    const trending = products.filter((p) => p.isTrending).slice(0, 8);

    const featuredCollections = collections.slice(0, 4).map((c) => ({
      slug: c.slug,
      name: c.name,
      description: c.description,
      image: c.image,
      productCount: products.filter((p) => matchesCollection(p, c.slug)).length,
    }));

    const data = GetHomeSummaryResponse.parse({
      newArrivals,
      bestSellers,
      trending,
      featuredCollections,
    });
    res.json(data);
  },
);

export default router;
