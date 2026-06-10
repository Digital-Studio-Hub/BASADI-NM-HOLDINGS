import {
  db,
  productsTable,
  categoriesTable,
  collectionsTable,
  testimonialsTable,
  type InsertProduct,
  type InsertCategory,
  type InsertCollection,
  type InsertTestimonial,
} from "@workspace/db";

const img = (name: string) => `/products/${name}.webp`;

const categories: InsertCategory[] = [
  {
    slug: "dresses",
    name: "Dresses",
    description:
      "Effortless silhouettes for day and evening, cut for the modern muse.",
    image: img("mm_dress_floral"),
    sortOrder: 1,
  },
  {
    slug: "co-ord-sets",
    name: "Co-ord Sets",
    description: "Considered two-piece sets that take the thinking out of dressing.",
    image: img("mm_coord"),
    sortOrder: 2,
  },
  {
    slug: "jackets-outerwear",
    name: "Jackets & Outerwear",
    description: "Layering pieces that elevate every look, from city to coast.",
    image: img("mm_jacket"),
    sortOrder: 3,
  },
  {
    slug: "tops",
    name: "Tops",
    description: "Soft knits and easy blouses, the quiet heroes of the wardrobe.",
    image: img("mm_top"),
    sortOrder: 4,
  },
  {
    slug: "pants",
    name: "Pants",
    description: "Fluid tailoring and relaxed shapes for effortless movement.",
    image: img("mm_pants"),
    sortOrder: 5,
  },
  {
    slug: "swimwear",
    name: "Swimwear",
    description: "Sculpted swim for golden afternoons by the water.",
    image: img("mm_swim"),
    sortOrder: 6,
  },
  {
    slug: "handbags",
    name: "Handbags",
    description: "Structured and soft carryalls finished in warm, tactile tones.",
    image: img("mm_bag_shoulder"),
    sortOrder: 7,
  },
  {
    slug: "accessories",
    name: "Accessories",
    description: "The finishing touches that make a look unmistakably yours.",
    image: img("mm_accessory"),
    sortOrder: 8,
  },
  {
    slug: "jewellery",
    name: "Jewellery",
    description: "Gilded everyday pieces designed to layer and last.",
    image: img("mm_jewel_set"),
    sortOrder: 9,
  },
  {
    slug: "perfumes",
    name: "Perfumes",
    description: "Signature scents that linger long after you leave the room.",
    image: img("mm_perfume"),
    sortOrder: 10,
  },
];

const collections: InsertCollection[] = [
  {
    slug: "new-arrivals",
    name: "New Arrivals",
    description: "The latest additions to the Modern Muse wardrobe.",
    image: img("mm_dress_pleated"),
    sortOrder: 1,
  },
  {
    slug: "best-sellers",
    name: "Best Sellers",
    description: "Loved on repeat by the Modern Muse community.",
    image: img("mm_bag_shoulder"),
    sortOrder: 2,
  },
  {
    slug: "trending",
    name: "Trending Now",
    description: "The pieces everyone is reaching for this season.",
    image: img("mm_coord"),
    sortOrder: 3,
  },
  {
    slug: "handbags",
    name: "The Handbag Edit",
    description: "Carry-everywhere bags in warm, considered tones.",
    image: img("mm_bag_clutch"),
    sortOrder: 4,
  },
  {
    slug: "jewellery",
    name: "The Jewellery Edit",
    description: "Gilded layers to finish every look.",
    image: img("mm_jewel_earrings"),
    sortOrder: 5,
  },
  {
    slug: "fashion-essentials",
    name: "Fashion Essentials",
    description: "The foundational pieces every wardrobe deserves.",
    image: img("mm_top2"),
    sortOrder: 6,
  },
];

type SeedProduct = {
  code: string;
  name: string;
  category: string;
  categoryName: string;
  originalPrice: number;
  salePrice: number;
  image: string;
  description: string;
  features: string[];
  sizes: string[];
  colors: string[];
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  isTrending?: boolean;
  featured?: boolean;
  rating?: number;
  reviewCount?: number;
};

const APPAREL_SIZES = ["XS", "S", "M", "L", "XL"];
const ONE_SIZE = ["One Size"];

