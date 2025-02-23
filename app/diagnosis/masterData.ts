import { Result } from "./model/type";
import { Interpretation, TableRow } from "./type";

export const measurementHeaders = [
	"VERTCAL DIMENSION",
	"Age (16)",
	"Deviation",
	"Measurement",
	"Interpretation",
]
export const skeletalHeaders = ["SKELETAL RELATIONSHIP", "", "", "", ""];
export const toothHeaders = ["Tooth to Skeletal Relationship", "", "", "", ""];
export const labialHeaders = ["Is labial profile an issue?", "", "", "", ""];
export const surgicalHeaders = ["Surgical Tendency", "", "", "", ""];
export const dentureFrameHeaders = ["Denture Frame", "", "", "", ""];

const executeInterpretation = (average: number, measurement: number, deviation: number | null): Interpretation => {
	if (deviation == null) return Interpretation.Normal

	const min = average - deviation
	const max = average + deviation
	if (measurement >= min && measurement <= max) {
		return Interpretation.Normal
	} else if (measurement > max) {
		return Interpretation.Upper
	} else {
		return Interpretation.Lower
	}

}

export const measurementData = (result: Result): TableRow[] => {
	const yAxis = parseFloat(result["yAxis"]?.toFixed(2))
	const fma = parseFloat(result["fma"]?.toFixed(2))
	const gonionAngle = parseFloat(result["gonionAngle"]?.toFixed(2))
	return [
		{ title: "1. Y-Axis", average: "65.0", deviation: "±4.6", change8To16: -0.24, measurement: yAxis, interpretation: executeInterpretation(65.0, yAxis, 4.6) },
		{ title: "2. FMA [Twedd Triangle]", average: "25.0", deviation: "±4.4", change8To16: -0.18, measurement: fma, interpretation: executeInterpretation(25.0, fma, 4.4) },
		{ title: "3. Gonion Angle", average: "130.0", deviation: null, change8To16: -0.18, measurement: gonionAngle, interpretation: executeInterpretation(130.0, gonionAngle, null) }
	]
};

export const skeletalData = (result: Result): TableRow[] => {
	const cranialBaseAngle = parseFloat(result["cranialBaseAngle"]?.toFixed(2))
	const sna = parseFloat(result["sna"]?.toFixed(2))
	const snb = parseFloat(result["snb"]?.toFixed(2))
	const anb = parseFloat(result["anb"]?.toFixed(2))
	const pointAToNvert = parseFloat(result["pointAToNvert"]?.toFixed(2))
	const witsAppraisal = parseFloat(result["witsAppraisal"]?.toFixed(2))
	return [
		{ title: "4. Cranial Base Angle", average: "130.0", deviation: "±5.0", change8To16: -0.18, measurement: cranialBaseAngle, interpretation: executeInterpretation(130.0, cranialBaseAngle, 5) },
		{ title: "5. SNA", average: "82.0", deviation: "±3.2", change8To16: -0.18, measurement: sna, interpretation: executeInterpretation(82.0, sna, 3.2) },
		{ title: "6. SNB", average: "80.0", deviation: "±3.0", change8To16: -0.18, measurement: snb, interpretation: executeInterpretation(80.0, snb, 3.0) },
		{ title: "7. ANB", average: "2.0", deviation: "±2.3", change8To16: -0.18, measurement: anb, interpretation: executeInterpretation(2.0, anb, 2.3) },
		{ title: "8. Point A to Nvert", average: "1.0", deviation: "±4.4", change8To16: -0.18, measurement: pointAToNvert, interpretation: executeInterpretation(1.0, pointAToNvert, 4.4) },
		{ title: "9. Wits appraisal", average: "0.0", deviation: "±4.4", change8To16: -0.18, measurement: witsAppraisal, interpretation: executeInterpretation(0.0, witsAppraisal, 4.4) },
	]
};

