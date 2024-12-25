"use client";

import ImageSelector from "@/components/imageSelector";
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
import { steps } from "./steps";
import { CanvasRef, Result } from "@/components/canvas/type";
import SampleImages from "@/components/sampleImages";
import html2canvas from "html2canvas";
import JSZip from "jszip";
import Link from "next/link";
import * as fabric from "fabric";
import { FabricImage } from "fabric";
import { FabricJSCanvas, useFabricJSEditor } from "fabricjs-react";
import { Eraser, ImagePlus, Move, PenTool, RotateCcw, RotateCw, Save, Trash2, Undo2, MoveUp, MoveDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Interpretation, Measurement, Step, TableRow } from "./type";

enum Tab {
	Diagnosis = "Diagnosis",
	Drawing = "Drawing",
}

export default function Diagnosis() {
	const canvasRef = useRef<CanvasRef | null>(null);
	const [selectedImage, setSelectedImage] = useState<File | null>(null);
	const [angle, setAngle] = useState<number>(0);
	const [currentStep, setCurrentStep] = useState<number>(0);
	const [result, setResult] = useState<Result>({});
	const { editor: backGroundEditor, onReady: onBackgroundReady } = useFabricJSEditor();
	const { editor: drawingEditor, onReady: onDrawingReady } = useFabricJSEditor();
	const [activeTab, setActiveTab] = useState(Tab.Diagnosis);
	const [isDrawingMode, setIsDrawingMode] = useState(false);

	const isActive = (tabName: string) => {
		return activeTab === tabName
			? "text-blue-600 border-blue-600 dark:text-blue-500 dark:border-blue-500"
			: "text-gray-500 dark:text-gray-400";
	};

	useEffect(() => {
		const addImageToCanvas = (file: File | null) => {
			if (!file) return;

			const url = URL.createObjectURL(file);

			FabricImage.fromURL(url, { crossOrigin: "anonymous" })
				.then((img: fabric.Image) => {
					img.set({ left: 0, top: 0, scaleY: 1, scaleX: 1 });
					backGroundEditor?.canvas.add(img.set({ left: 0, top: 0, scaleY: 0.5, scaleX: 0.5, opacity: 1 }));
					backGroundEditor?.canvas.centerObject(img);
					backGroundEditor?.canvas.setActiveObject(img);

					const activeObject = backGroundEditor?.canvas.getActiveObject();
					if (!activeObject) return;

					activeObject.selectable = false;
					activeObject.evented = false;
					activeObject.hoverCursor = "pointer";
				})
				.finally(() => {
					URL.revokeObjectURL(url);
					backGroundEditor?.canvas.discardActiveObject();
				});
		};

		if (selectedImage) addImageToCanvas(selectedImage);
	}, [selectedImage, backGroundEditor]);

	const addToothToCanvas = () => {
		setIsDrawingMode(false);
		FabricImage.fromURL("/assets/images/tooth.webp", { crossOrigin: "anonymous" }).then((img: fabric.Image) => {
			drawingEditor?.canvas.add(img.set({ left: 0, top: 0, scaleY: 0.5, scaleX: 0.5, opacity: 1 }));
			drawingEditor?.canvas.centerObject(img);
			drawingEditor?.canvas.setActiveObject(img);
		});
	};

	const removeImageFromCanvas = () => {
		drawingEditor?.deleteSelected();
	};

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
		const zip = new JSZip();

		if (selectedImage) {
			const originalImage = new Blob([selectedImage], { type: selectedImage?.type });
			zip.file("original_image.png", originalImage);
		}

		const jsonFile = generateJsonFile();
		zip.file("diagnosis_result.json", jsonFile);

		if (activeTab === Tab.Drawing) {
			const drawImage = await generateDrawImage();
			if (drawImage) zip.file("draw_image.png", drawImage);
		}

		const zipBlob = await zip.generateAsync({ type: "blob" });
		triggerDownload(zipBlob, "result.zip");
	};

	const generateDrawImage = async () => {
		if (drawingEditor?.canvas) {
			const canvas = await html2canvas(drawingEditor?.canvas.getElement());
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
		const jsonResult = {
			drawingActions: JSON.parse(localStorage.getItem("drawingActions") || ""),
			measurement: generateMeasurement(),
		};
		return JSON.stringify(jsonResult, null, 2);
	};

	const generateMeasurement = (): Measurement => {
		return {
			yAxis: result.yAxis,
			fma: result.fma,
			gonionAngle: result.gonionAngle,
			cranialBaseAngle: result.cranialBaseAngle,
			sna: result.sna,
			snb: result.snb,
			anb: result.anb,
			pointAToNvert: result.pointAToNvert,
			witsAppraisal: result.witsAppraisal,
			interincisalAngle: result.interincisalAngle,
			oneToSN: result.oneToSN,
			fmia: result.fmia,
			impa: result.impa,
			convexityToPointA: result.convexityToPointA,
			lowerLipToEPlane: result.lowerLipToEPlane,
			oneToABPlane: result.oneToABPlane,
			palatalPlane: result.palatalPlane,
			dpo: result.dpo,
			angleOfCondylarPathVSOccPlane: result.angleOfCondylarPathVSOccPlane,
		};
	};

	const handleCanvasModeChange = (isDrawingMode: boolean, canvas: fabric.Canvas) => {
		if (isDrawingMode) {
			canvas.isDrawingMode = true;
			canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
			canvas.freeDrawingBrush.color = "blue";
			canvas.freeDrawingBrush.width = 3;
		} else {
			canvas.isDrawingMode = false;
		}
	};

	useEffect(() => {
		if (!drawingEditor?.canvas) return;
		handleCanvasModeChange(isDrawingMode, drawingEditor.canvas);
	}, [drawingEditor, isDrawingMode]);

	useEffect(() => {
		localStorage.setItem("drawingActions", JSON.stringify([], null, 2));
	}, [selectedImage]);

	return (
		<div className="min-h-screen">
			<Navbar />
			<div className="px-10 min-h-screen items-center justify-center py-16">
				<div className="border-b border-gray-200 dark:border-gray-700 mb-4 flex justify-between align-middle items-center">
					<ul className="flex flex-wrap -mb-px text-sm font-medium text-center">
						{[Tab.Diagnosis, Tab.Drawing].map((tab, idx) => (
							<li className="me-2" key={idx}>
								<div
									onClick={() => setActiveTab(tab)}
									className={`inline-flex items-center justify-center p-4 border-b-2 rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group ${isActive(
										tab
									)}`}
								>
									{tab.toString()}
								</div>
							</li>
						))}
					</ul>
					{activeTab === Tab.Diagnosis ? (
						<DiagnosisButtons
							clearAll={clearAll}
							clearCanvasDrawing={clearCanvasDrawing}
							setAngle={setAngle}
							setCurrentStep={setCurrentStep}
							generateZipFile={generateZipFile}
						/>
					) : (
						<OtherTabButtons
							removeImageFromCanvas={removeImageFromCanvas}
							addToothToCanvas={addToothToCanvas}
							setIsDrawingMode={setIsDrawingMode}
							generateZipFile={generateZipFile}
						/>
					)}
				</div>
				<div className="flex items-start h-screen bg-white gap-5">
					<Stepper steps={steps} currentStep={currentStep} setCurrentStep={setCurrentStep} />
					{activeTab === Tab.Diagnosis ? (
						<DiagnosisTab
							selectedImage={selectedImage}
							angle={angle}
							setAngle={setAngle}
							steps={steps}
							currentStep={currentStep}
							setCurrentStep={setCurrentStep}
							setResult={setResult}
							canvasRef={canvasRef}
							handleFileSelect={handleFileSelect}
							result={result}
						/>
					) : (
						<OtherTab
							selectedImage={selectedImage}
							onBackgroundReady={onBackgroundReady}
							onDrawingReady={onDrawingReady}
							handleFileSelect={handleFileSelect}
						/>
					)}
				</div>
			</div>
		</div>
	);
}

