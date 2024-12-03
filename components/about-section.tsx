"use client";

import { CheckCircle } from "lucide-react";
import SectionWrapper from "./section-wrapper";

export default function AboutSection({ reference }: { reference: React.RefObject<HTMLDivElement> }) {
  const features = [
    "Advanced Analysis Tools",
    "Precise Measurements",
    "Quick Results",
    "Expert Support",
  ];

  return (
    <SectionWrapper reference={reference} className="bg-gray-50">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tighter mb-4">About Our Technology</h2>
          <p className="text-gray-600 mb-6">
            Our platform combines advanced imaging technology with professional dental expertise to provide accurate and efficient cephalometric analysis. We focus on delivering precise measurements and comprehensive diagnostic tools.
          </p>
          <ul className="space-y-3">
            {features.map((feature) => (
              <li key={feature} className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="relative h-[400px] rounded-lg overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1609840114035-3c981b782dfe?auto=format&fit=crop&q=80"
            alt="Dental Technology"
            className="object-cover w-full h-full"
          />
        </div>
      </div>
    </SectionWrapper>
  );
}