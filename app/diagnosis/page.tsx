"use client";

import ImageSelector from "@/components/imageSelector";
import React, { useEffect, useRef, useState } from "react";
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
import html2canvas from "html2canvas";
import JSZip from "jszip";
import Link from "next/link";
import Image from "next/image";
import * as fabric from "fabric";
import { FabricImage } from "fabric";
import { FabricJSCanvas, useFabricJSEditor } from "fabricjs-react";
import {
	Eraser,
	ImagePlus,
	Move,
	PenTool,
	Save,
	Trash2,
	Undo2,
	MoveUp,
	MoveDown,
	Printer,
	EyeOff,
	Eye,
	Pencil,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Interpretation, Measurement, TableRow } from "./type";
import { titleMapping } from "../comparison-measurement/masterData";
import Canvas from "@/components/canvas";
import { DiagnosisCephalo } from "./states/diagnosis";
import { CanvasRef, DrawDetail, Result } from "@/app/diagnosis/model/type";
import { StateDescriptionModel } from "./states/cephaloState";
import SampleImages from "@/components/sampleImages";
import { CephaloPointStep } from "./cephaloStep";
import DialogListContent from "@/components/dialog";
import { CANVAS_CONFIG } from "../base-const";

enum Tab {
	Diagnosis = "Diagnosis",
	Drawing = "Drawing",
}