const seedProducts: SeedProduct[] = [
  {
    code: "MM-DR-001",
    name: "Floral Pleated Midi Dress",
    category: "dresses",
    categoryName: "Dresses",
    originalPrice: 720,
    salePrice: 549,
    image: "mm_dress_floral",
    description:
      "A romantic floral midi with a fluid pleated skirt that moves beautifully with every step. Cut from a soft, breathable weave for all-day ease.",
    features: ["Fluid pleated skirt", "Soft breathable weave", "V-neckline", "Midi length"],
    sizes: APPAREL_SIZES,
    colors: ["Rose Nude", "Soft Taupe"],
    isNewArrival: true,
    isBestSeller: true,
    featured: true,
    rating: 4.9,
    reviewCount: 128,
  },
  {
    code: "MM-DR-002",
    name: "Washed Denim Shirt Dress",
    category: "dresses",
    categoryName: "Dresses",
    originalPrice: 690,
    salePrice: 499,
    image: "mm_dress_denim",
    description:
      "An easy denim shirt dress with a relaxed silhouette and tie waist. The off-duty piece you will reach for again and again.",
    features: ["Button-through front", "Adjustable tie waist", "Relaxed fit", "Chest pockets"],
    sizes: APPAREL_SIZES,
    colors: ["Washed Denim"],
    isTrending: true,
    isBestSeller: true,
    rating: 4.8,
    reviewCount: 96,
  },
  {
    code: "MM-DR-003",
    name: "Digital Print Pleated Dress",
    category: "dresses",
    categoryName: "Dresses",
    originalPrice: 780,
    salePrice: 589,
    image: "mm_dress_pleated",
    description:
      "A long-sleeve V-neck dress in an artful digital print, finished with delicate all-over pleating for an elevated evening look.",
    features: ["All-over pleating", "Long sleeves", "V-neckline", "Lined bodice"],
    sizes: APPAREL_SIZES,
    colors: ["Champagne", "Charcoal"],
    isNewArrival: true,
    isTrending: true,
    featured: true,
    rating: 5,
    reviewCount: 74,
  },
  {
    code: "MM-CO-001",
    name: "Striped Wide-Leg Co-ord Set",
    category: "co-ord-sets",
    categoryName: "Co-ord Sets",
    originalPrice: 850,
    salePrice: 649,
    image: "mm_coord",
    description:
      "A relaxed two-piece in a soft stripe, pairing a breezy top with wide-leg trousers. Wear together or style each piece on its own.",
    features: ["Matching two-piece", "Wide-leg trousers", "Relaxed top", "Elasticated waist"],
    sizes: APPAREL_SIZES,
    colors: ["Beige Stripe"],
    isNewArrival: true,
    isTrending: true,
    isBestSeller: true,
    featured: true,
    rating: 4.9,
    reviewCount: 112,
  },
  {
    code: "MM-CO-002",
    name: "Linen Shorts Co-ord Set",
    category: "co-ord-sets",
    categoryName: "Co-ord Sets",
    originalPrice: 720,
    salePrice: 539,
    image: "mm_coord",
    description:
      "A breezy linen-blend set with tailored shorts and a matching top, made for warm days and easy evenings.",
    features: ["Linen-blend fabric", "Tailored shorts", "Breathable", "Coordinated set"],
    sizes: APPAREL_SIZES,
    colors: ["Soft Taupe"],
    isNewArrival: true,
    rating: 4.7,
    reviewCount: 41,
  },
  {
    code: "MM-JK-001",
    name: "Hooded Longline Windbreaker",
    category: "jackets-outerwear",
    categoryName: "Jackets & Outerwear",
    originalPrice: 890,
    salePrice: 679,
    image: "mm_jacket",
    description:
      "A lightweight longline windbreaker with a drawstring hood and water-resistant finish, designed to layer over everything.",
    features: ["Water-resistant finish", "Drawstring hood", "Longline cut", "Side pockets"],
    sizes: APPAREL_SIZES,
    colors: ["Stone", "Charcoal"],
    isTrending: true,
    rating: 4.8,
    reviewCount: 58,
  },
  {
    code: "MM-TP-001",
    name: "Half High Neck Knitted Top",
    category: "tops",
    categoryName: "Tops",
    originalPrice: 420,
    salePrice: 319,
    image: "mm_top",
    description:
      "A soft, cropped knit with a half high neck and short sleeves. A refined layering essential in a warm neutral palette.",
    features: ["Soft fine knit", "Half high neck", "Short sleeves", "Slightly cropped"],
    sizes: APPAREL_SIZES,
    colors: ["Champagne", "Ivory"],
    isBestSeller: true,
    isNewArrival: true,
    featured: true,
    rating: 4.9,
    reviewCount: 143,
  },
  {
    code: "MM-TP-002",
    name: "Loose Casual Summer Top",
    category: "tops",
    categoryName: "Tops",
    originalPrice: 360,
    salePrice: 269,
    image: "mm_top2",
    description:
      "An airy, loose-fit top in a soft neutral tone. Effortless on its own or layered under a jacket.",
    features: ["Relaxed fit", "Lightweight fabric", "Breathable", "Everyday essential"],
    sizes: APPAREL_SIZES,
    colors: ["Soft Taupe", "Ivory"],
    isTrending: true,
    rating: 4.6,
    reviewCount: 67,
  },
  {
    code: "MM-PT-001",
    name: "Retro Wide-Leg Linen Pants",
    category: "pants",
    categoryName: "Pants",
    originalPrice: 560,
    salePrice: 429,
    image: "mm_pants",
    description:
      "High-waisted wide-leg trousers in a relaxed linen blend, cut for a fluid, elongating line.",
    features: ["High-waisted", "Wide-leg cut", "Linen blend", "Side pockets"],
    sizes: APPAREL_SIZES,
    colors: ["Stone", "Charcoal"],
    isBestSeller: true,
    featured: true,
    rating: 4.8,
    reviewCount: 89,
  },
  {
    code: "MM-SW-001",
    name: "Sculpted One-Piece Swimsuit",
    category: "swimwear",
    categoryName: "Swimwear",
    originalPrice: 480,
    salePrice: 369,
    image: "mm_swim",
    description:
      "A flattering one-piece with subtle ruching and a sculpting fit, finished in a warm solid tone for poolside ease.",
    features: ["Sculpting fit", "Subtle ruching", "Removable cups", "Quick-dry fabric"],
    sizes: APPAREL_SIZES,
    colors: ["Caramel", "Charcoal"],
    isNewArrival: true,
    isTrending: true,
    rating: 4.7,
    reviewCount: 52,
  },
  {
    code: "MM-HB-001",
    name: "PU Leather Shoulder Bag",
    category: "handbags",
    categoryName: "Handbags",
    originalPrice: 520,
    salePrice: 399,
    image: "mm_bag_shoulder",
    description:
      "A structured shoulder bag in warm caramel with a soft top handle and gold-tone hardware. Roomy enough for daily essentials.",
    features: ["Vegan PU leather", "Gold-tone hardware", "Interior pocket", "Adjustable strap"],
    sizes: ONE_SIZE,
    colors: ["Caramel", "Charcoal"],
    isBestSeller: true,
    isTrending: true,
    featured: true,
    rating: 4.9,
    reviewCount: 156,
  },
  {
    code: "MM-HB-002",
    name: "Champagne Evening Clutch",
    category: "handbags",
    categoryName: "Handbags",
    originalPrice: 380,
    salePrice: 289,
    image: "mm_bag_clutch",
    description:
      "A compact evening clutch with a subtle champagne sheen and detachable chain, made to finish your occasion look.",
    features: ["Detachable chain strap", "Magnetic closure", "Champagne sheen", "Compact silhouette"],
    sizes: ONE_SIZE,
    colors: ["Champagne Gold"],
    isNewArrival: true,
    rating: 4.8,
    reviewCount: 47,
  },
  {
    code: "MM-HB-003",
    name: "Square Buckle Crossbody Bag",
    category: "handbags",
    categoryName: "Handbags",
    originalPrice: 440,
    salePrice: 329,
    image: "mm_bag_crossbody",
    description:
      "A neat structured crossbody with a statement square buckle in soft taupe. Hands-free and elevated.",
    features: ["Structured silhouette", "Square buckle detail", "Adjustable crossbody strap", "Vegan PU leather"],
    sizes: ONE_SIZE,
    colors: ["Soft Taupe"],
    isTrending: true,
    rating: 4.7,
    reviewCount: 63,
  },
  {
    code: "MM-AC-001",
    name: "Leather Bag Charm & Tassel",
    category: "accessories",
    categoryName: "Accessories",
    originalPrice: 180,
    salePrice: 139,
    image: "mm_accessory",
    description:
      "A decorative leather charm and tassel keychain in caramel tones to personalise your favourite bag.",
    features: ["Caramel leather", "Tassel detail", "Clip-on hardware", "Lightweight"],
    sizes: ONE_SIZE,
    colors: ["Caramel"],
    isNewArrival: true,
    rating: 4.6,
    reviewCount: 34,
  },
  {
    code: "MM-JW-001",
    name: "Gold Layered Jewellery Set",
    category: "jewellery",
    categoryName: "Jewellery",
    originalPrice: 320,
    salePrice: 239,
    image: "mm_jewel_set",
    description:
      "A gilded set of hoop earrings and a layered necklace, designed to elevate everyday and evening looks alike.",
    features: ["Gold-tone finish", "Hoop earrings + necklace", "Tarnish-resistant", "Gift-ready"],
    sizes: ONE_SIZE,
    colors: ["Gold"],
    isBestSeller: true,
    isNewArrival: true,
    featured: true,
    rating: 4.9,
    reviewCount: 121,
  },
  {
    code: "MM-JW-002",
    name: "Statement Gold Hoop Earrings",
    category: "jewellery",
    categoryName: "Jewellery",
    originalPrice: 220,
    salePrice: 169,
    image: "mm_jewel_earrings",
    description:
      "Lightweight statement hoops with a polished gold-tone finish. The everyday earring with a little extra presence.",
    features: ["Polished gold-tone", "Lightweight design", "Secure clasp", "Tarnish-resistant"],
    sizes: ONE_SIZE,
    colors: ["Gold"],
    isTrending: true,
    rating: 4.8,
    reviewCount: 88,
  },
  {
    code: "MM-PF-001",
    name: "Signature Eau de Parfum",
    category: "perfumes",
    categoryName: "Perfumes",
    originalPrice: 460,
    salePrice: 349,
    image: "mm_perfume",
    description:
      "A warm, lingering signature scent with notes of amber and soft florals, presented in a champagne-gold flacon.",
    features: ["Amber & floral notes", "Long-lasting", "50ml flacon", "Champagne-gold cap"],
    sizes: ONE_SIZE,
    colors: ["50ml"],
    isNewArrival: true,
    featured: true,
    rating: 4.9,
    reviewCount: 76,
  },
];

