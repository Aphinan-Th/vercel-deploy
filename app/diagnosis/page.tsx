"use client";

import ImageSelector from "@/components/image_selector";
import Stepper from "@/components/stepper";
import React, { useEffect, useRef, useState } from "react";
import Canvas from "@/components/canvas";
import {
	measurementHeaders,
	measurementData,
	skeletalHeaders,
	skeletalData,
	toothHeaders,
	toothData,
	labialHeaders,
	labialData,
	surgicalHeaders,
	surgicalTendencyData,
	dentureFrameHeaders,
	dentureFrameData,
} from "./masterData";
import ActionButtons from "@/components/actionButtons"; // New component for buttons
import { steps } from "./steps";
import { CanvasRef, Result } from "@/components/canvas/type";
import SampleImages from "@/components/sampleImages";

const Diagnosis: React.FC = () => {
	const canvasRef = useRef<CanvasRef | null>(null);
	const [selectedImage, setSelectedImage] = useState<File | null>(null);
	const [pxToCen, setPxToCen] = useState<number | undefined>();
	const [angle, setAngle] = useState<number>(0);
	const [currentStep, setCurrentStep] = useState<number>(0);
	const [result, setResult] = useState<Result>({});

	useEffect(() => {
		console.log(`>>> pxToCen ${pxToCen}`);
	}, [pxToCen]);

	const clearAll = () => {
		setAngle(0);
		setCurrentStep(0);
		setSelectedImage(null);
		clearCanvasDrawing();
	};

	const clearCanvasDrawing = () => {
		if (canvasRef.current) {
			canvasRef.current.clearDraw();
		}
	};

	const handleFileSelect = (file: File) => {
		setSelectedImage(file);
	};

	const renderTableRow = (row: (string | null)[], rowIndex: number, textColor: string) => (
		<tr key={rowIndex} className="bg-white border-b border-t">
			{row.map((cell, cellIndex) => (
				<td key={cellIndex} className={`px-6 py-3 whitespace-nowrap ${textColor}`}>
					{cell}
				</td>
			))}
		</tr>
	);

	const renderTable = (headers: string[], data: (string | null)[][], headerColor: string, textColor: string) => (
		<>
			<tr className={headerColor}>
				{headers.map((header, index) => (
					<th key={index} className="px-6 py-3 text-nowrap font-semibold">
						{header}
					</th>
				))}
			</tr>
			{data.map((e, i) => renderTableRow(e, i, textColor))}
		</>
	);

	return (
		<div className="bg-white px-10 py-10">
			<div className="flex flex-row gap-1 pb-2 border-b mb-2 items-center">
				<h1 className="text-3xl text-blue-400 font-bold pr-6">Diagnosis</h1>
				<ActionButtons
					clearAll={clearAll}
					clearCanvas={clearCanvasDrawing}
					rotateImageUp={() => setAngle((a) => a + 0.005)}
					rotateImageDown={() => setAngle((a) => a - 0.005)}
					prevStep={() => setCurrentStep((s) => Math.max(s - 1, 0))}
				/>
			</div>
			<div className="flex items-start h-screen bg-white gap-5">
				<Stepper steps={steps} currentStep={currentStep} setCurrentStep={setCurrentStep} />
				<div className="h-full flex flex-col w-1/2">
					{selectedImage ? (
						<div className="flex flex-row">
							<Canvas
								ref={canvasRef}
								imageFile={selectedImage}
								imageAngle={angle}
								steps={steps}
								currentStep={currentStep}
								setCurrentStep={setCurrentStep}
								updatePxToCen={setPxToCen}
								resetAngle={() => setAngle(0)}
								setResult={setResult}
							/>
						</div>
					) : (
						<div className="h-full flex items-center bg-gray-50 text-gray-800 flex-col">
							<ImageSelector onImageDataChange={handleFileSelect} />
						</div>
					)}
				</div>
				<div className="h-full overflow-auto">
					<div className="overflow-x-auto">
						<div className="flex flex-col">
							{currentStep === steps.length ? (
								<table className="w-full text-sm text-left rtl:text-right text-gray-500 border-t border-gray-300 table-auto">
									<tbody>
										{renderTable(
											measurementHeaders,
											measurementData(result),
											"bg-red-200",
											"text-red-500"
										)}
										{renderTable(
											skeletalHeaders,
											skeletalData(result),
											"bg-blue-200",
											"text-blue-500"
										)}
										{renderTable(toothHeaders, toothData(result), "bg-green-200", "text-green-500")}
										{renderTable(
											labialHeaders,
											labialData(result),
											"bg-orange-200",
											"text-orange-500"
										)}
										{renderTable(
											surgicalHeaders,
											surgicalTendencyData(result),
											"bg-purple-200",
											"text-purple-500"
										)}
										{renderTable(
											dentureFrameHeaders,
											dentureFrameData(result),
											"bg-indigo-200",
											"text-indigo-500"
										)}
									</tbody>
								</table>
							) : (
								<SampleImages steps={steps} currentStep={currentStep} setCurrentStep={setCurrentStep} />
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Diagnosis;
