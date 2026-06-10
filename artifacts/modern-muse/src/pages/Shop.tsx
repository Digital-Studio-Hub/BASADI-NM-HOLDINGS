import React, { useState } from "react";
import { useSearch, useRoute } from "wouter";
import { useListProducts, useListCategories, ListProductsSort } from "@workspace/api-client-react";
import { ProductCard } from "@/components/shared/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export default function Shop() {
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  const initialCategory = params.get("category") || undefined;
  const initialCollection = params.get("collection") || undefined;
  
  const [match, paramsMatch] = useRoute("/shop/:category");
  const categoryParam = match ? paramsMatch.category : initialCategory;

  const [sort, setSort] = useState<ListProductsSort>(ListProductsSort.newest);
  
  const { data: products, isLoading: productsLoading } = useListProducts({
    category: categoryParam,
    collection: initialCollection,
    sort
  });

  const { data: categories } = useListCategories();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
        <div>
          <h1 className="font-serif text-4xl font-bold text-foreground mb-2">
            {categoryParam ? categoryParam.charAt(0).toUpperCase() + categoryParam.slice(1) : "Shop All"}
          </h1>
          <p className="text-muted-foreground">Discover our latest additions and timeless classics.</p>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <Select value={sort} onValueChange={(v) => setSort(v as ListProductsSort)}>
            <SelectTrigger className="w-[180px] bg-background border-border">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest Arrivals</SelectItem>
              <SelectItem value="best_selling">Best Selling</SelectItem>
              <SelectItem value="price_asc">Price: Low to High</SelectItem>
              <SelectItem value="price_desc">Price: High to Low</SelectItem>
              <SelectItem value="name_asc">Name: A to Z</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside className="w-full lg:w-64 flex-shrink-0">
          <div className="sticky top-24 bg-card border border-border rounded-lg p-6">
            <h3 className="font-serif font-bold text-lg mb-4">Categories</h3>
            <div className="flex flex-col gap-3">
              <a 
                href="/shop" 
                className={`text-sm hover:text-primary transition-colors ${!categoryParam ? 'font-bold text-primary' : 'text-muted-foreground'}`}
              >
                All Categories
              </a>
              {categories?.map(cat => (
                <a 
                  key={cat.slug}
                  href={`/shop/${cat.slug}`} 
                  className={`text-sm hover:text-primary transition-colors ${categoryParam === cat.slug ? 'font-bold text-primary' : 'text-muted-foreground'}`}
                >
                  {cat.name} ({cat.productCount})
                </a>
              ))}
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          {productsLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="flex flex-col gap-4">
                  <Skeleton className="aspect-[3/4] w-full" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : products && products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-12">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-muted/50 rounded-lg">
              <p className="text-muted-foreground text-lg">No products found matching your criteria.</p>
              <Button asChild className="mt-4" variant="outline">
                <a href="/shop">Clear Filters</a>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
