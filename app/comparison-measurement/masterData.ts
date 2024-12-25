import { Measurement } from "../diagnosis/type";

export const defaultMeasurement: Measurement = {
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
    angleOfCondylarPathVSOccPlane: 0
};

export const skeletalHeaders = ["SKELETAL RELATIONSHIP", "", "", "", "", "", "", "", ""];
export const toothHeaders = ["Tooth to Skeletal Relationship", "", "", "", "", "", "", "", ""];
export const labialHeaders = ["Is labial profile an issue?", "", "", "", "", "", "", "", ""];
export const surgicalHeaders = ["Surgical Tendency", "", "", "", "", "", "", "", ""];
export const dentureFrameHeaders = ["Denture Frame", "", "", "", "", "", "", "", ""];

export type TableData = {
    label: string,
    key: string,
    reference: string,
    deviation: string,
    indices: number[],
    interpretation: string
}

const safeAccess = (array: Measurement[], index: number): Measurement | null => {
    return array[index] !== undefined ? array[index] : null;
};

export const measurementData = (result: Measurement[]) => [
    [
        "1. Y-Axis",
        "65.0",
        "+/-4.6",
        "-0.24",
        `${safeAccess(result, 0)?.yAxis.toFixed(2) || ""}`,
        `${safeAccess(result, 1)?.yAxis.toFixed(2) || ""}`,
        `${safeAccess(result, 2)?.yAxis.toFixed(2) || ""}`,
        `${safeAccess(result, 3)?.yAxis.toFixed(2) || ""}`,
        "~"
    ],
    [
        "2. FMA [Twedd Triangle]",
        "25.0", "+/-4.4",
        "-0.18",
        `${safeAccess(result, 0)?.fma.toFixed(2) || ""}`,
        `${safeAccess(result, 1)?.fma.toFixed(2) || ""}`,
        `${safeAccess(result, 2)?.fma.toFixed(2) || ""}`,
        `${safeAccess(result, 3)?.fma.toFixed(2) || ""}`,
        "~"
    ],
    [
        "3. Gonion Angle",
        "130.0", "", "-0.18",
        `${safeAccess(result, 0)?.gonionAngle.toFixed(2) || ""}`,
        `${safeAccess(result, 1)?.gonionAngle.toFixed(2) || ""}`,
        `${safeAccess(result, 2)?.gonionAngle.toFixed(2) || ""}`,
        `${safeAccess(result, 3)?.gonionAngle.toFixed(2) || ""}`,
        "~"
    ]
]

