import { Step } from "@/app/diagnosis/type";
import { DrawType, PointName } from "./enum";
import { ComponentRef, Dispatch, SetStateAction } from "react";
import Canvas from ".";

export type DrawDetail = {
	pointName?: PointName;
	type: DrawType;
	startX: number;
	startY: number;
	endX?: number;
	endY?: number;
};

export type Style = {
	color: string;
	lineWidth: number;
};

export type CanvasHandler = {
	clearDraw: () => void;
};

export type CanvasProps = {
	imageFile: File | null | undefined;
	imageAngle: number;
	steps: Step[];
	currentStep: number;
	setCurrentStep: Dispatch<SetStateAction<number>>;
	updatePxToCen: (distance: number) => void;
	resetAngle: () => void;
	setResult: Dispatch<SetStateAction<Result>>;
};

export type CanvasRef = ComponentRef<typeof Canvas>;

export type Point = {
	x: number;
	y: number;
};

export type Result = {
	[key: string]: number
}