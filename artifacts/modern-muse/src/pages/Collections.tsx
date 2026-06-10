import React from "react";
import { Link } from "wouter";
import { useListCollections } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Collections() {
  const { data: collections, isLoading } = useListCollections();

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">Curated Collections</h1>
        <p className="text-lg text-muted-foreground">
          Discover our thoughtfully curated seasonal edits and exclusive ranges designed for the modern South African woman.
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[1, 2, 3, 4].map(i => (
             <Skeleton key={i} className="aspect-[4/3] w-full rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {collections?.map(collection => (
            <Link key={collection.slug} href={`/collection/${collection.slug}`} className="group relative aspect-[4/3] overflow-hidden rounded-lg bg-muted block">
              <img 
                src={collection.image || `/assets/collection-${collection.slug}.png`} 
                alt={collection.name} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                onError={(e) => { (e.target as HTMLImageElement).src = "/assets/collection-summer.png" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center mt-auto h-1/2">
                <h2 className="text-white font-serif text-3xl md:text-4xl font-bold mb-3">{collection.name}</h2>
                <p className="text-white/90 mb-6 max-w-md">{collection.description}</p>
                <span className="inline-flex items-center text-white text-sm font-medium tracking-wide uppercase border-b border-white pb-1 group-hover:text-primary group-hover:border-primary transition-colors">
                  Explore Collection
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
