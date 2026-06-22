import React, { useState } from "react";
import { Link } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSubscribeNewsletter } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";

export function Footer() {
  const [email, setEmail] = useState("");
  const subscribe = useSubscribeNewsletter();
  const { toast } = useToast();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    subscribe.mutate({ data: { email } }, {
      onSuccess: () => {
        toast({ title: "Subscribed!", description: "You are now on The Muse List." });
        setEmail("");
      },
      onError: () => {
        toast({ variant: "destructive", title: "Error", description: "Failed to subscribe." });
      }
    });
  };

  return (
    <footer className="bg-card border-t border-border pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          
          {/* Column 1: Shop */}
          <div className="flex flex-col gap-4">
            <h4 className="font-serif font-semibold text-lg text-foreground mb-2">Shop</h4>
            <Link href="/shop" className="text-muted-foreground hover:text-primary transition-colors">All Products</Link>
            <Link href="/shop?category=clothing" className="text-muted-foreground hover:text-primary transition-colors">Clothing</Link>
            <Link href="/shop?category=handbags" className="text-muted-foreground hover:text-primary transition-colors">Handbags</Link>
            <Link href="/shop?category=jewellery" className="text-muted-foreground hover:text-primary transition-colors">Jewellery</Link>
            <Link href="/collections" className="text-muted-foreground hover:text-primary transition-colors">Collections</Link>
          </div>

          {/* Column 2: Customer Care */}
          <div className="flex flex-col gap-4">
            <h4 className="font-serif font-semibold text-lg text-foreground mb-2">Customer Care</h4>
            <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">Contact Us</Link>
            <Link href="/faq" className="text-muted-foreground hover:text-primary transition-colors">FAQ</Link>
            <Link href="/shipping-returns" className="text-muted-foreground hover:text-primary transition-colors">Shipping & Returns</Link>
          </div>

          {/* Column 3: Company */}
          <div className="flex flex-col gap-4">
            <h4 className="font-serif font-semibold text-lg text-foreground mb-2">Company</h4>
            <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">About Us</Link>
            <Link href="/privacy-policy" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="/terms-conditions" className="text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link>
          </div>

          {/* Column 4: Newsletter */}
          <div className="flex flex-col gap-4">
            <h4 className="font-serif font-semibold text-lg text-foreground mb-2">The List</h4>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Sign up for exclusive offers, original stories, events and more.
            </p>
            <form className="flex flex-col gap-2 mt-2" onSubmit={handleSubscribe}>
              <Input 
                type="email"
                placeholder="Email Address" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-background border-border" 
              />
              <Button 
                type="submit" 
                disabled={subscribe.isPending}
                className="w-full font-medium tracking-wide uppercase bg-foreground text-background hover:bg-primary hover:text-primary-foreground"
              >
                {subscribe.isPending ? "Subscribing..." : "Subscribe"}
              </Button>
            </form>
          </div>

          {/* Column 5: Verified Badge */}
          <div className="flex flex-col gap-4 items-start lg:items-center">
            <h4 className="font-serif font-semibold text-lg text-foreground mb-2 lg:text-center w-full">Verified Badge</h4>
            <a href="https://lekker.network/the-lekker-network-verified" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-2 hover:opacity-80 transition-opacity">
              <img 
                src="/brand/lekker-verified-badge.png" 
                alt="Lekker Network Verified" 
                className="w-[120px] h-auto object-contain"
                loading="lazy"
              />
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Lekker Network Verified</span>
            </a>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="order-1 md:order-1 flex flex-col items-center gap-2">
            <Link href="/" className="hover:opacity-80 transition-opacity">
              <img 
                src="/brand/modern-muse-logo-white.svg" 
                alt="Modern Muse" 
                className="h-10 w-auto object-contain"
              />
            </Link>
            <span className="text-xs text-muted-foreground font-medium">Modern Muse</span>
          </div>
          
          <p className="text-sm text-muted-foreground order-3 md:order-2 text-center md:text-center">
            © 2024 Modern Muse by Basadi NM Holdings
          </p>
          
          <div className="order-2 md:order-3 flex flex-col items-center gap-2">
            <a href="https://lekker.network/" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
              <img 
                src="/brand/lekker-network-logo.png" 
                alt="Lekker Network" 
                className="w-[120px] md:w-[150px] h-auto object-contain"
                loading="lazy"
              />
            </a>
            <span className="text-xs text-muted-foreground">Powered by Lekker Network</span>
          </div>

          <div className="order-4 md:order-4 flex items-center gap-4 text-sm text-muted-foreground">
            <Link href="/terms-conditions" className="hover:text-primary transition-colors">Terms of Service</Link>
            <span>|</span>
            <Link href="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