const testimonials: InsertTestimonial[] = [
  {
    id: "t-001",
    name: "Naledi M.",
    location: "Johannesburg",
    rating: 5,
    quote:
      "The quality genuinely surprised me. My co-ord set arrived beautifully packaged and fits like it was made for me.",
    sortOrder: 1,
  },
  {
    id: "t-002",
    name: "Thandeka R.",
    location: "Cape Town",
    rating: 5,
    quote:
      "Modern Muse has become my go-to for occasion dressing. Elegant pieces at prices that feel fair.",
    sortOrder: 2,
  },
  {
    id: "t-003",
    name: "Aisha P.",
    location: "Durban",
    rating: 5,
    quote:
      "Fast delivery and the WhatsApp support team helped me choose the right size in minutes. Lovely experience.",
    sortOrder: 3,
  },
  {
    id: "t-004",
    name: "Lerato K.",
    location: "Pretoria",
    rating: 5,
    quote:
      "The handbags are stunning in person. I get compliments every single time I carry mine.",
    sortOrder: 4,
  },
];

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function main() {
  const products: InsertProduct[] = seedProducts.map((p, i) => ({
    id: `p-${String(i + 1).padStart(3, "0")}`,
    code: p.code,
    name: p.name,
    slug: slugify(p.name),
    description: p.description,
    features: p.features,
    category: p.category,
    categoryName: p.categoryName,
    originalPrice: p.originalPrice,
    salePrice: p.salePrice,
    images: [img(p.image)],
    sizes: p.sizes,
    colors: p.colors,
    isNewArrival: p.isNewArrival ?? false,
    isBestSeller: p.isBestSeller ?? false,
    isTrending: p.isTrending ?? false,
    featured: p.featured ?? false,
    rating: p.rating ?? 5,
    reviewCount: p.reviewCount ?? 0,
  }));

  await db.delete(productsTable);
  await db.delete(categoriesTable);
  await db.delete(collectionsTable);
  await db.delete(testimonialsTable);

  await db.insert(categoriesTable).values(categories);
  await db.insert(collectionsTable).values(collections);
  await db.insert(productsTable).values(products);
  await db.insert(testimonialsTable).values(testimonials);

  console.log(
    `Seeded ${categories.length} categories, ${collections.length} collections, ${products.length} products, ${testimonials.length} testimonials.`,
  );
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
