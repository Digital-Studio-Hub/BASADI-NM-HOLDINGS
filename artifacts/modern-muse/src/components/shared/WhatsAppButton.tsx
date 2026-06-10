import React from "react";
import { FaWhatsapp } from "react-icons/fa";

export function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/27767578783"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-lg hover:scale-110 transition-transform duration-300 ease-out focus:outline-none focus:ring-4 focus:ring-[#25D366]/50 group"
      aria-label="Chat with us on WhatsApp"
      title="Need help? Chat with us"
    >
      <span className="absolute inset-0 rounded-full animate-ping bg-[#25D366] opacity-20"></span>
      <FaWhatsapp className="w-8 h-8 relative z-10" />
      <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-white text-gray-800 text-sm font-medium px-4 py-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap hidden md:block">
        Need help? Chat with us
      </div>
    </a>
  );
}
