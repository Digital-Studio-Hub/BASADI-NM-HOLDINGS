import React from "react";
import { useRoute, Link } from "wouter";
import { useGetCollection, useListProducts, getGetCollectionQueryKey } from "@workspace/api-client-react";
import { ProductCard } from "@/components/shared/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";

export default function CollectionDetail() {
  const [, params] = useRoute("/collection/:slug");
  const slug = params?.slug || "";

  const { data: collection, isLoading: isCollectionLoading } = useGetCollection(slug, {
    query: { enabled: !!slug, queryKey: getGetCollectionQueryKey(slug) }
  });

  const { data: products, isLoading: isProductsLoading } = useListProducts({ collection: slug });

  if (isCollectionLoading) {
    return (
      <div>
        <Skeleton className="w-full h-[40vh]" />
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i}><Skeleton className="aspect-[3/4] w-full" /></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!collection) {
    return <div className="text-center py-32">Collection not found</div>;
  }

  return (
    <div className="bg-background min-h-screen">
      <div className="relative w-full h-[40vh] md:h-[50vh] bg-muted overflow-hidden flex items-center justify-center">
        <img 
          src={collection.image || "/assets/collection-summer.png"} 
          alt={collection.name} 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 text-center px-4">
          <h1 className="font-serif text-4xl md:text-6xl font-bold text-white mb-4">{collection.name}</h1>
          <p className="text-white/90 max-w-2xl mx-auto text-lg">{collection.description}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <Link href="/collections" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Collections
          </Link>
        </div>

        {isProductsLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="flex flex-col gap-4">
                <Skeleton className="aspect-[3/4] w-full" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : products && products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-muted/50 rounded-lg">
            <p className="text-muted-foreground text-lg">No products available in this collection.</p>
          </div>
        )}
      </div>
    </div>
  );
}