export default function Diagnosis() {
	const canvasRef = useRef<CanvasRef | null>(null);
	const diagnosisCephalo = useRef(new DiagnosisCephalo());
	const [activeTab, setActiveTab] = useState(Tab.Diagnosis);
	const [isDrawingMode, setIsDrawingMode] = useState(false);
	const [result, setResult] = useState<Result>({});
	const [isVisibleCanvas, setIsVisibleCanvas] = useState(true);

	const [selectedImage, setSelectedImage] = useState<File | null>(null);
	const [stepContent, setStepContent] = useState<StateDescriptionModel>(diagnosisCephalo.current.getStateContent());
	const { editor: backGroundEditor, onReady: onBackgroundReady } = useFabricJSEditor();
	const { editor: drawingEditor, onReady: onDrawingReady } = useFabricJSEditor();
	const [rotationAngle, setRotationAngle] = useState<number>(0);
	const [isHidden, setIsHidden] = useState<boolean>(false);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isCompleted, setIsCompleted] = useState(false);

	useEffect(() => {
		const cephaloInstance = diagnosisCephalo.current;
		cephaloInstance.onChangeState(() => {
			setStepContent(cephaloInstance.getStateContent());
		});

		return () => {
			cephaloInstance.onChangeState(() => {});
		};
	}, []);

	useEffect(() => {
		const cephaloInstance = diagnosisCephalo.current;
		cephaloInstance.onCompletedAllState((result) => {
			setIsCompleted(true);
			setResult(result);
		});

		return () => {
			cephaloInstance.onCompletedAllState(() => {});
		};
	}, []);

	useEffect(() => {
		if (!drawingEditor?.canvas) return;
		handleCanvasModeChange(isDrawingMode, drawingEditor.canvas);
	}, [drawingEditor, isDrawingMode]);

	useEffect(() => {
		localStorage.setItem("drawingActions", JSON.stringify([], null, 2));
	}, [selectedImage]);

	useEffect(() => {
		diagnosisCephalo.current.setReDrawImage((rotationAngle) => {
			canvasRef.current?.redrawImage(rotationAngle);
			setRotationAngle(rotationAngle);
		});
	}, [selectedImage, canvasRef]);

	useEffect(() => {
		const addImageToCanvas = (file: File | null) => {
			if (!file) return;

			const url = URL.createObjectURL(file);

			FabricImage.fromURL(url, { crossOrigin: "anonymous" })
				.then((img: fabric.Image) => {
					const FIXED_WIDTH = CANVAS_CONFIG.size;
					const FIXED_HEIGHT = CANVAS_CONFIG.size;
					const scaleX = FIXED_WIDTH / img.width;
					const scaleY = FIXED_HEIGHT / img.height;
					const scale = Math.min(scaleX, scaleY);

					img.scale(scale);
					img.rotate(rotationAngle);
					backGroundEditor?.canvas.add(img.set({ left: 0, top: 0, opacity: 1 }));
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
	}, [selectedImage, backGroundEditor, rotationAngle]);

	const onSelectActiveTab = (tab: Tab) => {
		if (diagnosisCephalo.current.getState() === CephaloPointStep.SetCompleted) {
			if (
				tab === Tab.Diagnosis &&
				!confirm("Switching tabs will reset the drawing canvas. Do you want to continue?")
			) {
				return;
			}
			setActiveTab(tab);
			setIsVisibleCanvas(tab === Tab.Diagnosis);
		}
	};

	const addToothToCanvas = (url: string) => {
		setIsDrawingMode(false);
		FabricImage.fromURL(url, { crossOrigin: "anonymous" }).then((img: fabric.Image) => {
			drawingEditor?.canvas.add(img.set({ left: 0, top: 0, scaleY: 0.1, scaleX: 0.1, opacity: 1 }));
			drawingEditor?.canvas.centerObject(img);
			drawingEditor?.canvas.setActiveObject(img);
		});
	};

	const removeImageFromCanvas = () => {
		drawingEditor?.deleteSelected();
	};

	const openModalEditPoint = () => {
		setIsModalOpen(true);
	};

	const clearAll = () => {
		setSelectedImage(null);
		setIsCompleted(false);
		setResult({});
		clearCanvasDrawing();
	};

	const clearCanvasDrawing = () => {
		diagnosisCephalo.current.resetState();
		canvasRef.current?.redrawImage(0);
		setIsCompleted(false);
	};

	const undoStep = () => {
		diagnosisCephalo.current.undo();
	};

	const onClickEditPoint = (detail: DrawDetail) => {
		setIsModalOpen(false);
		setIsCompleted(false);
		diagnosisCephalo.current.setEditPoint(detail);
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

	const downloadImageWithTable = async () => {
		const element = document.getElementById("diagnosis");
		if (!element) return;

		const canvas = await html2canvas(element as HTMLElement, {
			scrollY: -window.scrollY,
			useCORS: true,
			allowTaint: true,
			logging: true,
			width: element.scrollWidth + 16,
			height: element.scrollHeight + 16,
			windowWidth: document.documentElement.offsetWidth + 16,
			windowHeight: document.documentElement.offsetHeight + 16,
		});
		const imageData = canvas.toDataURL("image/png");

		const link = document.createElement("a");
		link.href = imageData;
		link.download = "diagnosis.png";
		link.click();
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
			drawingActions: diagnosisCephalo.current.getActionsDrawings(),
			measurement: generateMeasurement(),
		};
		return JSON.stringify(jsonResult, null, 2);
	};

	const hiddenToggle = () => setIsHidden(!isHidden);

	const generateMeasurement = (): Measurement => {
		return {
			rotationAngle: result.rotationAngle,
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
			lipThickThin: result.lipThickThin,
			incompleteLipSeal: result.incompleteLipSeal,
			exposedVermilionBorder: result.exposedVermilionBorder,
			hyperactiveMentalisMuscle: result.hyperactiveMentalisMuscle,
			maxBuffoloHum: result.maxBuffoloHum,
			mandBirdBeak: result.mandBirdBeak,
			thirdClueMesiallyInclinedOfLat: result.thirdClueMesiallyInclinedOfLat,
			dentureFrame: result.dentureFrame,
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

	const handleOnChangeToggle = (key: string, e: React.ChangeEvent<HTMLInputElement>) => {
		const isChecked = e.target.checked ? 1 : 0;
		setResult((prev) => ({
			...prev,
			[titleMapping[key]]: isChecked,
		}));
	};

	const isActive = (tabName: string) => {
		return activeTab === tabName
			? "text-blue-600 border-blue-600 dark:text-blue-500 dark:border-blue-500"
			: "text-gray-500 dark:text-gray-400";
	};

	return (
		<div className="min-h-screen">
			<Navbar onClick={() => hiddenToggle()} value={isHidden} />
			<div className={`px-10 min-h-screen items-center justify-center ${isHidden ? "py-24" : "py-16"}`}>
				<div
					className={`border-b border-gray-200 dark:border-gray-700 mb-4 flex justify-between align-middle items-center ${
						isHidden ? "hidden" : "flex"
					}`}
				>
					<ul className="flex flex-wrap -mb-px text-sm font-medium text-center">
						{[Tab.Diagnosis, Tab.Drawing].map((tab, idx) => (
							<li className="me-2" key={idx}>
								<div
									onClick={() => onSelectActiveTab(tab)}
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
							openModalEditPoint={openModalEditPoint}
							clearAll={clearAll}
							clearCanvasDrawing={clearCanvasDrawing}
							undo={undoStep}
							generateZipFile={generateZipFile}
							generatePdfFile={downloadImageWithTable}
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
				<div className={`flex items-start h-screen bg-white gap-5 ${isHidden ? "justify-center" : ""}`}>
					<div style={{ display: isVisibleCanvas ? "contents" : "none" }}>
						<DiagnosisTab
							selectedImage={selectedImage}
							isCompleted={isCompleted}
							stepContent={stepContent}
							setResult={setResult}
							canvasRef={canvasRef}
							handleFileSelect={handleFileSelect}
							handleToggleChange={handleOnChangeToggle}
							result={result}
							diagnosis={diagnosisCephalo}
						/>
					</div>
					{activeTab === Tab.Drawing && (
						<OtherTab
							selectedImage={selectedImage}
							onBackgroundReady={onBackgroundReady}
							onDrawingReady={onDrawingReady}
							handleFileSelect={handleFileSelect}
						/>
					)}
				</div>
			</div>
			<DialogListContent
				isOpen={isModalOpen}
				onClickItem={(detail) => onClickEditPoint(detail)}
				onClose={() => setIsModalOpen(false)}
				content={diagnosisCephalo.current.getActionsDrawings()}
			/>
		</div>
	);
}

const Navbar = ({ onClick, value }: { onClick: () => void; value: boolean }) => {
	return (
		<nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b">
			<div className="container mx-auto px-4 md:px-6">
				<div className="flex items-center justify-between h-16">
					<Link className="text-xl font-bold " href="/">
						CephaloMetric
					</Link>
					<Button variant="ghost" onClick={onClick} className="text-gray-600 hover:text-gray-900 gap-1">
						{value ? <EyeOff /> : <Eye />}
						{value ? "Hide actions" : "Show all"}
					</Button>
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
	openModalEditPoint,
	clearAll,
	clearCanvasDrawing,
	undo,
	generateZipFile,
	generatePdfFile,
}: {
	openModalEditPoint: () => void;
	clearAll: () => void;
	clearCanvasDrawing: () => void;
	undo: () => void;
	generateZipFile: () => void;
	generatePdfFile: () => void;
}) => (
	<div className="flex gap-1">
		<ActionButton onClick={openModalEditPoint} icon={Pencil} label="Edit Point" />
		<ActionButton onClick={clearAll} icon={Trash2} label="Remove Image" />
		<ActionButton onClick={clearCanvasDrawing} icon={Eraser} label="Clean Canvas" />
		<ActionButton onClick={() => undo()} icon={Undo2} label="Undo" />
		<ActionButton onClick={generateZipFile} icon={Save} label="Save" />
		<ActionButton onClick={generatePdfFile} icon={Printer} label="Print" />
	</div>
);

const ToothDropdown = ({ onSelect }: { onSelect: (url: string) => void }) => {
	const [open, setOpen] = React.useState(false);
	const TOOTH_OPTIONS = [
		{
			label: "Incisor",
			url: "/assets/images/tooth/incisor.png",
			icon: (
				<Image
					src="/assets/images/tooth/incisor.png"
					alt="Incisor"
					width={48}
					height={48}
					className="inline-block"
					style={{ objectFit: "contain", height: "1.5rem", width: "auto" }}
				/>
			),
		},
		{
			label: "Canine",
			url: "/assets/images/tooth/canine.png",
			icon: (
				<Image
					src="/assets/images/tooth/canine.png"
					alt="Canine"
					width={48}
					height={48}
					className="inline-block"
					style={{ objectFit: "contain", height: "1.5rem", width: "auto" }}
				/>
			),
		},
		{
			label: "Premolar",
			url: "/assets/images/tooth/premolar.png",
			icon: (
				<Image
					src="/assets/images/tooth/premolar.png"
					alt="Premolar"
					width={48}
					height={48}
					className="inline-block"
					style={{ objectFit: "contain", height: "1.5rem", width: "auto" }}
				/>
			),
		},
		{
			label: "Molar",
			url: "/assets/images/tooth/molar.png",
			icon: (
				<Image
					src="/assets/images/tooth/molar.png"
					alt="Molar"
					width={48}
					height={48}
					className="inline-block"
					style={{ objectFit: "contain", height: "1.5rem", width: "auto" }}
				/>
			),
		},
	];

	const handleSelect = (url: string) => {
		setOpen(false);
		onSelect(url);
	};

	return (
		<div className="relative">
			<Button
				variant="ghost"
				className="text-gray-600 hover:text-gray-900 gap-1"
				onClick={() => setOpen((v) => !v)}
				type="button"
			>
				<ImagePlus width="24" height="24" /> Add Tooth
				<svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
					<path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
				</svg>
			</Button>
			{open && (
				<div className="absolute left-0 mt-2 w-36 bg-white border border-gray-200 rounded shadow-lg z-10">
					{TOOTH_OPTIONS.map((option) => (
						<Button
							variant="ghost"
							key={option.label}
							onClick={() => handleSelect(option.url)}
							className="justify-start w-full text-gray-600 hover:text-gray-900 gap-1"
						>
							{option.icon}
							{option.label}
						</Button>
					))}
				</div>
			)}
		</div>
	);
};

const OtherTabButtons = ({
	removeImageFromCanvas,
	addToothToCanvas,
	setIsDrawingMode,
	generateZipFile,
}: {
	removeImageFromCanvas: () => void;
	addToothToCanvas: (url: string) => void;
	setIsDrawingMode: React.Dispatch<React.SetStateAction<boolean>>;
	generateZipFile: () => void;
}) => (
	<div className="flex gap-1">
		<ActionButton onClick={removeImageFromCanvas} icon={Trash2} label="Remove select element" />
		<ToothDropdown onSelect={(url) => addToothToCanvas(url)} />
		<ActionButton onClick={() => setIsDrawingMode(false)} icon={Move} label="Move" />
		<ActionButton onClick={() => setIsDrawingMode(true)} icon={PenTool} label="Pen tool" />
		<ActionButton onClick={generateZipFile} icon={Save} label="Save" />
	</div>
);

const ImageSection = ({
	selectedImage,
	onImageDataChange,
	canvasRef,
	diagnosis,
}: {
	selectedImage: File | null;
	onImageDataChange: (file: File) => void;
	canvasRef: React.RefObject<CanvasRef>;
	diagnosis: React.RefObject<DiagnosisCephalo>;
}) => (
	<div className="h-full flex flex-col w-auto">
		{selectedImage ? (
			<div className="flex flex-row h-auto">
				<Canvas ref={canvasRef} imageFile={selectedImage} diagnosis={diagnosis} />
			</div>
		) : (
			<ImageSelector onImageDataChange={onImageDataChange} />
		)}
	</div>
);

const TableSection = ({
	result,
	isCompleted,
	stepContent,
	handleToggleChange,
}: {
	result: Result;
	isCompleted: boolean;
	stepContent: StateDescriptionModel;
	setResult: React.Dispatch<React.SetStateAction<Result>>;
	handleToggleChange: (key: string, e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
	const renderTableRow = (row: TableRow, rowIndex: number, textColor: string) => (
		<tr key={rowIndex} className="bg-white border-b border-t">
			<td className={`py-1 px-3 ${textColor}`}>{row.title}</td>
			<td className={`py-1 px-3 ${textColor}`}>{row.average}</td>
			<td className={`py-1 px-3 ${textColor}`}>{row.deviation}</td>
			{renderMeasurementRow(rowIndex, row.title, row.measurement)}
			{renderInterpretationRow(rowIndex, row.interpretation, row.measurement)}
		</tr>
	);

	const renderMeasurementRow = (rowIndex: number, rowTitle: string, measurement: number | null) => (
		<>
			{measurement ? (
				<td key={rowIndex} className={`py-1 px-3 text-center`}>
					{measurement}
				</td>
			) : (
				<td key={rowIndex} className={`py-1 px-3`}>
					<div className="inline-flex items-center gap-2">
						<label htmlFor={`${rowIndex}`} className="text-slate-600 text-sm cursor-pointer">
							No
						</label>

						<div className="relative inline-block w-8 h-5">
							<input
								id={`${rowIndex}`}
								type="checkbox"
								onChange={(e) => handleToggleChange(rowTitle, e)}
								className="peer appearance-none w-8 h-5 bg-slate-100 rounded-full checked:bg-slate-800 cursor-pointer transition-colors duration-300"
							/>
							<label
								htmlFor={`${rowIndex}`}
								className="absolute top-0 left-0 w-5 h-5 bg-white rounded-full border border-slate-300 shadow-sm transition-transform duration-300 peer-checked:translate-x-3 peer-checked:border-slate-800 cursor-pointer"
							></label>
						</div>

						<label htmlFor={`${rowIndex}`} className="text-slate-600 text-sm cursor-pointer">
							Yes
						</label>
					</div>
				</td>
			)}
		</>
	);

	const renderInterpretationRow = (
		rowIndex: number,
		interpretation: Interpretation | null,
		measurement: number | null
	) => {
		switch (interpretation) {
			case Interpretation.Upper:
				return (
					<td key={rowIndex} className={`py-1 px-3 bg-red-300 justify-items-center`}>
						<MoveUp />
					</td>
				);
			case Interpretation.Lower:
				return (
					<td key={rowIndex} className={`py-1 px-3 bg-red-300 justify-items-center`}>
						<MoveDown />
					</td>
				);
			default:
				return measurement ? (
					<td key={rowIndex} className={`py-1 px-3 bg-green-300 text-center`}>
						Normal
					</td>
				) : (
					<></>
				);
		}
	};

	const renderTable = (headers: string[], data: TableRow[], headerColor: string, textColor: string) => (
		<>
			<tr className={headerColor}>
				{headers.map((header, index) => (
					<th key={index} className="py-1 px-3  font-semibold">
						{header}
					</th>
				))}
			</tr>
			{data.map((e, i) => renderTableRow(e, i, textColor))}
		</>
	);
	return (
		<div className="h-full">
			<div className="flex flex-col">
				{isCompleted ? (
					<table className="w-full text-xs text-left rtl:text-right text-gray-500 border-t border-gray-300 align-middle">
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
					<SampleImages currentStep={stepContent} />
				)}
			</div>
		</div>
	);
};

const DiagnosisTab = ({
	selectedImage,
	isCompleted,
	stepContent,
	setResult,
	canvasRef,
	handleFileSelect,
	handleToggleChange,
	result,
	diagnosis,
}: {
	selectedImage: File | null;
	isCompleted: boolean;
	stepContent: StateDescriptionModel;
	setResult: React.Dispatch<React.SetStateAction<Result>>;
	canvasRef: React.RefObject<CanvasRef>;
	handleFileSelect: (file: File) => void;
	handleToggleChange: (key: string, e: React.ChangeEvent<HTMLInputElement>) => void;
	result: Result;
	diagnosis: React.RefObject<DiagnosisCephalo>;
}) => (
	<div className="flex justify-between gap-10 h-full" id="diagnosis">
		<ImageSection
			selectedImage={selectedImage}
			onImageDataChange={handleFileSelect}
			canvasRef={canvasRef}
			diagnosis={diagnosis}
		/>
		<TableSection
			result={result}
			isCompleted={isCompleted}
			stepContent={stepContent}
			setResult={setResult}
			handleToggleChange={handleToggleChange}
		/>
	</div>
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
			<div className={`relative w-[${CANVAS_CONFIG.size}px] h-[${CANVAS_CONFIG.size}px] border border-gray-200`}>
				<FabricJSCanvas className="absolute inset-0 w-full h-full" onReady={onBackgroundReady} />
				<FabricJSCanvas className="absolute inset-0 w-full h-full" onReady={onDrawingReady} />
			</div>
		) : (
			<div className="flex items-center text-gray-800 flex-col">
				<ImageSelector onImageDataChange={handleFileSelect} />
			</div>
		)}
	</div>
);
