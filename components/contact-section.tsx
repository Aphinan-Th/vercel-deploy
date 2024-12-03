"use client";

import { Mail, MessageSquare, Phone } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
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
              <Phone className="h-5 w-5 text-primary" />
              <span>+1 (555) 123-4567</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-primary" />
              <span>contact@cephalometric.ai</span>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <Input placeholder="Your Name" className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed"/>
          <Input type="email" placeholder="Your Email" className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed" />
          <Textarea placeholder="Your Message" className="h-32 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed" />
          <Button className="w-full bg-blue-600 hover:bg-blue-700">
            <MessageSquare className="mr-2 h-4 w-4" />
            Send Message
          </Button>
        </div>
      </div>
    </SectionWrapper>
  );
}