const Navbar: React.FC = () => {
	return (
		<nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b">
			<div className="container mx-auto px-4 md:px-6">
				<div className="flex items-center justify-between h-16">
					<Link className="text-xl font-bold " href="/">
						CephaloMetric
					</Link>
				</div>
			</div>
		</nav>
	);
};

const ActionButton = ({
	onClick,
	icon: Icon,
	label,
}: {
	onClick: () => void;
	icon: React.ElementType;
	label: string;
}) => (
	<Button variant="ghost" onClick={onClick} className="text-gray-600 hover:text-gray-900 gap-1">
		<Icon width="24" height="24" /> {label}
	</Button>
);

const DiagnosisButtons = ({
	clearAll,
	clearCanvasDrawing,
	setAngle,
	setCurrentStep,
	generateZipFile,
}: {
	clearAll: () => void;
	clearCanvasDrawing: () => void;
	setAngle: React.Dispatch<React.SetStateAction<number>>;
	setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
	generateZipFile: () => void;
}) => (
	<div className="flex gap-1">
		<ActionButton onClick={clearAll} icon={Trash2} label="Remove Image" />
		<ActionButton onClick={clearCanvasDrawing} icon={Eraser} label="Clean Canvas" />
		<ActionButton onClick={() => setAngle((a) => a + 0.005)} icon={RotateCcw} label="Rotate Left" />
		<ActionButton onClick={() => setAngle((a) => a - 0.005)} icon={RotateCw} label="Rotate Right" />
		<ActionButton onClick={() => setCurrentStep((s) => Math.max(s - 1, 0))} icon={Undo2} label="Undo" />
		<ActionButton onClick={generateZipFile} icon={Save} label="Save" />
	</div>
);

