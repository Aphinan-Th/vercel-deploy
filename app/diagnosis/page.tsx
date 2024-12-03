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
import ActionButtons from "@/components/actionButtons";
import { steps } from "./steps";
import { CanvasRef, Result } from "@/components/canvas/type";
import SampleImages from "@/components/sampleImages";
import html2canvas from "html2canvas";
import JSZip from "jszip";
import Link from "next/link";

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

	const generateZipFile = async () => {
		const imageFile = await generateImage();
		const jsonFile = generateJsonFile();

		if (imageFile && jsonFile) {
			const zip = new JSZip();

			zip.file("canvas_point.json", jsonFile);
			zip.file("cephalometric_result.png", imageFile);

			const zipBlob = await zip.generateAsync({ type: "blob" });
			triggerDownload(zipBlob, "result.zip");
		}
	};

	const generateImage = async (): Promise<Blob | null> => {
		if (canvasRef.current?.current != null) {
			const canvas = await html2canvas(canvasRef.current.current);
			const imageData = canvas.toDataURL("image/png");
			const imageBlob = await (await fetch(imageData)).blob();
			return imageBlob;
		} else {
			return null;
		}
	};

	const triggerDownload = (blob: Blob, filename: string) => {
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = filename;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(url);
	};

	const generateJsonFile = (): string => {
		const rawData = canvasRef.current?.drawingActions;
		const jsonString = JSON.stringify(rawData, null, 2);
		return jsonString;
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
		<div className="min-h-screen">
			<nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b">
				<div className="container mx-auto px-4 md:px-6">
					<div className="flex items-center justify-between h-16">
						<Link className="text-xl font-bold " href="/">
							CephaloMetric
						</Link>
					</div>
				</div>
			</nav>
			<div className="px-10 min-h-screen items-center justify-center py-24">
				<div className="flex flex-row gap-1 pb-2 border-b mb-2 items-center">
					<Link className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500 text-center leading-tight w-fit pr-6" href={"/"}>
						Diagnosis
					</Link>
					<ActionButtons
						clearAll={clearAll}
						clearCanvas={clearCanvasDrawing}
						rotateImageUp={() => setAngle((a) => a + 0.005)}
						rotateImageDown={() => setAngle((a) => a - 0.005)}
						prevStep={() => setCurrentStep((s) => Math.max(s - 1, 0))}
						saveResult={generateZipFile}
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
											{renderTable(
												toothHeaders,
												toothData(result),
												"bg-green-200",
												"text-green-500"
											)}
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
									<SampleImages
										steps={steps}
										currentStep={currentStep}
										setCurrentStep={setCurrentStep}
									/>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Diagnosis;
