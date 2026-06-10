import React from "react";

export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto px-4 py-20 max-w-3xl">
      <div className="mb-12">
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">Privacy Policy</h1>
        <p className="text-muted-foreground">Last Updated: October 2024</p>
      </div>

      <div className="prose prose-lg max-w-none text-foreground">
        <p>At Modern Muse by Basadi NM Holdings, we respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website or make a purchase.</p>

        <h2 className="font-serif text-2xl font-bold mt-8 mb-4">1. Information We Collect</h2>
        <p>We may collect and process the following data about you:</p>
        <ul>
          <li><strong>Identity Data:</strong> First name, last name, title.</li>
          <li><strong>Contact Data:</strong> Billing address, delivery address, email address, and telephone numbers.</li>
          <li><strong>Financial Data:</strong> Payment details (processed securely via our payment gateways; we do not store full card numbers).</li>
          <li><strong>Transaction Data:</strong> Details about payments to and from you and other details of products you have purchased from us.</li>
          <li><strong>Technical Data:</strong> IP address, browser type and version, time zone setting, browser plug-in types and versions, operating system and platform.</li>
        </ul>

        <h2 className="font-serif text-2xl font-bold mt-8 mb-4">2. How We Use Your Information</h2>
        <p>We use your data to:</p>
        <ul>
          <li>Process and deliver your orders.</li>
          <li>Manage payments, fees, and charges.</li>
          <li>Communicate with you about your order or customer service inquiries.</li>
          <li>Send marketing communications (if you have opted in).</li>
          <li>Improve our website, products, services, marketing, and customer relationships.</li>
        </ul>

        <h2 className="font-serif text-2xl font-bold mt-8 mb-4">3. Data Security</h2>
        <p>We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used, or accessed in an unauthorized way, altered, or disclosed. All payment transactions are encrypted using SSL technology.</p>

        <h2 className="font-serif text-2xl font-bold mt-8 mb-4">4. Sharing Your Information</h2>
        <p>We may share your data with trusted third parties who assist us in operating our website, conducting our business, or serving you (e.g., courier partners, payment gateways). These parties agree to keep this information confidential and secure.</p>

        <h2 className="font-serif text-2xl font-bold mt-8 mb-4">5. Your Legal Rights</h2>
        <p>Under the Protection of Personal Information Act (POPIA), you have the right to request access to, correction of, or deletion of your personal data. To exercise these rights, please contact us at info@modernmuse.co.za.</p>
      </div>
    </div>
  );
}
