import { Measurement } from "../diagnosis/type";

export const defaultMeasurement: Measurement = {
	rotationAngle: 0,
	yAxis: 0,
	fma: 0,
	gonionAngle: 0,
	cranialBaseAngle: 0,
	sna: 0,
	snb: 0,
	anb: 0,
	pointAToNvert: 0,
	witsAppraisal: 0,
	interincisalAngle: 0,
	oneToSN: 0,
	fmia: 0,
	impa: 0,
	convexityToPointA: 0,
	lowerLipToEPlane: 0,
	oneToABPlane: 0,
	palatalPlane: 0,
	dpo: 0,
	angleOfCondylarPathVSOccPlane: 0,
	lipThickThin: 0,
	incompleteLipSeal: 0,
	exposedVermilionBorder: 0,
	hyperactiveMentalisMuscle: 0,
	maxBuffoloHum: 0,
	mandBirdBeak: 0,
	thirdClueMesiallyInclinedOfLat: 0,
	dentureFrame: 0,
};

export const measurementCompareHeaders = ["VERTCAL DIMENSION", "", "", "", "", "", "", ""];
export const skeletalHeaders = ["SKELETAL RELATIONSHIP", "", "", "", "", "", "", ""];
export const toothHeaders = ["Tooth to Skeletal Relationship", "", "", "", "", "", "", ""];
export const labialHeaders = ["Is labial profile an issue?", "", "", "", "", "", "", ""];
export const surgicalHeaders = ["Surgical Tendency", "", "", "", "", "", "", ""];
export const dentureFrameHeaders = ["Denture Frame", "", "", "", "", "", "", ""];

export type TableData = {
	label: string;
	key: string;
	reference: string;
	deviation: string;
	indices: number[];
	interpretation: string;
};

const safeAccess = (array: Measurement[], index: number): Measurement | null => {
	return array[index] !== undefined ? array[index] : null;
};

const mapToStringResult = (flag: number | undefined) => {
	if (flag == 1) {
		return "Yes";
	} else {
		return "No";
	}
};

export const measurementData = (result: Measurement[]) => [
	[
		"1. Y-Axis",
		"65.0",
		"±4.6",
		`${safeAccess(result, 0)?.yAxis?.toFixed(2) || ""}`,
		`${safeAccess(result, 1)?.yAxis?.toFixed(2) || ""}`,
		`${safeAccess(result, 2)?.yAxis?.toFixed(2) || ""}`,
		`${safeAccess(result, 3)?.yAxis?.toFixed(2) || ""}`,
		"~",
	],
	[
		"2. FMA [Twedd Triangle]",
		"25.0",
		"±4.4",
		`${safeAccess(result, 0)?.fma?.toFixed(2) || ""}`,
		`${safeAccess(result, 1)?.fma?.toFixed(2) || ""}`,
		`${safeAccess(result, 2)?.fma?.toFixed(2) || ""}`,
		`${safeAccess(result, 3)?.fma?.toFixed(2) || ""}`,
		"~",
	],
	[
		"3. Gonion Angle",
		"130.0",
		"",
		`${safeAccess(result, 0)?.gonionAngle?.toFixed(2) || ""}`,
		`${safeAccess(result, 1)?.gonionAngle?.toFixed(2) || ""}`,
		`${safeAccess(result, 2)?.gonionAngle?.toFixed(2) || ""}`,
		`${safeAccess(result, 3)?.gonionAngle?.toFixed(2) || ""}`,
		"~",
	],
];

