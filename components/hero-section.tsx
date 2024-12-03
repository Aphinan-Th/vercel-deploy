"use client";

import { ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import SectionWrapper from "./section-wrapper";
import { useRouter } from "next/navigation";

export default function HeroSection({ reference }: { reference: React.RefObject<HTMLDivElement> }) {
	const router = useRouter();

	const navigateToDiagnosis = () => {
		router.push("/diagnosis");
	};

	return (
		<SectionWrapper
			reference={reference}
			className="relative overflow-hidden bg-gradient-to-b from-white to-gray-50"
		>
			<div className="absolute inset-0 bg-grid-black/[0.02] bg-[size:20px_20px]" />
			<div className="flex flex-col items-center text-center z-10">
				<h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500 hover:bg-blue-700 animate-fade-in">
					Professional Cephalometric Analysis
				</h1>

				<p className="mt-4 text-xl text-gray-600 max-w-[700px] animate-fade-in-up">
					Advanced tools for precise dental measurements and comprehensive image analysis to enhance your
					diagnostic capabilities
				</p>
				<div className="flex gap-4 mt-8">
					<Button
						size="lg"
						className="group relative z-20 bg-blue-600 hover:bg-blue-700"
						onClick={navigateToDiagnosis}
					>
						Get Started
						<ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
					</Button>
					<Button size="lg" variant="outline" className="group relative z-20">
						Learn More
					</Button>
				</div>
			</div>
		</SectionWrapper>
	);
}
