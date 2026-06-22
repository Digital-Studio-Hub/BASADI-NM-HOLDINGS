import React from "react";
import { Link } from "wouter";
import { ShoppingBag, Heart, Menu, Search, X } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Header() {
  const { itemCount: cartCount } = useCart();
  const { itemCount: wishlistCount } = useWishlist();
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-background/90 backdrop-blur-md border-b border-border transition-all">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Mobile Menu */}
        <div className="flex items-center gap-4 lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-foreground">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] bg-background">
              <nav className="flex flex-col gap-6 mt-8">
                <Link href="/" className="text-lg font-medium font-serif hover:text-primary transition-colors">Home</Link>
                <Link href="/shop" className="text-lg font-medium font-serif hover:text-primary transition-colors">Shop All</Link>
                <Link href="/collections" className="text-lg font-medium font-serif hover:text-primary transition-colors">Collections</Link>
                <Link href="/about" className="text-lg font-medium font-serif hover:text-primary transition-colors">About Us</Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        {/* Logo */}
        <Link href="/" className="flex items-center justify-center flex-1 lg:flex-none">
          <img 
            src="/brand/modern-muse-logo-color.png" 
            alt="Modern Muse" 
            className="h-12 w-auto object-contain hover:opacity-80 transition-opacity"
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8 flex-1 justify-center">
          <Link href="/shop" className="text-sm font-medium tracking-wide uppercase hover:text-primary transition-colors">Shop</Link>
          <Link href="/collections" className="text-sm font-medium tracking-wide uppercase hover:text-primary transition-colors">Collections</Link>
          <Link href="/about" className="text-sm font-medium tracking-wide uppercase hover:text-primary transition-colors">About</Link>
          <Link href="/contact" className="text-sm font-medium tracking-wide uppercase hover:text-primary transition-colors">Contact</Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2 lg:gap-4 flex-none">
          <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(!isSearchOpen)}>
            <Search className="w-5 h-5 text-foreground" />
          </Button>
          <Link href="/wishlist" className="relative p-2 hover:bg-accent/20 rounded-full transition-colors hidden sm:block">
            <Heart className="w-5 h-5 text-foreground" />
            {wishlistCount > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 bg-primary text-primary-foreground text-[10px] flex items-center justify-center rounded-full font-medium">
                {wishlistCount}
              </span>
            )}
          </Link>
          <Link href="/cart" className="relative p-2 hover:bg-accent/20 rounded-full transition-colors">
            <ShoppingBag className="w-5 h-5 text-foreground" />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 bg-primary text-primary-foreground text-[10px] flex items-center justify-center rounded-full font-medium">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
      
      {/* Search Bar Overlay */}
      {isSearchOpen && (
        <div className="absolute top-full left-0 w-full bg-background border-b border-border p-4 shadow-md animate-in slide-in-from-top-2">
          <div className="container mx-auto max-w-2xl relative">
            <input 
              type="text" 
              placeholder="Search modern fashion..." 
              className="w-full bg-transparent border-b-2 border-foreground/20 focus:border-primary px-4 py-3 outline-none transition-colors font-serif text-lg"
              autoFocus
            />
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute right-0 top-1/2 -translate-y-1/2"
              onClick={() => setIsSearchOpen(false)}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
