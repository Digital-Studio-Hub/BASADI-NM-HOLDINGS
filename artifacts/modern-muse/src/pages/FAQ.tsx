import React from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function FAQ() {
  return (
    <div className="container mx-auto px-4 py-20 max-w-4xl">
      <div className="text-center mb-16">
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">Frequently Asked Questions</h1>
        <p className="text-lg text-muted-foreground">
          Find answers to common questions about our products, shipping, and returns.
        </p>
      </div>

      <Accordion type="single" collapsible className="w-full space-y-4">
        <AccordionItem value="item-1" className="border border-border rounded-lg px-6 bg-card">
          <AccordionTrigger className="font-serif text-xl hover:no-underline hover:text-primary py-6">
            How long does delivery take?
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground pb-6 text-base">
            Standard delivery takes 3-5 working days within major South African cities. Regional and outlying areas may take 5-7 working days. Since we operate a dropshipping model for certain international items, some specific products may take 10-15 working days. Delivery times are specified on each product page.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2" className="border border-border rounded-lg px-6 bg-card">
          <AccordionTrigger className="font-serif text-xl hover:no-underline hover:text-primary py-6">
            What is your return policy?
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground pb-6 text-base">
            We accept returns within 14 days of delivery. Items must be unworn, unwashed, with all original tags attached. For hygiene reasons, jewellery (earrings) and perfumes cannot be returned unless faulty. Please contact our customer care team via WhatsApp or email to initiate a return.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-3" className="border border-border rounded-lg px-6 bg-card">
          <AccordionTrigger className="font-serif text-xl hover:no-underline hover:text-primary py-6">
            Are your payment methods secure?
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground pb-6 text-base">
            Yes, completely secure. We use trusted South African payment gateways including PayFast, Peach Payments, and Ozow. We do not store your credit card information on our servers.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-4" className="border border-border rounded-lg px-6 bg-card">
          <AccordionTrigger className="font-serif text-xl hover:no-underline hover:text-primary py-6">
            How do I track my order?
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground pb-6 text-base">
            Once your order has been dispatched, you will receive an email with your tracking number and a link to track your parcel. You can also message us on WhatsApp with your order number for quick updates.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-5" className="border border-border rounded-lg px-6 bg-card">
          <AccordionTrigger className="font-serif text-xl hover:no-underline hover:text-primary py-6">
            Do you have physical stores?
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground pb-6 text-base">
            Modern Muse is currently an exclusive online boutique. Operating online allows us to offer premium fashion at more accessible prices by eliminating retail overheads.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-6" className="border border-border rounded-lg px-6 bg-card">
          <AccordionTrigger className="font-serif text-xl hover:no-underline hover:text-primary py-6">
            Can I change or cancel my order?
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground pb-6 text-base">
            Orders are processed quickly to ensure fast delivery. If you need to make changes, please contact us via WhatsApp immediately within 2 hours of placing the order. Once an order has been dispatched, it cannot be changed or cancelled.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
