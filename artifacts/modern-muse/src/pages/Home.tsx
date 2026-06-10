import React from "react";
import { Link } from "wouter";
import { useGetHomeSummary, useListTestimonials } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/shared/ProductCard";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Star, Sparkles, Truck, CreditCard, RefreshCcw } from "lucide-react";

export default function Home() {
  const { data: summary, isLoading } = useGetHomeSummary();
  const { data: testimonials } = useListTestimonials();

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative w-full h-[85vh] min-h-[600px] flex items-center bg-muted overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/assets/hero.png" 
            alt="Fashion That Moves With You" 
            className="w-full h-full object-cover object-center"
            loading="eager"
            decoding="sync"
          />
          <div className="absolute inset-0 bg-black/20" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-2xl text-white"
          >
            <h1 className="font-serif text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Fashion That<br/>Moves With You
            </h1>
            <p className="text-lg md:text-xl mb-8 font-light text-white/90 max-w-lg">
              Curated premium fashion for the modern South African woman. Confident, elegant, and effortlessly chic.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-white hover:text-primary font-medium tracking-wide uppercase">
                <Link href="/shop">Shop New Arrivals</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-black font-medium tracking-wide uppercase">
                <Link href="/collections">Shop Collections</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust Strip */}
      <section className="w-full bg-card border-b border-border py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="flex flex-col items-center gap-2">
              <Sparkles className="w-6 h-6 text-primary" strokeWidth={1.5} />
              <h3 className="font-medium text-sm tracking-wide uppercase">Premium Quality</h3>
              <p className="text-xs text-muted-foreground">Curated luxury materials</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Truck className="w-6 h-6 text-primary" strokeWidth={1.5} />
              <h3 className="font-medium text-sm tracking-wide uppercase">Nationwide Delivery</h3>
              <p className="text-xs text-muted-foreground">Fast shipping across SA</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <CreditCard className="w-6 h-6 text-primary" strokeWidth={1.5} />
              <h3 className="font-medium text-sm tracking-wide uppercase">Secure Payments</h3>
              <p className="text-xs text-muted-foreground">PayFast, Peach, Yoco</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <RefreshCcw className="w-6 h-6 text-primary" strokeWidth={1.5} />
              <h3 className="font-medium text-sm tracking-wide uppercase">Easy Returns</h3>
              <p className="text-xs text-muted-foreground">Hassle-free exchanges</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-3">Shop by Category</h2>
              <p className="text-muted-foreground">Explore our curated collections</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/shop?category=clothing" className="group relative aspect-[3/4] overflow-hidden bg-muted rounded-lg block">
              <img src="/assets/category-clothing.png" alt="Clothing" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
              <div className="absolute inset-0 flex items-center justify-center">
                <h3 className="text-white font-serif text-3xl font-bold tracking-wide">Clothing</h3>
              </div>
            </Link>
            <Link href="/shop?category=handbags" className="group relative aspect-[3/4] overflow-hidden bg-muted rounded-lg block">
              <img src="/assets/category-handbags.png" alt="Handbags" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
              <div className="absolute inset-0 flex items-center justify-center">
                <h3 className="text-white font-serif text-3xl font-bold tracking-wide">Handbags</h3>
              </div>
            </Link>
            <Link href="/shop?category=jewellery" className="group relative aspect-[3/4] overflow-hidden bg-muted rounded-lg block">
              <img src="/assets/category-jewellery.png" alt="Jewellery" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
              <div className="absolute inset-0 flex items-center justify-center">
                <h3 className="text-white font-serif text-3xl font-bold tracking-wide">Jewellery</h3>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Trending Products */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-3">Trending Now</h2>
              <p className="text-muted-foreground">Most loved by our Muses</p>
            </div>
            <Link href="/shop" className="text-sm font-medium tracking-wide uppercase hover:text-primary transition-colors hidden md:block border-b border-foreground pb-1">
              View All
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="flex flex-col gap-4">
                  <Skeleton className="aspect-[3/4] w-full" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
              {summary?.trending.slice(0, 4).map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Collections */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
           <div className="text-center mb-16">
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">Curated Collections</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">Seasonal edits designed to elevate your everyday wardrobe.</p>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Link href="/collection/summer-edit" className="group relative aspect-[4/3] md:aspect-[16/9] overflow-hidden rounded-lg bg-muted block">
                 <img src="/assets/collection-summer.png" alt="Summer Edit" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                 <div className="absolute bottom-0 left-0 p-8 w-full">
                    <h3 className="text-white font-serif text-3xl font-bold mb-2">The Summer Edit</h3>
                    <p className="text-white/80 mb-4">Breezy silhouettes and sun-kissed hues.</p>
                    <span className="inline-flex items-center text-white text-sm font-medium tracking-wide uppercase border-b border-white pb-1 group-hover:text-primary group-hover:border-primary transition-colors">Discover</span>
                 </div>
              </Link>
              <div className="grid grid-rows-2 gap-8 h-full">
                 <Link href="/collection/workwear" className="group relative overflow-hidden rounded-lg bg-muted block h-full">
                    <img src="/assets/collection-workwear.png" alt="Modern Workwear" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 p-6 w-full">
                       <h3 className="text-white font-serif text-2xl font-bold mb-1">Modern Workwear</h3>
                       <span className="inline-flex items-center text-white text-xs font-medium tracking-wide uppercase border-b border-white pb-1 group-hover:text-primary group-hover:border-primary transition-colors">Shop Collection</span>
                    </div>
                 </Link>
                 <Link href="/collection/evening" className="group relative overflow-hidden rounded-lg bg-muted block h-full">
                    <img src="/assets/collection-evening.png" alt="Evening Elegance" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 p-6 w-full">
                       <h3 className="text-white font-serif text-2xl font-bold mb-1">Evening Elegance</h3>
                       <span className="inline-flex items-center text-white text-xs font-medium tracking-wide uppercase border-b border-white pb-1 group-hover:text-primary group-hover:border-primary transition-colors">Shop Collection</span>
                    </div>
                 </Link>
              </div>
           </div>
        </div>
      </section>

      {/* Testimonials */}
      {testimonials && testimonials.length > 0 && (
        <section className="py-24 bg-card border-t border-border">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">What Our Muses Say</h2>
            </div>
            
            <Carousel className="w-full max-w-4xl mx-auto">
              <CarouselContent>
                {testimonials.map(t => (
                  <CarouselItem key={t.id}>
                    <div className="flex flex-col items-center text-center p-6">
                      <div className="flex gap-1 mb-6 text-primary">
                        {[1, 2, 3, 4, 5].map(star => (
                          <Star key={star} className="w-5 h-5 fill-current" />
                        ))}
                      </div>
                      <p className="font-serif text-xl md:text-2xl leading-relaxed mb-8">"{t.quote}"</p>
                      <div>
                        <h4 className="font-bold text-foreground">{t.name}</h4>
                        <p className="text-sm text-muted-foreground">{t.location}</p>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex" />
              <CarouselNext className="hidden md:flex" />
            </Carousel>
          </div>
        </section>
      )}

      {/* Newsletter */}
      <section className="py-24 bg-muted text-center border-t border-border">
         <div className="container mx-auto px-4 max-w-xl">
            <h2 className="font-serif text-3xl font-bold text-foreground mb-4">Join The Muse List</h2>
            <p className="text-muted-foreground mb-8">Subscribe to receive 10% off your first order, plus exclusive access to new arrivals and sales.</p>
            <form className="flex flex-col sm:flex-row gap-3" onSubmit={e => e.preventDefault()}>
               <input 
                  type="email" 
                  placeholder="Enter your email address" 
                  className="flex-1 bg-background border border-border px-4 py-3 rounded-none focus:outline-none focus:border-primary"
                  required
               />
               <Button type="submit" size="lg" className="rounded-none uppercase tracking-wide">Subscribe</Button>
            </form>
         </div>
      </section>
    </div>
  );
}
