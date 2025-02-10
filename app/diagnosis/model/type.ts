import { DrawType, PointName } from "./enum";
import { ComponentRef } from "react";
import Canvas from "../../../components/canvas";
import { DiagnosisCephalo } from "@/app/diagnosis/states/diagnosis";

export type DrawDetail = {
	pointName?: PointName;
	type: DrawType;
	startX: number;
	startY: number;
	endX?: number;
	endY?: number;
};

export type Point = {
	x: number;
	y: number;
};

export type Result = {
	[key: string]: number
}

export type CanvasHandler = {
	current: HTMLElement | null;
	redrawImage: (rotationAngle: number) => void;
};

export type CanvasProps = {
	imageFile: File | null | undefined;
	diagnosis: React.RefObject<DiagnosisCephalo>;
};

export type CanvasRef = ComponentRef<typeof Canvas>;

