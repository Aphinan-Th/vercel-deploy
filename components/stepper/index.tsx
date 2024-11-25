"use client";
import { Dispatch, SetStateAction } from "react";

interface Step {
	title: string;
	description: string;
}

interface StepperProps {
	steps: Step[];
	currentStep: number;
	setCurrentStep: Dispatch<SetStateAction<number>>;
}

export default function Stepper({ steps, currentStep }: StepperProps) {
	const getVisibleSteps = () => {
		const start = Math.max(currentStep - 2, 0);
		if (start === 0) return steps.slice(0, 5);

		const end = Math.min(currentStep + 3, steps.length);
		if (currentStep >= steps.length - 3) return steps.slice(-5);

		return steps.slice(start, end);
	};

	const renderStepIndicator = (stepIndex: number) => {
		return stepIndex < currentStep ? (
			<svg
				className="w-3.5 h-3.5 text-green-500"
				aria-hidden="true"
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 16 12"
			>
				<path
					stroke="currentColor"
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth="2"
					d="M1 5.917 5.724 10.5 15 1.5"
				/>
			</svg>
		) : (
			<span className="text-gray-500">{stepIndex + 1}</span>
		);
	};

	const renderSteps = () => {
		const visibleSteps = getVisibleSteps();
		return visibleSteps.map((step) => {
			const stepIndex = steps.indexOf(step);
			return (
				<li key={stepIndex} className="mb-10 ms-6 w-32 h-9">
					<span
						className={`absolute flex items-center justify-center w-8 h-8 rounded-full -start-4 ring-4 ring-white ${
							stepIndex < currentStep
								? "bg-green-100 border border-green-300"
								: "bg-gray-100"
						}`}
					>
						{renderStepIndicator(stepIndex)}
					</span>
					<h3 className="font-medium leading-tight">{step.title}</h3>
					<p className="text-xs text-gray-400">{step.description}</p>
				</li>
			);
		});
	};

	return (
		<div>
			<ol className="relative text-gray-500 border-s border-gray-20">
				{renderSteps()}
			</ol>
		</div>
	);
}
