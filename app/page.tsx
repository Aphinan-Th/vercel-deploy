"use client";

import AboutSection from "@/components/about-section";
import ContactSection from "@/components/contact-section";
import HeroSection from "@/components/hero-section";
import Navbar from "@/components/navbar";
import ServicesSection from "@/components/services-section";
import { useRef } from "react";

export default function Home() {
  const sectionRefs = {
    home: useRef<HTMLDivElement>(null),
    about: useRef<HTMLDivElement>(null),
    services: useRef<HTMLDivElement>(null),
    contact: useRef<HTMLDivElement>(null),
  };

  return (
    <main className="min-h-screen">
      <Navbar sectionRefs={sectionRefs} />
      <HeroSection reference={sectionRefs.home} />
      <AboutSection reference={sectionRefs.about} />
      <ServicesSection reference={sectionRefs.services} />
      <ContactSection reference={sectionRefs.contact} />
    </main>
  );
}