export const skeletalData = (result: Measurement[]) => [
    [
        "4. Cranial Base Angle",
        "130.0",
        "+/-5.0",
        "-0.18",
        `${safeAccess(result, 0)?.cranialBaseAngle.toFixed(2) || ""}`,
        `${safeAccess(result, 1)?.cranialBaseAngle.toFixed(2) || ""}`,
        `${safeAccess(result, 2)?.cranialBaseAngle.toFixed(2) || ""}`,
        `${safeAccess(result, 3)?.cranialBaseAngle.toFixed(2) || ""}`,
        "~"
    ],
    [
        "5. SNA",
        "82.0",
        "+/-3.2",
        "-0.18",
        `${safeAccess(result, 0)?.sna.toFixed(2) || ""}`,
        `${safeAccess(result, 1)?.sna.toFixed(2) || ""}`,
        `${safeAccess(result, 2)?.sna.toFixed(2) || ""}`,
        `${safeAccess(result, 3)?.sna.toFixed(2) || ""}`,
        "~"
    ],
    [
        "6. SNB",
        "80.0",
        "+/-3.0",
        "-0.18",
        `${safeAccess(result, 0)?.snb.toFixed(2) || ""}`,
        `${safeAccess(result, 1)?.snb.toFixed(2) || ""}`,
        `${safeAccess(result, 2)?.snb.toFixed(2) || ""}`,
        `${safeAccess(result, 3)?.snb.toFixed(2) || ""}`,
        "~"
    ],
    [
        "7. ANB",
        "2.0",
        "+/-2.3",
        "-0.18",
        `${safeAccess(result, 0)?.anb.toFixed(2) || ""}`,
        `${safeAccess(result, 1)?.anb.toFixed(2) || ""}`,
        `${safeAccess(result, 2)?.anb.toFixed(2) || ""}`,
        `${safeAccess(result, 3)?.anb.toFixed(2) || ""}`,
        "~"
    ],
    [
        "8. Point A to Nvert",
        "1.0",
        "+/-4.4",
        "-0.18",
        `${safeAccess(result, 0)?.pointAToNvert?.toFixed(2) || ""}`,
        `${safeAccess(result, 1)?.pointAToNvert?.toFixed(2) || ""}`,
        `${safeAccess(result, 2)?.pointAToNvert?.toFixed(2) || ""}`,
        `${safeAccess(result, 3)?.pointAToNvert?.toFixed(2) || ""}`,
        "~"
    ],
    [
        "9. Wits appraisal",
        "0.0",
        "+/-4.4",
        "-0.18",
        `${safeAccess(result, 0)?.witsAppraisal?.toFixed(2) || ""}`,
        `${safeAccess(result, 1)?.witsAppraisal?.toFixed(2) || ""}`,
        `${safeAccess(result, 2)?.witsAppraisal?.toFixed(2) || ""}`,
        `${safeAccess(result, 3)?.witsAppraisal?.toFixed(2) || ""}`,
        "~"
    ],
];

export const toothData = (result: Measurement[]) => [
    [
        "10. Interincisal Angle",
        "132.0",
        "+/-10.7",
        "-0.18",
        `${safeAccess(result, 0)?.interincisalAngle.toFixed(2) || ""}`,
        `${safeAccess(result, 1)?.interincisalAngle.toFixed(2) || ""}`,
        `${safeAccess(result, 2)?.interincisalAngle.toFixed(2) || ""}`,
        `${safeAccess(result, 3)?.interincisalAngle.toFixed(2) || ""}`,

        "~"],
    [
        "11. 1/ to SN",
        "103.6",
        "+/-7.1", "-0.18",
        `${safeAccess(result, 0)?.oneToSN.toFixed(2) || ""}`,
        `${safeAccess(result, 1)?.oneToSN.toFixed(2) || ""}`,
        `${safeAccess(result, 2)?.oneToSN.toFixed(2) || ""}`,
        `${safeAccess(result, 3)?.oneToSN.toFixed(2) || ""}`,
        "~"],
    [
        "12. FMIA",
        "60.0",
        "+/-8.5",
        "-0.18",
        `${safeAccess(result, 0)?.fmia.toFixed(2) || ""}`,
        `${safeAccess(result, 1)?.fmia.toFixed(2) || ""}`,
        `${safeAccess(result, 2)?.fmia.toFixed(2) || ""}`,
        `${safeAccess(result, 3)?.fmia.toFixed(2) || ""}`,
        "~"],
    [
        "13. IMPA",
        "95.0",
        "+/-6.3",
        "-0.18",
        `${safeAccess(result, 0)?.impa.toFixed(2) || ""}`,
        `${safeAccess(result, 1)?.impa.toFixed(2) || ""}`,
        `${safeAccess(result, 2)?.impa.toFixed(2) || ""}`,
        `${safeAccess(result, 3)?.impa.toFixed(2) || ""}`,
        "~"],
    [
        "14. Convexity to Point A",
        "2.0",
        "+/-2.0",
        "-0.18",
        `${safeAccess(result, 0)?.convexityToPointA?.toFixed(2) || ""}`,
        `${safeAccess(result, 1)?.convexityToPointA?.toFixed(2) || ""}`,
        `${safeAccess(result, 2)?.convexityToPointA?.toFixed(2) || ""}`,
        `${safeAccess(result, 3)?.convexityToPointA?.toFixed(2) || ""}`,
        "~"],
];

