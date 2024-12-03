"use client";

import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import Link from "next/link";

type SectionRefs = {
	home: React.RefObject<HTMLDivElement>;
	about: React.RefObject<HTMLDivElement>;
	services: React.RefObject<HTMLDivElement>;
	contact: React.RefObject<HTMLDivElement>;
};

export default function Navbar({ sectionRefs }: { sectionRefs: SectionRefs }) {
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
		ref.current?.scrollIntoView({ behavior: "smooth" });
		setIsMenuOpen(false);
	};

	const navItems = [
		{ label: "Home", ref: sectionRefs.home },
		{ label: "About", ref: sectionRefs.about },
		{ label: "Services", ref: sectionRefs.services },
		{ label: "Contact", ref: sectionRefs.contact },
	];

	return (
		<nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b">
			<div className="container mx-auto px-4 md:px-6">
				<div className="flex items-center justify-between h-16">
					<Link className="text-xl font-bold" href='/'>CephaloMetric</Link>

					{/* Desktop Navigation */}
					<div className="hidden md:flex items-center space-x-8">
						{navItems.map((item) => (
							<Button
								key={item.label}
								variant="ghost"
								onClick={() => {
									scrollToSection(item.ref);
									
								}}
								className="text-gray-600 hover:text-gray-900"
							>
								{item.label}
							</Button>
						))}
					</div>

					{/* Mobile Menu Button */}
					<button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
						{isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
					</button>
				</div>

				{/* Mobile Navigation */}
				{isMenuOpen && (
					<div className="md:hidden py-4">
						<div className="flex flex-col space-y-2">
							{navItems.map((item) => (
								<Button
									key={item.label}
									variant="ghost"
									onClick={() => scrollToSection(item.ref)}
									className="w-full text-left"
								>
									{item.label}
								</Button>
							))}
						</div>
					</div>
				)}
			</div>
		</nav>
	);
}
