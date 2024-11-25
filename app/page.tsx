"use client";

import Navbar from "@/components/navbar";
import { useRef } from "react";

export default function Home() {
  const sectionRefs = {
    home: useRef<HTMLDivElement>(null),
    about: useRef<HTMLDivElement>(null),
    services: useRef<HTMLDivElement>(null),
    contact: useRef<HTMLDivElement>(null),
  };

  return (
    <div>
      <Navbar sectionRefs={sectionRefs} />
      <header
        ref={sectionRefs.home}
        className="h-screen flex items-center justify-center bg-white text-black"
      >
        <h1 className="text-5xl font-bold">Welcome to My Landing Page</h1>
      </header>
      <section
        ref={sectionRefs.about}
        className="h-screen flex flex-col items-center justify-center bg-gray-100 text-black text-center"
      >
        <h2 className="text-3xl font-bold mb-4">About Us</h2>
        <p className="max-w-md">
          We are dedicated to providing the best services to our clients. Our
          team of experts is committed to excellence and innovation. Lorem ipsum
          dolor sit amet, consectetur adipiscing elit. Proin et risus vel urna
          auctor aliquet at et dui.
        </p>
      </section>
      <section
        ref={sectionRefs.services}
        className="h-screen flex flex-col items-center justify-center bg-white text-black text-center"
      >
        <h2 className="text-3xl font-bold mb-4">Our Services</h2>
        <p className="max-w-md">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
          tincidunt eros ut neque dignissim, nec feugiat magna lacinia.
        </p>
      </section>
      <section
        ref={sectionRefs.contact}
        className="h-screen flex flex-col items-center justify-center bg-gray-200 text-black text-center"
      >
        <h2 className="text-3xl font-bold mb-4">Contact Us</h2>
        <p className="max-w-md">
          We would love to hear from you! Reach out to us for inquiries,
          support, or feedback. Lorem ipsum dolor sit amet, consectetur
          adipiscing elit. Vivamus euismod turpis sit amet quam bibendum, at
          vehicula libero lacinia.
        </p>
      </section>
    </div>
  );
}
