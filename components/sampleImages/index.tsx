import { Step } from "@/app/diagnosis/type";
import { Dispatch, SetStateAction } from "react";
import Image from "next/image";
import { PointName } from "../canvas/enum";

interface SampleImagesProps {
	steps: Step[];
	currentStep: number;
	setCurrentStep: Dispatch<SetStateAction<number>>;
}

export default function SampleImages({ steps, currentStep }: SampleImagesProps) {
	const { pointName, description } = steps[currentStep];

	const getFile = (pointName: PointName) =>
		pointName === PointName.MeToLr ? `/assets/images/samples/Me.webp` : `/assets/images/samples/${pointName}.webp`;

	if (pointName === PointName.FrankfortPlane || pointName === PointName.Distance) {
		return (
			<div>
				<h1 className="text-gray-700 text-lg font-bold pb-2">Sample image</h1>
				<p className="text-gray-700 text-sm">Point Name: {pointName}</p>
				<p className="text-gray-700 text-sm">Description: {description}</p>
				<div className="flex justify-center items-center text-center w-[500px] h-[500px] bg-gray-50 rounded-lg mt-4 shadow-3">
					<p className="text-gray-400 text-lg font-bold">No sample image</p>
				</div>
			</div>
		);
	}

	return (
		<div>
			<h1 className="text-gray-700 text-lg font-bold pb-2">Sample image</h1>
			<p className="text-gray-700 text-sm">Point Name: {pointName}</p>
			<p className="text-gray-700 text-sm">Description: {description}</p>
			<Image
				className="mt-4 shadow-3 rounded-md"
				src={getFile(pointName)}
				alt={`Step ${currentStep + 1} image`}
				width={500}
				height={500}
			/>
		</div>
	);
}