const OtherTabButtons = ({
	removeImageFromCanvas,
	addToothToCanvas,
	setIsDrawingMode,
	generateZipFile,
}: {
	removeImageFromCanvas: () => void;
	addToothToCanvas: () => void;
	setIsDrawingMode: React.Dispatch<React.SetStateAction<boolean>>;
	generateZipFile: () => void;
}) => (
	<div className="flex gap-1">
		<ActionButton onClick={removeImageFromCanvas} icon={Trash2} label="Remove select element" />
		<ActionButton onClick={addToothToCanvas} icon={ImagePlus} label="Add Tooth" />
		<ActionButton onClick={() => setIsDrawingMode(false)} icon={Move} label="Move" />
		<ActionButton onClick={() => setIsDrawingMode(true)} icon={PenTool} label="Pen tool" />
		<ActionButton onClick={generateZipFile} icon={Save} label="Save" />
	</div>
);

const ImageSection = ({
	selectedImage,
	onImageDataChange,
	canvasRef,
	angle,
	setAngle,
	steps,
	currentStep,
	setCurrentStep,
	setResult,
}: {
	selectedImage: File | null;
	onImageDataChange: (file: File) => void;
	canvasRef: React.RefObject<CanvasRef>;
	angle: number;
	setAngle: React.Dispatch<React.SetStateAction<number>>;
	steps: Step[];
	currentStep: number;
	setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
	setResult: React.Dispatch<React.SetStateAction<Result>>;
}) => (
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
					resetAngle={() => setAngle(0)}
					setResult={setResult}
				/>
			</div>
		) : (
			<div className="h-full flex items-center bg-gray-50 text-gray-800 flex-col">
				<ImageSelector onImageDataChange={onImageDataChange} />
			</div>
		)}
	</div>
);

