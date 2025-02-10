import Image from "next/image";
import { StateDescriptionModel } from "@/app/diagnosis/states/cephaloState";
import { PointName } from "@/app/diagnosis/model/enum";

interface SampleImagesProps {
	currentStep: StateDescriptionModel;
}

export default function SampleImages({ currentStep }: SampleImagesProps) {

	if (currentStep.pointName === PointName.Distance) {
		return (
			<div>
				<h1 className="text-gray-700 text-lg font-bold pb-2">Sample image</h1>
				<p className="text-gray-700 text-sm">Point Name: {currentStep.title}</p>
				<p className="text-gray-700 text-sm">Description: {currentStep.description}</p>
				<div className="flex justify-center items-center text-center w-[500px] h-[500px] bg-gray-50 rounded-lg mt-4 shadow-3">
					<p className="text-gray-400 text-lg font-bold">No sample image</p>
				</div>
			</div>
		);
	}

	return (
		<div>
			<h1 className="text-gray-700 text-lg font-bold pb-2">Sample image</h1>
			<p className="text-gray-700 text-sm">Point Name: {currentStep.pointName}</p>
			<p className="text-gray-700 text-sm">Description: {currentStep.description}</p>
			<Image
				className="mt-4 shadow-3 rounded-md"
				src={currentStep.imagePath}
				alt={`Step ${currentStep.title} image`}
				style={{ width: "auto", height: "auto" }}
				width={500}
				height={500}
			/>
		</div>
	);
}
