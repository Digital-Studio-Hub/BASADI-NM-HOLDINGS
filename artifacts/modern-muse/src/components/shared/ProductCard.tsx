import React from "react";
import { Link } from "wouter";
import { Product } from "@workspace/api-client-react";
import { Heart } from "lucide-react";
import { useWishlist } from "@/contexts/WishlistContext";
import { Button } from "@/components/ui/button";

export function ProductCard({ product }: { product: Product }) {
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const isSaved = isInWishlist(product.id);

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isSaved) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const hasDiscount = product.salePrice < product.originalPrice;

  return (
    <Link href={`/product/${product.id}`} className="group flex flex-col gap-4">
      <div className="relative aspect-[3/4] overflow-hidden bg-muted rounded-md">
        <img 
          src={product.images[0] || "/placeholder.png"} 
          alt={product.name} 
          loading="lazy" 
          decoding="async"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        {product.images[1] && (
          <img 
            src={product.images[1]} 
            alt={`${product.name} alternate view`} 
            loading="lazy"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-500 ease-in-out group-hover:opacity-100"
          />
        )}
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-2">
          {product.isNewArrival && (
            <span className="bg-background text-foreground text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded">New</span>
          )}
          {hasDiscount && (
            <span className="bg-destructive text-destructive-foreground text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded">Sale</span>
          )}
        </div>

        {/* Wishlist Button */}
        <button 
          onClick={handleWishlist}
          className="absolute top-2 right-2 p-2 bg-background/80 backdrop-blur rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background shadow-sm"
        >
          <Heart className={`w-4 h-4 ${isSaved ? "fill-destructive text-destructive" : "text-foreground"}`} />
        </button>

        {/* Quick Add (Desktop) */}
        <div className="absolute bottom-0 left-0 w-full p-4 translate-y-full opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 hidden lg:block bg-gradient-to-t from-black/50 to-transparent">
          <Button variant="secondary" className="w-full font-medium">Quick View</Button>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <h3 className="font-serif text-lg font-medium text-foreground leading-tight group-hover:text-primary transition-colors">{product.name}</h3>
        <p className="text-sm text-muted-foreground">{product.categoryName}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className="font-medium">R{product.salePrice}</span>
          {hasDiscount && (
            <span className="text-sm text-muted-foreground line-through">R{product.originalPrice}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