const TableSection = ({
	result,
	steps,
	currentStep,
	setCurrentStep,
}: {
	result: Result;
	steps: Step[];
	currentStep: number;
	setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
	setResult: React.Dispatch<React.SetStateAction<Result>>;
}) => {
	const renderTableRow = (row: TableRow, rowIndex: number, textColor: string) => (
		<>
			<tr key={rowIndex} className="bg-white border-b border-t">
				<td key={rowIndex} className={`px-3 py-3 ${textColor}`}>
					{row.title}
				</td>
				<td key={rowIndex} className={`px-3 py-3 ${textColor}`}>
					{row.average}
				</td>
				<td key={rowIndex} className={`px-3 py-3 ${textColor}`}>
					{row.deviation}
				</td>
				<td key={rowIndex} className={`px-3 py-3 ${textColor}`}>
					{row.change8To16}
				</td>
				{renderMeasurementRow(rowIndex, row.measurement)}
				{renderInterpretationRow(rowIndex, row.interpretation)}
			</tr>
		</>

	);

	const renderMeasurementRow = (rowIndex: number, measurement: number | null) => (
		<>
			{
				measurement ? (
					<td key={rowIndex} className={`px-3 py-3 text-center`} >{measurement}</td >
				) : (
					<td key={rowIndex} className={`px-3 py-3`}>
						<div className="inline-flex items-center gap-2">
							<label htmlFor={`${rowIndex}`} className="text-slate-600 text-sm cursor-pointer">No</label>

							<div className="relative inline-block w-8 h-5">
								<input id={`${rowIndex}`} type="checkbox" className="peer appearance-none w-8 h-5 bg-slate-100 rounded-full checked:bg-slate-800 cursor-pointer transition-colors duration-300" />
								<label htmlFor={`${rowIndex}`}  className="absolute top-0 left-0 w-5 h-5 bg-white rounded-full border border-slate-300 shadow-sm transition-transform duration-300 peer-checked:translate-x-3 peer-checked:border-slate-800 cursor-pointer">
								</label>
							</div>

							<label htmlFor={`${rowIndex}`} className="text-slate-600 text-sm cursor-pointer">Yes</label>
						</div>
					</td>
				)}
		</>
	)

	const renderInterpretationRow = (rowIndex: number, interpretation: Interpretation | null) => {
		switch (interpretation) {
			case Interpretation.Lower:
				return <td key={rowIndex} className={`px-3 py-3 bg-red-300 justify-items-center`}>
					<MoveUp />
				</td>
			case Interpretation.Upper:
				return <td key={rowIndex} className={`px-3 py-3 bg-red-300 justify-items-center`}>
					<MoveDown />
				</td>
			default:
				return <td key={rowIndex} className={`px-3 py-3 bg-green-300 text-center`}>
					Normal
				</td>
		}
	}


	const renderTable = (headers: string[], data: TableRow[], headerColor: string, textColor: string) => (
		<>
			<tr className={headerColor}>
				{headers.map((header, index) => (
					<th key={index} className="px-3 py-3 font-semibold">
						{header}
					</th>
				))}
			</tr>
			{data.map((e, i) => renderTableRow(e, i, textColor))}
		</>
	);
	return (
		<div className="h-full overflow-auto">
			<div className="overflow-x-auto">
				<div className="flex flex-col">
					{currentStep === steps.length ? (
						<table className="w-full text-sm text-left rtl:text-right text-gray-500 border-t border-gray-300 table-auto">
							<tbody>
								{renderTable(measurementHeaders, measurementData(result), "bg-red-200", "text-red-500")}
								{renderTable(skeletalHeaders, skeletalData(result), "bg-blue-200", "text-blue-500")}
								{renderTable(toothHeaders, toothData(result), "bg-green-200", "text-green-500")}
								{renderTable(labialHeaders, labialData(result), "bg-orange-200", "text-orange-500")}
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
	);
};

const DiagnosisTab = ({
	selectedImage,
	angle,
	setAngle,
	steps,
	currentStep,
	setCurrentStep,
	setResult,
	canvasRef,
	handleFileSelect,
	result,
}: {
	selectedImage: File | null;
	angle: number;
	setAngle: React.Dispatch<React.SetStateAction<number>>;
	steps: Step[];
	currentStep: number;
	setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
	setResult: React.Dispatch<React.SetStateAction<Result>>;
	canvasRef: React.RefObject<CanvasRef>;
	handleFileSelect: (file: File) => void;
	result: Result;
}) => (
	<>
		<ImageSection
			selectedImage={selectedImage}
			onImageDataChange={handleFileSelect}
			canvasRef={canvasRef}
			angle={angle}
			setAngle={setAngle}
			steps={steps}
			currentStep={currentStep}
			setCurrentStep={setCurrentStep}
			setResult={setResult}
		/>
		<TableSection
			result={result}
			steps={steps}
			currentStep={currentStep}
			setCurrentStep={setCurrentStep}
			setResult={setResult}
		/>
	</>
);

const OtherTab = ({
	selectedImage,
	onBackgroundReady,
	onDrawingReady,
	handleFileSelect,
}: {
	selectedImage: File | null;
	onBackgroundReady: (canvas: fabric.Canvas) => void;
	onDrawingReady: (canvas: fabric.Canvas) => void;
	handleFileSelect: (file: File) => void;
}) => (
	<div className="h-full flex flex-col w-1/2">
		{selectedImage ? (
			<div className="relative">
				<FabricJSCanvas className="absolute inset-0 h-[600px]" onReady={onBackgroundReady} />
				<FabricJSCanvas className="absolute inset-0 h-[600px]" onReady={onDrawingReady} />
			</div>
		) : (
			<div className="h-full flex items-center bg-gray-50 text-gray-800 flex-col">
				<ImageSelector onImageDataChange={handleFileSelect} />
			</div>
		)}
	</div>
);
