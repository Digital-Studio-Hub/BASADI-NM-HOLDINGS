import React from "react";

export default function ShippingReturns() {
  return (
    <div className="container mx-auto px-4 py-20 max-w-4xl">
      <div className="text-center mb-16">
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">Shipping & Returns</h1>
        <p className="text-lg text-muted-foreground">
          Everything you need to know about delivery times and our return policy.
        </p>
      </div>

      <div className="prose prose-lg max-w-none text-foreground">
        <div className="bg-card border border-border p-8 rounded-lg mb-12">
          <h2 className="font-serif text-2xl font-bold mb-4">Shipping Policy</h2>
          
          <h3 className="text-xl font-bold mt-6 mb-3">Delivery Times & Rates</h3>
          <p>We deliver nationwide across South Africa via our trusted courier partners.</p>
          <ul className="space-y-2 mt-4 mb-6">
            <li><strong>Standard Delivery (Major Centers):</strong> 3-5 working days — R99 (Free on orders over R1500)</li>
            <li><strong>Regional & Outlying Areas:</strong> 5-7 working days — R149</li>
            <li><strong>Dropshipped International Items:</strong> 10-15 working days (Clearly marked on product pages)</li>
          </ul>

          <h3 className="text-xl font-bold mt-6 mb-3">Order Tracking</h3>
          <p>Once your order is dispatched, you will receive an email containing a tracking number and a link to monitor your delivery's progress. Please allow up to 24 hours for tracking information to update on the courier's system.</p>
        </div>

        <div className="bg-card border border-border p-8 rounded-lg">
          <h2 className="font-serif text-2xl font-bold mb-4">Returns & Exchanges</h2>
          
          <p>We want you to love your Modern Muse purchase. If you are not completely satisfied, you can return or exchange eligible items within 14 days of delivery.</p>

          <h3 className="text-xl font-bold mt-6 mb-3">Return Conditions</h3>
          <ul className="space-y-2 mt-4 mb-6">
            <li>Items must be unworn, unwashed, and in their original condition.</li>
            <li>All original tags and packaging must remain attached and intact.</li>
            <li>For hygiene reasons, earrings, pierced jewellery, and opened perfumes cannot be returned unless faulty.</li>
            <li>Sale items are eligible for store credit only, no cash refunds.</li>
          </ul>

          <h3 className="text-xl font-bold mt-6 mb-3">How to Return</h3>
          <ol className="space-y-2 mt-4 mb-6 list-decimal pl-5">
            <li>Contact our customer care team via WhatsApp (076 757 8783) or email (info@modernmuse.co.za) within 14 days of receiving your order.</li>
            <li>Provide your order number and reason for return.</li>
            <li>Our team will arrange a courier collection from your address (a return shipping fee of R99 will be deducted from your refund).</li>
            <li>Once received and inspected at our warehouse, your refund or exchange will be processed within 3-5 working days.</li>
          </ol>

          <h3 className="text-xl font-bold mt-6 mb-3">Damaged or Faulty Items</h3>
          <p>If you receive a damaged or incorrect item, please notify us within 48 hours of delivery. We will arrange a replacement or full refund immediately, and cover all return shipping costs.</p>
        </div>
      </div>
    </div>
  );
}
