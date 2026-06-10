import React from "react";
import { Link } from "wouter";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Trash2, ShoppingBag } from "lucide-react";

export default function Cart() {
  const { items, updateQuantity, removeFromCart, total, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-32 flex flex-col items-center justify-center text-center">
        <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
          <ShoppingBag className="w-10 h-10 text-muted-foreground" />
        </div>
        <h1 className="font-serif text-3xl font-bold text-foreground mb-4">Your cart is empty</h1>
        <p className="text-muted-foreground mb-8 max-w-md">Looks like you haven't added any items to your cart yet. Explore our collections to find something beautiful.</p>
        <Button asChild size="lg" className="uppercase tracking-wide">
          <Link href="/shop">Start Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="font-serif text-4xl font-bold text-foreground mb-12">Shopping Cart</h1>
      
      <div className="flex flex-col lg:flex-row gap-12">
        <div className="flex-1 flex flex-col gap-8">
          <div className="hidden md:grid grid-cols-12 gap-4 pb-4 border-b border-border text-sm font-medium text-muted-foreground uppercase tracking-wider">
            <div className="col-span-6">Product</div>
            <div className="col-span-2 text-center">Price</div>
            <div className="col-span-2 text-center">Quantity</div>
            <div className="col-span-2 text-right">Total</div>
          </div>

          <div className="flex flex-col gap-6">
            {items.map((item, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center py-4 border-b border-border last:border-0">
                
                {/* Product Info */}
                <div className="col-span-1 md:col-span-6 flex gap-4">
                  <div className="w-24 h-32 flex-shrink-0 bg-muted rounded-md overflow-hidden">
                    <img src={item.product.images[0] || "/placeholder.png"} alt={item.product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex flex-col justify-center">
                    <Link href={`/product/${item.product.id}`} className="font-serif font-bold text-lg hover:text-primary transition-colors line-clamp-2">
                      {item.product.name}
                    </Link>
                    <p className="text-sm text-muted-foreground mt-1">
                      {item.size && `Size: ${item.size}`}
                      {item.size && item.color && " | "}
                      {item.color && `Color: ${item.color}`}
                    </p>
                    <button 
                      onClick={() => removeFromCart(item.product.id, item.size, item.color)}
                      className="text-sm text-destructive hover:underline self-start mt-3 flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" /> Remove
                    </button>
                  </div>
                </div>

                {/* Price Mobile/Desktop */}
                <div className="col-span-1 md:col-span-2 md:text-center text-left font-medium hidden md:block">
                  R{item.product.salePrice}
                </div>

                {/* Quantity */}
                <div className="col-span-1 md:col-span-2 flex items-center md:justify-center mt-4 md:mt-0">
                  <div className="flex items-center border border-border rounded-md bg-card">
                    <button 
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.size, item.color)} 
                      className="px-3 py-1 hover:bg-muted transition-colors"
                    >-</button>
                    <span className="w-8 text-center text-sm">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.size, item.color)} 
                      className="px-3 py-1 hover:bg-muted transition-colors"
                    >+</button>
                  </div>
                </div>

                {/* Total */}
                <div className="col-span-1 md:col-span-2 text-right font-medium text-lg mt-2 md:mt-0">
                  R{item.product.salePrice * item.quantity}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-96">
          <div className="bg-card border border-border rounded-lg p-6 sticky top-24">
            <h2 className="font-serif text-2xl font-bold mb-6">Order Summary</h2>
            
            <div className="flex flex-col gap-4 mb-6">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>R{total}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="pt-4 border-t border-border flex justify-between font-bold text-xl">
                <span>Total</span>
                <span>R{total}</span>
              </div>
            </div>

            <Button className="w-full h-14 text-lg uppercase tracking-wide bg-foreground text-background hover:bg-primary hover:text-primary-foreground mb-4">
              Proceed to Checkout
            </Button>
            
            <p className="text-xs text-center text-muted-foreground mb-6">
              Taxes and shipping calculated at checkout
            </p>

            <div className="flex flex-col items-center border-t border-border pt-6">
              <span className="text-xs font-medium uppercase tracking-wider mb-3">Secure payments via</span>
              <div className="flex gap-3 grayscale opacity-70">
                 <span className="text-xs font-bold border rounded px-2 py-1">PayFast</span>
                 <span className="text-xs font-bold border rounded px-2 py-1">Peach</span>
                 <span className="text-xs font-bold border rounded px-2 py-1">Ozow</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
