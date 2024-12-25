import { DrawType, PointName } from "@/components/canvas/enum";
import { DrawDetail } from "@/components/canvas/type";

export type Step = {
	title: string;
	description: string;
	pointName: PointName;
	type: DrawType;
	isCompleted: boolean;
};

export type CephalometricResult = {
	drawingActions: DrawDetail[],
	measurement: Measurement
}

export type Measurement = {
	yAxis: number,
	fma: number,
	gonionAngle: number,
	cranialBaseAngle: number,
	sna: number,
	snb: number,
	anb: number,
	pointAToNvert: number,
	witsAppraisal: number,
	interincisalAngle: number,
	oneToSN: number,
	fmia: number,
	impa: number,
	convexityToPointA: number,
	lowerLipToEPlane: number,
	oneToABPlane: number,
	palatalPlane: number,
	dpo: number,
	angleOfCondylarPathVSOccPlane: number,
}

export type TableRow = {
	title: string,
	average: string| null,
	deviation: string | null,
	change8To16: number,
	measurement: number | null,
	interpretation: Interpretation | null,
}

export enum Interpretation {
	Upper,
	Lower,
	Normal
}

