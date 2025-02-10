import { DrawType, PointName } from "./model/enum";
import { DrawDetail } from "./model/type";

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
	rotationAngle: number,
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
	lipThickThin: number,
	incompleteLipSeal: number,
	exposedVermilionBorder: number,
	hyperactiveMentalisMuscle: number,
	maxBuffoloHum: number,
	mandBirdBeak: number,
	thirdClueMesiallyInclinedOfLat: number,
	dentureFrame: number
}

export type TableRow = {
	title: string,
	average: string | null,
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