export const skeletalData = (result: Measurement[]) => [
	[
		"4. Cranial Base Angle",
		"130.0",
		"±5.0",
		`${safeAccess(result, 0)?.cranialBaseAngle?.toFixed(2) || ""}`,
		`${safeAccess(result, 1)?.cranialBaseAngle?.toFixed(2) || ""}`,
		`${safeAccess(result, 2)?.cranialBaseAngle?.toFixed(2) || ""}`,
		`${safeAccess(result, 3)?.cranialBaseAngle?.toFixed(2) || ""}`,
		"~",
	],
	[
		"5. SNA",
		"82.0",
		"±3.2",
		`${safeAccess(result, 0)?.sna?.toFixed(2) || ""}`,
		`${safeAccess(result, 1)?.sna?.toFixed(2) || ""}`,
		`${safeAccess(result, 2)?.sna?.toFixed(2) || ""}`,
		`${safeAccess(result, 3)?.sna?.toFixed(2) || ""}`,
		"~",
	],
	[
		"6. SNB",
		"80.0",
		"±3.0",
		`${safeAccess(result, 0)?.snb?.toFixed(2) || ""}`,
		`${safeAccess(result, 1)?.snb?.toFixed(2) || ""}`,
		`${safeAccess(result, 2)?.snb?.toFixed(2) || ""}`,
		`${safeAccess(result, 3)?.snb?.toFixed(2) || ""}`,
		"~",
	],
	[
		"7. ANB",
		"2.0",
		"±2.3",
		`${safeAccess(result, 0)?.anb?.toFixed(2) || ""}`,
		`${safeAccess(result, 1)?.anb?.toFixed(2) || ""}`,
		`${safeAccess(result, 2)?.anb?.toFixed(2) || ""}`,
		`${safeAccess(result, 3)?.anb?.toFixed(2) || ""}`,
		"~",
	],
	[
		"8. Point A to Nvert",
		"1.0",
		"±4.4",
		`${safeAccess(result, 0)?.pointAToNvert?.toFixed(2) || ""}`,
		`${safeAccess(result, 1)?.pointAToNvert?.toFixed(2) || ""}`,
		`${safeAccess(result, 2)?.pointAToNvert?.toFixed(2) || ""}`,
		`${safeAccess(result, 3)?.pointAToNvert?.toFixed(2) || ""}`,
		"~",
	],
	[
		"9. Wits appraisal",
		"0.0",
		"±4.4",
		`${safeAccess(result, 0)?.witsAppraisal?.toFixed(2) || ""}`,
		`${safeAccess(result, 1)?.witsAppraisal?.toFixed(2) || ""}`,
		`${safeAccess(result, 2)?.witsAppraisal?.toFixed(2) || ""}`,
		`${safeAccess(result, 3)?.witsAppraisal?.toFixed(2) || ""}`,
		"~",
	],
];

export const toothData = (result: Measurement[]) => [
	[
		"10. Interincisal Angle",
		"132.0",
		"±10.7",
		`${safeAccess(result, 0)?.interincisalAngle?.toFixed(2) || ""}`,
		`${safeAccess(result, 1)?.interincisalAngle?.toFixed(2) || ""}`,
		`${safeAccess(result, 2)?.interincisalAngle?.toFixed(2) || ""}`,
		`${safeAccess(result, 3)?.interincisalAngle?.toFixed(2) || ""}`,

		"~",
	],
	[
		"11. 1/ to SN",
		"103.6",
		"±7.1",
		`${safeAccess(result, 0)?.oneToSN?.toFixed(2) || ""}`,
		`${safeAccess(result, 1)?.oneToSN?.toFixed(2) || ""}`,
		`${safeAccess(result, 2)?.oneToSN?.toFixed(2) || ""}`,
		`${safeAccess(result, 3)?.oneToSN?.toFixed(2) || ""}`,
		"~",
	],
	[
		"12. FMIA",
		"60.0",
		"±8.5",
		`${safeAccess(result, 0)?.fmia?.toFixed(2) || ""}`,
		`${safeAccess(result, 1)?.fmia?.toFixed(2) || ""}`,
		`${safeAccess(result, 2)?.fmia?.toFixed(2) || ""}`,
		`${safeAccess(result, 3)?.fmia?.toFixed(2) || ""}`,
		"~",
	],
	[
		"13. IMPA",
		"95.0",
		"±6.3",
		`${safeAccess(result, 0)?.impa?.toFixed(2) || ""}`,
		`${safeAccess(result, 1)?.impa?.toFixed(2) || ""}`,
		`${safeAccess(result, 2)?.impa?.toFixed(2) || ""}`,
		`${safeAccess(result, 3)?.impa?.toFixed(2) || ""}`,
		"~",
	],
	[
		"14. Convexity to Point A",
		"2.0",
		"±2.0",
		`${safeAccess(result, 0)?.convexityToPointA?.toFixed(2) || ""}`,
		`${safeAccess(result, 1)?.convexityToPointA?.toFixed(2) || ""}`,
		`${safeAccess(result, 2)?.convexityToPointA?.toFixed(2) || ""}`,
		`${safeAccess(result, 3)?.convexityToPointA?.toFixed(2) || ""}`,
		"~",
	],
];