export const toothData = (result: Result): TableRow[] => {
	const interincisalAngle = parseFloat(result["interincisalAngle"]?.toFixed(2))
	const oneToSN = parseFloat(result["oneToSN"]?.toFixed(2))
	const fmia = parseFloat(result["fmia"]?.toFixed(2))
	const impa = parseFloat(result["impa"]?.toFixed(2))
	const convexityToPointA = parseFloat(result["convexityToPointA"]?.toFixed(2))
	return [
		{ title: "10. Interincisal Angle", average: "132.0", deviation: "±10.7", change8To16: -0.18, measurement: interincisalAngle, interpretation: executeInterpretation(132.0, interincisalAngle, 10.7) },
		{ title: "11. 1/ to SN", average: "103.6", deviation: "±7.1", change8To16: -0.18, measurement: oneToSN, interpretation: executeInterpretation(103.6, oneToSN, 7.1) },
		{ title: "12. FMIA", average: "60.0", deviation: "±8.5", change8To16: -0.18, measurement: fmia, interpretation: executeInterpretation(60.0, fmia, 8.5) },
		{ title: "13. IMPA", average: "95.0", deviation: "±6.3", change8To16: -0.18, measurement: impa, interpretation: executeInterpretation(95.0, impa, 6.3) },
		{ title: "14. Convexity to Point A", average: "2.0", deviation: "±2.0", change8To16: -0.18, measurement: convexityToPointA, interpretation: executeInterpretation(2.0, convexityToPointA, 2) },
	]
};

export const labialData = (result: Result): TableRow[] => {
	const lowerLipToEPlane = parseFloat(result["lowerLipToEPlane"]?.toFixed(2))
	const oneToABPlane = parseFloat(result["oneToABPlane"]?.toFixed(2))
	return [
		{ title: "1st clue: Lower Lip to E-plane", average: "2.0", deviation: "±2.0", change8To16: -0.18, measurement: lowerLipToEPlane, interpretation: executeInterpretation(2.0, lowerLipToEPlane, 2.0) },
		{ title: "1.1 Lip: Thick/Thin", average: null, deviation: null, change8To16: -0.18, measurement: null, interpretation: null },
		{ title: "1.2 Incomplete Lip Seal", average: null, deviation: null, change8To16: -0.18, measurement: null, interpretation: null },
		{ title: "1.3 Exposed Vermillion Border", average: null, deviation: null, change8To16: -0.18, measurement: null, interpretation: null },
		{ title: "1.4 Hyperactive Mentalis Muscle", average: null, deviation: null, change8To16: -0.18, measurement: null, interpretation: null },
		{ title: "2nd clue: 1/to AB plane[mm.]", average: null, deviation: null, change8To16: -0.18, measurement: oneToABPlane, interpretation: null },
		{ title: "2.1 Max Buffolo Hum", average: null, deviation: null, change8To16: -0.18, measurement: null, interpretation: null },
		{ title: "2.12 Mand Bird Beak", average: null, deviation: null, change8To16: -0.18, measurement: null, interpretation: null },
		{ title: "3rd clue: Mesially Inclined of Lat. Dent", average: null, deviation: null, change8To16: -0.18, measurement: null, interpretation: null }
	]
};

export const surgicalTendencyData = (result: Result): TableRow[] => {
	const palatalPlane = parseFloat(result["palatalPlane"]?.toFixed(2))
	return [
		{ title: "Palatal Plane/Mandibular Plane", average: null, deviation: "±0.67", change8To16: -0.18, measurement: palatalPlane, interpretation: executeInterpretation(0.0, palatalPlane, 0.67) },
	]
};

export const dentureFrameData = (result: Result): TableRow[] => {
	const dpo = parseFloat(result["dpo"]?.toFixed(2))
	const angleOfCondylarPathVSOccPlane = parseFloat(result["angleOfCondylarPathVSOccPlane"]?.toFixed(2))
	return [
		{ title: "25. Denture Frame", average: null, deviation: null, change8To16: -0.18, measurement: null, interpretation: null },
		{ title: "26. DPO[mm.]", average: "No Norm", deviation: "No Norm", change8To16: -0.18, measurement: dpo, interpretation: Interpretation.Normal },
		{ title: "27. Angle of Condylar path/OP", average: "No Norm", deviation: "No Norm", change8To16: -0.18, measurement: angleOfCondylarPathVSOccPlane, interpretation: Interpretation.Normal }
	]
};
