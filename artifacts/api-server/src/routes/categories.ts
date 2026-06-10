import { Router, type IRouter, type Request, type Response } from "express";
import { asc, eq } from "drizzle-orm";
import { db, categoriesTable } from "@workspace/db";
import { ListCategoriesResponse, GetCategoryResponse } from "@workspace/api-zod";
import { getAllProducts } from "../lib/catalog";

const router: IRouter = Router();

router.get("/categories", async (_req: Request, res: Response): Promise<void> => {
  const [categories, products] = await Promise.all([
    db.select().from(categoriesTable).orderBy(asc(categoriesTable.sortOrder)),
    getAllProducts(),
  ]);

  const data = ListCategoriesResponse.parse(
    categories.map((c) => ({
      slug: c.slug,
      name: c.name,
      description: c.description,
      image: c.image,
      productCount: products.filter((p) => p.category === c.slug).length,
    })),
  );
  res.json(data);
});

router.get(
  "/categories/:slug",
  async (req: Request, res: Response): Promise<void> => {
    const slug = String(req.params.slug);
    const [category] = await db
      .select()
      .from(categoriesTable)
      .where(eq(categoriesTable.slug, slug))
      .limit(1);

    if (!category) {
      res.status(404).json({ error: "Category not found" });
      return;
    }

    const products = await getAllProducts();
    const data = GetCategoryResponse.parse({
      slug: category.slug,
      name: category.name,
      description: category.description,
      image: category.image,
      productCount: products.filter((p) => p.category === category.slug).length,
    });
    res.json(data);
  },
);

export default router;