export const labialData = (result: Measurement[]) => [
	[
		"1st clue:Lower Lip to E-plane",
		"2.0",
		"±2.0",
		`${safeAccess(result, 0)?.lowerLipToEPlane?.toFixed(2) || ""}`,
		`${safeAccess(result, 1)?.lowerLipToEPlane?.toFixed(2) || ""}`,
		`${safeAccess(result, 2)?.lowerLipToEPlane?.toFixed(2) || ""}`,
		`${safeAccess(result, 3)?.lowerLipToEPlane?.toFixed(2) || ""}`,
		"~",
	],
	[
		"1.1 Lip: Thick/Thin",
		"",
		"",
		`${mapToStringResult(safeAccess(result, 0)?.lipThickThin)}`,
		`${mapToStringResult(safeAccess(result, 1)?.lipThickThin)}`,
		`${mapToStringResult(safeAccess(result, 2)?.lipThickThin)}`,
		`${mapToStringResult(safeAccess(result, 3)?.lipThickThin)}`,
		"~",
	],
	[
		"1.2 Incomplete Lip Seal",
		"",
		"",
		`${mapToStringResult(safeAccess(result, 0)?.incompleteLipSeal)}`,
		`${mapToStringResult(safeAccess(result, 1)?.incompleteLipSeal)}`,
		`${mapToStringResult(safeAccess(result, 2)?.incompleteLipSeal)}`,
		`${mapToStringResult(safeAccess(result, 3)?.incompleteLipSeal)}`,
		"~",
	],
	[
		"1.3 Exposed Vermillion Border",
		"",
		"",
		`${mapToStringResult(safeAccess(result, 0)?.exposedVermilionBorder)}`,
		`${mapToStringResult(safeAccess(result, 1)?.exposedVermilionBorder)}`,
		`${mapToStringResult(safeAccess(result, 2)?.exposedVermilionBorder)}`,
		`${mapToStringResult(safeAccess(result, 3)?.exposedVermilionBorder)}`,
		"~",
	],
	[
		"1.4 Hyperactive Mentalis Muscle",
		"",
		"",
		`${mapToStringResult(safeAccess(result, 0)?.hyperactiveMentalisMuscle)}`,
		`${mapToStringResult(safeAccess(result, 1)?.hyperactiveMentalisMuscle)}`,
		`${mapToStringResult(safeAccess(result, 2)?.hyperactiveMentalisMuscle)}`,
		`${mapToStringResult(safeAccess(result, 3)?.hyperactiveMentalisMuscle)}`,
		"~",
	],
	[
		"2nd clud:1/to AB plane[mm.]",
		"",
		"",
		`${safeAccess(result, 0)?.oneToABPlane?.toFixed(2) || ""}`,
		`${safeAccess(result, 1)?.oneToABPlane?.toFixed(2) || ""}`,
		`${safeAccess(result, 2)?.oneToABPlane?.toFixed(2) || ""}`,
		`${safeAccess(result, 3)?.oneToABPlane?.toFixed(2) || ""}`,
		"~",
	],
	[
		"2.1 Max Buffolo Hum",
		"",
		"",
		`${mapToStringResult(safeAccess(result, 0)?.maxBuffoloHum)}`,
		`${mapToStringResult(safeAccess(result, 1)?.maxBuffoloHum)}`,
		`${mapToStringResult(safeAccess(result, 2)?.maxBuffoloHum)}`,
		`${mapToStringResult(safeAccess(result, 3)?.maxBuffoloHum)}`,
		"~",
	],
	[
		"2.12 Mand Bird Beak",
		"",
		"",
		`${mapToStringResult(safeAccess(result, 0)?.mandBirdBeak)}`,
		`${mapToStringResult(safeAccess(result, 1)?.mandBirdBeak)}`,
		`${mapToStringResult(safeAccess(result, 2)?.mandBirdBeak)}`,
		`${mapToStringResult(safeAccess(result, 3)?.mandBirdBeak)}`,
		"~",
	],
	[
		"3rd clue:Mesially Inclined of Lat. Dent",
		"",
		"",
		`${mapToStringResult(safeAccess(result, 0)?.thirdClueMesiallyInclinedOfLat)}`,
		`${mapToStringResult(safeAccess(result, 1)?.thirdClueMesiallyInclinedOfLat)}`,
		`${mapToStringResult(safeAccess(result, 2)?.thirdClueMesiallyInclinedOfLat)}`,
		`${mapToStringResult(safeAccess(result, 3)?.thirdClueMesiallyInclinedOfLat)}`,
		"~",
	],
];