export const labialData = (result: Measurement[]) => [
    [
        "1st clue:Lower Lip to E-plane", "2.0", "+/-2.0", "-0.18",
        `${safeAccess(result, 0)?.lowerLipToEPlane.toFixed(2) || ""}`,
        `${safeAccess(result, 1)?.lowerLipToEPlane.toFixed(2) || ""}`,
        `${safeAccess(result, 2)?.lowerLipToEPlane.toFixed(2) || ""}`,
        `${safeAccess(result, 3)?.lowerLipToEPlane.toFixed(2) || ""}`,
        "~"
    ],
    ["1.1 Lip: Thick/Thin", "", "", "-0.18", '19.1"', "", "", "", "~"],
    ["1.2 Incomplete Lip Seal", "", "", "-0.18", '19.1"', "", "", "", "~"],
    ["1.3 Exposed Vermillion Border", "", "", "-0.18", '19.1"', "", "", "", "~"],
    ["1.4 Hyperactive Mentalis Muscle", "", "", "-0.18", '19.1"', "", "", "", "~"],
    ["1.4 Hyperactive Mentalis Muscle", "", "", "-0.18", '19.1"', "", "", "", "~"],
    [
        "2nd clud:1/to AB plane[mm.]", "", "", "-0.18",
        `${safeAccess(result, 0)?.oneToABPlane.toFixed(2) || ""}`,
        `${safeAccess(result, 1)?.oneToABPlane.toFixed(2) || ""}`,
        `${safeAccess(result, 2)?.oneToABPlane.toFixed(2) || ""}`,
        `${safeAccess(result, 3)?.oneToABPlane.toFixed(2) || ""}`,
        "~"
    ],
    ["2.1 Max Buffolo Hum", "", "", "-0.18", '19.1"', "", "", "", "~"],
    ["2.12 Mand Bird Beak", "", "", "-0.18", '19.1"', "", "", "", "~"],
    ["3rd clue:Mesially Inclined of Lat. Dent", "", "", "-0.18", '19.1"', "", "", "", "~"],
];

export const surgicalTendencyData = (result: Measurement[]) => [
    [
        "palatal Plane/Mandibular Plane",
        "",
        "+/0.67",
        "-0.18",
        `${safeAccess(result, 0)?.palatalPlane.toFixed(2) || ""}`,
        `${safeAccess(result, 1)?.palatalPlane.toFixed(2) || ""}`,
        `${safeAccess(result, 2)?.palatalPlane.toFixed(2) || ""}`,
        `${safeAccess(result, 3)?.palatalPlane.toFixed(2) || ""}`,
        "~"
    ],
];

export const dentureFrameData = (result: Measurement[]) => [
    ["25. Denture Frame", "", "", "-0.18", '19.1"', "", "", "", "~"],
    [
        "26. DPO [Distance-mm]", "No Norm", "No Norm", "-0.18",
        `${safeAccess(result, 0)?.dpo.toFixed(2) || ""}`,
        `${safeAccess(result, 1)?.dpo.toFixed(2) || ""}`,
        `${safeAccess(result, 2)?.dpo.toFixed(2) || ""}`,
        `${safeAccess(result, 3)?.dpo.toFixed(2) || ""}`,
        "~"
    ],
    [
        "27. Angle of Condylar path VS Occ. plane",
        "No Norm",
        "No Norm",
        "-0.18",
        `${safeAccess(result, 0)?.angleOfCondylarPathVSOccPlane.toFixed(2) || ""}`,
        `${safeAccess(result, 1)?.angleOfCondylarPathVSOccPlane.toFixed(2) || ""}`,
        `${safeAccess(result, 2)?.angleOfCondylarPathVSOccPlane.toFixed(2) || ""}`,
        `${safeAccess(result, 3)?.angleOfCondylarPathVSOccPlane.toFixed(2) || ""}`,
        "~",
    ],
];
