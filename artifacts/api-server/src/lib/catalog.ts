import { db, productsTable } from "@workspace/db";
import type { Product } from "@workspace/db";

export type CatalogProduct = Product;

export async function getAllProducts(): Promise<CatalogProduct[]> {
  return db.select().from(productsTable);
}

export function matchesCollection(
  product: CatalogProduct,
  slug: string,
): boolean {
  switch (slug) {
    case "new-arrivals":
      return product.isNewArrival;
    case "best-sellers":
      return product.isBestSeller;
    case "trending":
      return product.isTrending;
    case "handbags":
      return product.category === "handbags";
    case "jewellery":
      return product.category === "jewellery";
    case "fashion-essentials":
      return ["tops", "pants", "co-ord-sets", "dresses"].includes(
        product.category,
      );
    default:
      return false;
  }
}