export const surgicalTendencyData = (result: Measurement[]) => [
	[
		"Palatal Plane/Mandibular Plane",
		"",
		"+/0.67",
		`${safeAccess(result, 0)?.palatalPlane?.toFixed(2) || ""}`,
		`${safeAccess(result, 1)?.palatalPlane?.toFixed(2) || ""}`,
		`${safeAccess(result, 2)?.palatalPlane?.toFixed(2) || ""}`,
		`${safeAccess(result, 3)?.palatalPlane?.toFixed(2) || ""}`,
		"~",
	],
];

export const dentureFrameData = (result: Measurement[]) => [
	[
		"25. Denture Frame",
		"",
		"",
		`${mapToStringResult(safeAccess(result, 0)?.dentureFrame)}`,
		`${mapToStringResult(safeAccess(result, 1)?.dentureFrame)}`,
		`${mapToStringResult(safeAccess(result, 2)?.dentureFrame)}`,
		`${mapToStringResult(safeAccess(result, 3)?.dentureFrame)}`,
		"~",
	],
	[
		"26. DPO[mm.]",
		"No Norm",
		"No Norm",
		`${safeAccess(result, 0)?.dpo?.toFixed(2) || ""}`,
		`${safeAccess(result, 1)?.dpo?.toFixed(2) || ""}`,
		`${safeAccess(result, 2)?.dpo?.toFixed(2) || ""}`,
		`${safeAccess(result, 3)?.dpo?.toFixed(2) || ""}`,
		"~",
	],
	[
		"27. Angle of Condylar path/OP",
		"No Norm",
		"No Norm",
		`${safeAccess(result, 0)?.angleOfCondylarPathVSOccPlane?.toFixed(2) || ""}`,
		`${safeAccess(result, 1)?.angleOfCondylarPathVSOccPlane?.toFixed(2) || ""}`,
		`${safeAccess(result, 2)?.angleOfCondylarPathVSOccPlane?.toFixed(2) || ""}`,
		`${safeAccess(result, 3)?.angleOfCondylarPathVSOccPlane?.toFixed(2) || ""}`,
		"~",
	],
];

export const titleMapping: { [key: string]: string } = {
	"1.1 Lip: Thick/Thin": "lipThickThin",
	"1.2 Incomplete Lip Seal": "incompleteLipSeal",
	"1.3 Exposed Vermillion Border": "exposedVermilionBorder",
	"1.4 Hyperactive Mentalis Muscle": "hyperactiveMentalisMuscle",
	"2.1 Max Buffolo Hum": "maxBuffoloHum",
	"2.12 Mand Bird Beak": "mandBirdBeak",
	"3rd clue:Mesially Inclined of Lat. Dent": "thirdClueMesiallyInclinedOfLat",
	"25. Denture Frame": "dentureFrame",
};
