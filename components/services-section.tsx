"use client";

import { Brain, Images, Ruler, Clock, FileText, TrendingUp, ArrowLeftRight, History } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import SectionWrapper from "./section-wrapper";
import { useRouter } from "next/navigation";

export default function ServicesSection({ reference }: { reference: React.RefObject<HTMLDivElement> }) {
	const router = useRouter();

	const handleNavigate = (path: string) => {
		router.push(path);
	};
	const services = [
		{
			icon: Brain,
			title: "Cephalometric Analysis",
			description:
				"Professional analysis tools providing accurate measurements and detailed reports for comprehensive dental diagnostics.",
			path: "/diagnosis",
			features: [
				{
					icon: Ruler,
					title: "Precise Measurements",
					description: "Advanced landmark detection and angular measurements",
				},
				{
					icon: Clock,
					title: "Efficient Processing",
					description: "Quick analysis completion for faster results",
				},
				{
					icon: FileText,
					title: "Detailed Reports",
					description: "Comprehensive analysis reports with visualizations",
				},
				{
					icon: TrendingUp,
					title: "Treatment Planning",
					description: "Tools to assist in treatment planning and monitoring",
				},
			],
		},
		{
			icon: Images,
			title: "Image Comparison",
			description:
				"Specialized tools for comparing and analyzing dental images over time, helping track changes and treatment progress effectively.",
			path: "/comparison",
			features: [
				{
					icon: ArrowLeftRight,
					title: "Side-by-Side Analysis",
					description: "Compare images with synchronized tools",
				},
				{
					icon: History,
					title: "Timeline Tracking",
					description: "Monitor changes over treatment period",
				},
				{
					icon: TrendingUp,
					title: "Progress Visualization",
					description: "Visual representation of changes",
				},
				{
					icon: FileText,
					title: "Comparison Reports",
					description: "Generate detailed comparison reports",
				},
			],
		},
	];

	return (
		<SectionWrapper reference={reference} className="bg-white">
			<div className="text-center mb-12">
				<h2 className="text-3xl font-bold tracking-tighter mb-4">Our Services</h2>
				<p className="text-gray-600 max-w-[600px] mx-auto">
					Professional dental imaging solutions for comprehensive analysis and comparison
				</p>
			</div>
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
				{services.map((service) => (
					<Card key={service.title} className="p-8 hover:shadow-lg transition-all duration-300">
						<div className="flex flex-col h-full">
							<div className="flex items-center gap-4 mb-6">
								<div className="p-3 rounded-lg bg-primary/10">
									<service.icon className="h-8 w-8 text-primary" />
								</div>
								<div>
									<h3 className="text-2xl font-semibold">{service.title}</h3>
								</div>
							</div>
							<p className="text-gray-600 mb-8">{service.description}</p>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
								{service.features.map((feature) => (
									<div key={feature.title} className="flex items-start gap-3">
										<feature.icon className="h-5 w-5 text-primary mt-1" />
										<div>
											<h4 className="font-medium">{feature.title}</h4>
											<p className="text-sm text-gray-600">{feature.description}</p>
										</div>
									</div>
								))}
							</div>
							<div className="mt-auto">
								<Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={() => handleNavigate(service.path)}>
									Try {service.title}
								</Button>
							</div>
						</div>
					</Card>
				))}
			</div>
		</SectionWrapper>
	);
}
