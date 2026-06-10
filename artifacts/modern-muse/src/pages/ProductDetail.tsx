import React, { useState } from "react";
import { useRoute } from "wouter";
import { useGetProduct, useGetRelatedProducts, getGetProductQueryKey, getGetRelatedProductsQueryKey } from "@workspace/api-client-react";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/shared/ProductCard";
import { Heart, Truck, RefreshCcw, ShieldCheck } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { FaWhatsapp } from "react-icons/fa";

export default function ProductDetail() {
  const [, params] = useRoute("/product/:id");
  const id = params?.id || "";

  const { data: product, isLoading } = useGetProduct(id, { 
    query: { enabled: !!id, queryKey: getGetProductQueryKey(id) } 
  });
  
  const { data: relatedProducts } = useGetRelatedProducts(id, {
    query: { enabled: !!id, queryKey: getGetRelatedProductsQueryKey(id) }
  });

  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [quantity, setQuantity] = useState(1);

  if (isLoading || !product) {
    return (
      <div className="container mx-auto px-4 py-12 flex flex-col md:flex-row gap-12">
        <Skeleton className="w-full md:w-1/2 aspect-[3/4]" />
        <div className="w-full md:w-1/2 flex flex-col gap-6">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  const isSaved = isInWishlist(product.id);
  const activeImage = selectedImage || product.images[0];
  const hasDiscount = product.salePrice < product.originalPrice;
  const savings = hasDiscount ? Math.round((1 - product.salePrice / product.originalPrice) * 100) : 0;

  const handleAddToCart = () => {
    if (product.sizes?.length && !selectedSize) return alert("Please select a size");
    if (product.colors?.length && !selectedColor) return alert("Please select a colour");
    addToCart(product, quantity, selectedSize, selectedColor);
  };

  const handleWishlist = () => {
    isSaved ? removeFromWishlist(product.id) : addToWishlist(product);
  };

  const whatsappMessage = encodeURIComponent(`Hi, I'm interested in the ${product.name} (Code: ${product.code}). Is it available?`);

  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row gap-12 lg:gap-20">
          
          {/* Image Gallery */}
          <div className="w-full md:w-1/2 flex flex-col gap-4">
            <div className="relative aspect-[3/4] bg-muted rounded-lg overflow-hidden">
              <img src={activeImage} alt={product.name} className="w-full h-full object-cover" />
              {hasDiscount && (
                <span className="absolute top-4 left-4 bg-destructive text-destructive-foreground px-3 py-1 text-xs font-bold uppercase tracking-wider rounded">
                  Sale -{savings}%
                </span>
              )}
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2 snap-x">
                {product.images.map((img, i) => (
                  <button 
                    key={i} 
                    onClick={() => setSelectedImage(img)}
                    className={`relative w-20 aspect-[3/4] rounded-md overflow-hidden flex-shrink-0 snap-start border-2 transition-colors ${activeImage === img ? 'border-primary' : 'border-transparent'}`}
                  >
                    <img src={img} alt={`${product.name} view ${i+1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="w-full md:w-1/2 flex flex-col pt-4">
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-2">{product.name}</h1>
            <p className="text-muted-foreground text-sm mb-6">Style Code: {product.code}</p>

            <div className="flex items-center gap-4 mb-8 pb-8 border-b border-border">
              <span className="text-3xl font-medium text-foreground">R{product.salePrice}</span>
              {hasDiscount && (
                <span className="text-xl text-muted-foreground line-through">R{product.originalPrice}</span>
              )}
            </div>

            {/* Colors */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-6">
                <div className="flex justify-between items-center mb-3">
                  <span className="font-medium text-sm">Colour: {selectedColor || "Select"}</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map(color => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 border rounded-md text-sm font-medium transition-colors ${selectedColor === color ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card hover:border-primary/50 text-foreground'}`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-8">
                <div className="flex justify-between items-center mb-3">
                  <span className="font-medium text-sm">Size: {selectedSize || "Select"}</span>
                  <button className="text-xs text-muted-foreground underline">Size Guide</button>
                </div>
                <div className="flex flex-wrap gap-3">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-12 h-12 flex items-center justify-center border rounded-md text-sm font-medium transition-colors ${selectedSize === size ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card hover:border-primary/50 text-foreground'}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col gap-4 mb-8">
              <div className="flex gap-4">
                <div className="flex items-center border border-border rounded-md bg-card">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-3 text-muted-foreground hover:text-foreground transition-colors">-</button>
                  <span className="w-8 text-center font-medium">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="px-4 py-3 text-muted-foreground hover:text-foreground transition-colors">+</button>
                </div>
                <Button 
                  onClick={handleAddToCart}
                  className="flex-1 h-auto py-3 bg-foreground text-background hover:bg-primary hover:text-primary-foreground font-medium uppercase tracking-wide"
                >
                  Add to Cart
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={handleWishlist}
                  className="h-auto w-[52px] border-border text-foreground hover:bg-muted"
                >
                  <Heart className={`w-5 h-5 ${isSaved ? "fill-destructive text-destructive" : ""}`} />
                </Button>
              </div>
              
              <Button 
                variant="outline"
                className="w-full py-6 border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white transition-colors"
                asChild
              >
                <a href={`https://wa.me/27767578783?text=${whatsappMessage}`} target="_blank" rel="noopener noreferrer">
                  <FaWhatsapp className="w-5 h-5 mr-2" />
                  Enquire via WhatsApp
                </a>
              </Button>
            </div>

            {/* Description */}
            <div className="prose prose-sm max-w-none text-muted-foreground mb-8">
              <p>{product.description}</p>
              {product.features && product.features.length > 0 && (
                <ul className="mt-4">
                  {product.features.map((feature, i) => (
                    <li key={i}>{feature}</li>
                  ))}
                </ul>
              )}
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 border-t border-border">
              <div className="flex flex-col items-center text-center gap-2">
                <Truck className="w-5 h-5 text-primary" />
                <span className="text-xs font-medium uppercase tracking-wider text-foreground">Fast Delivery</span>
                <span className="text-xs text-muted-foreground">Nationwide</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <RefreshCcw className="w-5 h-5 text-primary" />
                <span className="text-xs font-medium uppercase tracking-wider text-foreground">Easy Returns</span>
                <span className="text-xs text-muted-foreground">Within 14 days</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <ShieldCheck className="w-5 h-5 text-primary" />
                <span className="text-xs font-medium uppercase tracking-wider text-foreground">Secure Payment</span>
                <span className="text-xs text-muted-foreground">100% Protected</span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts && relatedProducts.length > 0 && (
        <section className="bg-card py-16 border-t border-border mt-12">
          <div className="container mx-auto px-4">
            <h2 className="font-serif text-3xl font-bold text-center mb-10">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.slice(0, 4).map(prod => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
