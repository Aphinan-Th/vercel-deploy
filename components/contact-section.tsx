"use client";

import { Mail } from "lucide-react";
import SectionWrapper from "./section-wrapper";

export default function ContactSection({ reference }: { reference: React.RefObject<HTMLDivElement> }) {
  return (
    <SectionWrapper reference={reference} className="bg-gray-50">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-3xl font-bold tracking-tighter mb-4">Get in Touch</h2>
          <p className="text-gray-600 mb-8">
            {"Have questions about our services? We're here to help. Contact us using the form or through our direct contact channels."}
          </p>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-primary" />
              <span>nudentestheticclinic@gmail.com</span>
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}