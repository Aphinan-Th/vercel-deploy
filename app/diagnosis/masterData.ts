import { Result } from "@/components/canvas/type";

export const measurementHeaders = [
	"Measurement VERTCAL DIMENSION",
	"Age (16)",
	"Deviation",
	"Change 8-16 yrs",
	"Measurement",
	"Interpretation",
];
export const skeletalHeaders = ["SKELETAL RELATIONSHIP", "", "", "", "", ""];
export const toothHeaders = ["Tooth to Skeletal Relationship", "", "", "", "", ""];
export const labialHeaders = ["Is labial profile an issue?", "", "", "", "", ""];
export const surgicalHeaders = ["Surgical Tendency", "", "", "", "", ""];
export const dentureFrameHeaders = ["Denture Frame", "", "", "", "", ""];

export const measurementData = (result: Result) => [
	["1. Y-Axis", "65.0", "+/-4.6", "-0.24", `${result["yAxis"]?.toFixed(2) || ""}`, "~"],
	["2. FMA [Twedd Triangle]", "25.0", "+/-4.4", "-0.18", `${result["fma"]?.toFixed(2) || ""}`, "~"],
	["3. Gonion Angle", "130.0", "", "-0.18", `${result["gonionAngle"]?.toFixed(2) || ""}`, "~"],
];

export const skeletalData = (result: Result) => [
	["4. Cranial Base Angle", "130.0", "+/-5.0", "-0.18", `${result["cranialBaseAngle"]?.toFixed(2) || ""}`, "~"],
	["5. SNA", "82.0", "+/-3.2", "-0.18", `${result["sna"]?.toFixed(2) || ""}`, "~"],
	["6. SNB", "80.0", "+/-3.0", "-0.18", `${result["snb"]?.toFixed(2) || ""}`, "~"],
	["7. ANB", "2.0", "+/-2.3", "-0.18", `${result["anb"]?.toFixed(2) || ""}`, "~"],
	["8. Point A to Nvert", "1.0", "+/-4.4", "-0.18", `${result["pointAToNvert"]?.toFixed(2) || ""}`, "~"],
	["9. Wits appraisal", "0.0", "+/-4.4", "-0.18", `${result["witsAppraisal"]?.toFixed(2) || "-3 to 2"}`, "~"],
];

export const toothData = (result: Result) => [
	["10. Interincisal Angle", "132.0", "+/-10.7", "-0.18", `${result["interincisalAngle"]?.toFixed(2) || ""}`, "~"],
	["11. 1/ to SN", "103.6", "+/-7.1", "-0.18", `${result["oneToSN"]?.toFixed(2) || ""}`, "~"],
	["12. FMIA", "60.0", "+/-8.5", "-0.18", `${result["fmia"]?.toFixed(2) || ""}`, "~"],
	["13. IMPA", "95.0", "+/-6.3", "-0.18", `${result["impa"]?.toFixed(2) || ""}`, "~"],
	["14. Convexity to Point A", "2.0", "+/-2.0", "-0.18", `${result["convexityToPointA"]?.toFixed(2) || ""}`, "~"],
];

export const labialData = (result: Result) => [
	["1st clue:Lower Lip to E-plane", "2.0", "+/-2.0", "-0.18", `${result["lowerLipToEPlane"]?.toFixed(2) || ""}`, "~"],
	["1.1 Lip: Thick/Thin", "", "", "-0.18", '19.1"', "~"],
	["1.2 Incomplete Lip Seal", "", "", "-0.18", '19.1"', "~"],
	["1.3 Exposed Vermillion Border", "", "", "-0.18", '19.1"', "~"],
	["1.4 Hyperactive Mentalis Muscle", "", "", "-0.18", '19.1"', "~"],
	["1.4 Hyperactive Mentalis Muscle", "", "", "-0.18", '19.1"', "~"],
	["2nd clud:1/to AB plane[mm.]", "", "", "-0.18", `${result["oneToABPlane"]?.toFixed(2) || ""}`, "~"],
	["2.1 Max Buffolo Hum", "", "", "-0.18", '19.1"', "~"],
	["2.12 Mand Bird Beak", "", "", "-0.18", '19.1"', "~"],
	["3rd clue:Mesially Inclined of Lat. Dent", "", "", "-0.18", '19.1"', "~"],
];

export const surgicalTendencyData = (result: Result) => [
	["palatal Plane/Mandibular Plane", "", "+/0.67", "-0.18", `${result["palatalPlane"]?.toFixed(2) || ""}`, "~"],
];

export const dentureFrameData = (result: Result) => [
	["25. Denture Frame", "", "", "-0.18", '19.1"', "~"],
	["26. DPO [Distance-mm]", "No Norm", "No Norm", "-0.18", `${result["dpo"]?.toFixed(2) || ""}`, "~"],
	[
		"27. Angle of Condylar path VS Occ. plane",
		"No Norm",
		"No Norm",
		"-0.18",
		`${result["angleOfCondylarPathVSOccPlane"]?.toFixed(2) || ""}`,
		"~",
	],
];
