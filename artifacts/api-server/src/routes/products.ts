import { Router, type IRouter, type Request, type Response } from "express";
import { eq } from "drizzle-orm";
import { db, productsTable } from "@workspace/db";
import {
  ListProductsQueryParams,
  ListProductsResponse,
  GetProductResponse,
  GetRelatedProductsResponse,
} from "@workspace/api-zod";
import { getAllProducts, matchesCollection } from "../lib/catalog";

const router: IRouter = Router();

router.get("/products", async (req: Request, res: Response): Promise<void> => {
  const parsed = ListProductsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid query parameters" });
    return;
  }

  const { category, collection, size, color, minPrice, maxPrice, sort } =
    parsed.data;
  const search = parsed.data.search?.toLowerCase();

  let products = await getAllProducts();

  if (category) products = products.filter((p) => p.category === category);
  if (collection)
    products = products.filter((p) => matchesCollection(p, collection));
  if (search)
    products = products.filter(
      (p) =>
        p.name.toLowerCase().includes(search) ||
        p.description.toLowerCase().includes(search),
    );
  if (size) products = products.filter((p) => p.sizes.includes(size));
  if (color) products = products.filter((p) => p.colors.includes(color));
  if (minPrice !== undefined && !Number.isNaN(minPrice))
    products = products.filter((p) => p.salePrice >= minPrice);
  if (maxPrice !== undefined && !Number.isNaN(maxPrice))
    products = products.filter((p) => p.salePrice <= maxPrice);

  switch (sort) {
    case "price_asc":
      products.sort((a, b) => a.salePrice - b.salePrice);
      break;
    case "price_desc":
      products.sort((a, b) => b.salePrice - a.salePrice);
      break;
    case "name_asc":
      products.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "best_selling":
      products.sort((a, b) => b.reviewCount - a.reviewCount);
      break;
    case "newest":
    default:
      products.sort(
        (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
      );
      break;
  }

  const data = ListProductsResponse.parse(products);
  res.json(data);
});

router.get(
  "/products/:id",
  async (req: Request, res: Response): Promise<void> => {
    const id = String(req.params.id);
    const [product] = await db
      .select()
      .from(productsTable)
      .where(eq(productsTable.id, id))
      .limit(1);

    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    const data = GetProductResponse.parse(product);
    res.json(data);
  },
);

router.get(
  "/products/:id/related",
  async (req: Request, res: Response): Promise<void> => {
    const id = String(req.params.id);
    const [product] = await db
      .select()
      .from(productsTable)
      .where(eq(productsTable.id, id))
      .limit(1);

    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    const all = await getAllProducts();
    const related = all
      .filter((p) => p.id !== product.id && p.category === product.category)
      .slice(0, 4);

    const data = GetRelatedProductsResponse.parse(related);
    res.json(data);
  },
);

export default router;
