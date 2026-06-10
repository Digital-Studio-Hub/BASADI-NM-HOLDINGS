import React from "react";
import { Link } from "wouter";
import { useWishlist } from "@/contexts/WishlistContext";
import { ProductCard } from "@/components/shared/ProductCard";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

export default function Wishlist() {
  const { items, clearWishlist } = useWishlist();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-32 flex flex-col items-center justify-center text-center">
        <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
          <Heart className="w-10 h-10 text-muted-foreground" />
        </div>
        <h1 className="font-serif text-3xl font-bold text-foreground mb-4">Your wishlist is empty</h1>
        <p className="text-muted-foreground mb-8 max-w-md">Save your favorite items here while you shop. They'll be waiting for you when you're ready.</p>
        <Button asChild size="lg" className="uppercase tracking-wide">
          <Link href="/shop">Explore Products</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="flex justify-between items-end mb-12">
        <div>
          <h1 className="font-serif text-4xl font-bold text-foreground mb-2">My Wishlist</h1>
          <p className="text-muted-foreground">{items.length} {items.length === 1 ? 'item' : 'items'} saved</p>
        </div>
        <Button variant="ghost" onClick={clearWishlist} className="text-destructive hover:text-destructive hover:bg-destructive/10">
          Clear All
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12">
        {items.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
