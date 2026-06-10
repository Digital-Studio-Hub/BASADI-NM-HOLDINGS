import React from "react";
import { Diamond } from "lucide-react";

export default function About() {
  return (
    <div className="bg-background min-h-screen">
      {/* Hero */}
      <section className="relative w-full h-[60vh] bg-muted overflow-hidden flex items-center justify-center">
        <img 
          src="/assets/hero.png" 
          alt="Modern Muse Brand Story" 
          className="absolute inset-0 w-full h-full object-cover object-[center_30%]"
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 text-center px-4">
          <h1 className="font-serif text-5xl md:text-7xl font-bold text-white mb-4">Our Story</h1>
        </div>
      </section>

      {/* Content */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="prose prose-lg prose-neutral mx-auto">
            <h2 className="font-serif text-3xl font-bold text-center mb-10 text-foreground">Redefining South African Luxury</h2>
            
            <p className="lead text-xl text-muted-foreground text-center mb-12 font-serif italic">
              "We believe that every woman deserves to feel confident, elegant, and empowered in what she wears."
            </p>

            <p>
              Founded in 2024 by Basadi NM Holdings, Modern Muse was born from a desire to bridge the gap between high-end luxury and accessible everyday fashion. We noticed that the modern South African woman was searching for something more — pieces that combine international trends with local soul, uncompromising quality with realistic price points.
            </p>

            <p>
              Modern Muse is more than a boutique; it is a curation of lifestyle. We meticulously source our collections of clothing, handbags, jewellery, and accessories from premium international and local suppliers to ensure every piece meets our exacting standards.
            </p>

            <h3 className="font-serif text-2xl font-bold mt-12 mb-6">Our Philosophy</h3>
            
            <p>
              We believe in the power of the capsule wardrobe — investing in versatile, high-quality pieces that transcend seasonal trends. Our collections are designed to move with you from boardrooms to brunches, and from casual weekends to elegant evening events.
            </p>

            <ul className="space-y-4 my-8 list-none pl-0">
              <li className="flex items-start">
                <Diamond className="text-primary mr-3 mt-1 w-4 h-4 shrink-0" strokeWidth={1.5} />
                <span><strong>Uncompromising Quality:</strong> We source only premium fabrics and materials.</span>
              </li>
              <li className="flex items-start">
                <Diamond className="text-primary mr-3 mt-1 w-4 h-4 shrink-0" strokeWidth={1.5} />
                <span><strong>Curated Elegance:</strong> Every item is hand-selected to ensure it meets our aesthetic standards.</span>
              </li>
              <li className="flex items-start">
                <Diamond className="text-primary mr-3 mt-1 w-4 h-4 shrink-0" strokeWidth={1.5} />
                <span><strong>Customer First:</strong> Your satisfaction and confidence are our ultimate goals.</span>
              </li>
            </ul>

            <h3 className="font-serif text-2xl font-bold mt-12 mb-6">The Basadi NM Promise</h3>
            
            <p>
              As a proud subsidiary of Basadi NM Holdings, we are committed to excellence in service and product. When you shop with Modern Muse, you are investing in a piece that has been vetted for quality, style, and longevity.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
