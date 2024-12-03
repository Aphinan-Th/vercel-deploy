"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { useDraw } from "./useDraw";
import { CanvasHandler, CanvasProps, DrawDetail, Point, Result, Style } from "./type";
import { DrawType, PointName } from "./enum";

const Canvas = forwardRef<CanvasHandler, CanvasProps>(function Canvas(
    { imageFile, imageAngle, steps, currentStep, setCurrentStep, updatePxToCen, resetAngle, setResult },
    ref
) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [canvasContext, setCanvasContext] = useState<CanvasRenderingContext2D | null>(null);
    const [currentPath, setCurrentPath] = useState<DrawDetail[]>([]);
    const [drawingActions, setDrawingActions] = useState<DrawDetail[]>([]);
    const [tempStep, setTempStep] = useState<number>(0);
    const [image, setImage] = useState<HTMLImageElement>();
    const [isHasFrankfortPlane, setIsHasFrankfortPlane] = useState<boolean>(false);
    const [currentStyle, setCurrentStyle] = useState<Style>({
        color: "red",
        lineWidth: 2,
    });

    const fixedWidth = 600;
    const fixedHeight = 600;

    const {
        drawHorizontalLine,
        drawLine,
        drawRectangle,
        drawAcuteAngle,
        clearCanvas,
        getAngleFromPoints,
        getDistanceBetweenPoint,
        generateNewPointWithExtent,
        getLineIntersection,
        getPerpendicularPoint,
    } = useDraw();

    useImperativeHandle(ref, () => ({
        clearDraw: clearDrawing,
        current: canvasRef.current,
        drawingActions: drawingActions
    }));

    useEffect(() => {
        if (canvasRef.current) {
            const ctx = canvasRef.current.getContext("2d");
            if (ctx) {
                initializeCanvas(ctx);
                setCanvasContext(ctx);
                redrawPreviousData(ctx, drawingActions);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [imageFile]);

    useEffect(() => {
        if (canvasContext) {
            setCanvasStyles(canvasContext, currentStyle);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [canvasContext, currentStyle]);

    useEffect(() => {
        if (currentPath.length > 0) {
            handleCurrentPathDrawing();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPath]);

    useEffect(() => {
        if (canvasContext && image) {
            rotateImage(canvasContext, image, imageAngle, drawingActions);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [imageAngle, image]);

    useEffect(() => {
        if (currentStep === steps.length) {
            alertCompleteSetPoints();
        }
        if (tempStep > currentStep) {
            undoDrawing();
        }
        setTempStep(currentStep);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentStep]);

    useEffect(() => {
        generateFrankfortPlane()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [drawingActions])

    const initializeCanvas = (ctx: CanvasRenderingContext2D) => {
        ctx.canvas.width = fixedWidth;
        ctx.canvas.height = fixedHeight;
        if (imageFile) initImageXRay(ctx, imageFile);
    };

    const setCanvasStyles = (ctx: CanvasRenderingContext2D, style: Style) => {
        ctx.fillStyle = style.color;
        ctx.strokeStyle = style.color;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.lineWidth = style.lineWidth;
    };

    const handleCurrentPathDrawing = () => {
        if (isStepDrawLine()) {
            drawLineFromPath();
        } else if (isStepDrawDistance()) {
            drawDistance();
        }
    };

    const alertCompleteSetPoints = () => {
        if (currentStep === steps.length) {
            setCurrentStyle({ color: "yellow", lineWidth: 1 });

            // Collecting results in an object
            const newResults: Result = {};

            // Y-Axis
            newResults.yAxis = computeYAxis();

            // FMA
            newResults.fma = computeFMA();

            // Gonion Angle
            newResults.gonionAngle = computeGonionAngle();

            // Cranial Base Angle
            newResults.cranialBaseAngle = computeCranialBaseAngle();

            // SNA (if needed)
            newResults.sna = computeSNA();

            // SNB (if needed)
            newResults.snb = computeSNB();

            // ANB
            newResults.anb = computeANB();

            // Point A to Nvert
            newResults.pointAToNvert = computePointAToNvert();

            // Wits Appraisal
            newResults.witsAppraisal = computeWitsAppraisal();

            // Interincisal Angle
            newResults.interincisalAngle = computeInterinsialAngle();

            // 1/ to SN
            newResults.oneToSN = compute1ToSN();

            // FMIA
            newResults.fmia = computeFMIA();

            // IMPA
            newResults.impa = computeIMPA();

            // Convexity to Point A
            newResults.convexityToPointA = computeConvexityToPointA();

            // Lower Lip to E-plane
            newResults.lowerLipToEPlane = computeLowerLipToEPlane();

            // 1/ to AB Plane
            newResults.oneToABPlane = compute1ToABPlane();

            // Palatal Plane
            newResults.palatalPlane = computePalatalPlane();

            // DPO
            newResults.dpo = computeDPO();

            // Angle of Condylar Path VS Occ Plane
            newResults.angleOfCondylarPathVSOccPlane = computeAngleOfCondylarPathVSOccPlane();

            // Set the results in the state
            setResult(newResults);
        }
    };

    const initImageXRay = (ctx: CanvasRenderingContext2D, file: File | null) => {
        if (!file) return;

        const imageElement = new Image();
        imageElement.onload = () => {
            const { drawWidth, drawHeight, offsetX, offsetY } = calculateImageDimensions(imageElement);
            ctx.clearRect(0, 0, fixedWidth, fixedHeight);
            ctx.drawImage(imageElement, offsetX, offsetY, drawWidth, drawHeight);
            setImage(imageElement);
        };

        imageElement.src = URL.createObjectURL(file);
    };

    const calculateImageDimensions = (imageElement: HTMLImageElement) => {
        const originalWidth = imageElement.width;
        const originalHeight = imageElement.height;
        const aspectRatio = originalWidth / originalHeight;

        let drawWidth = fixedWidth;
        let drawHeight = fixedHeight;

        if (fixedWidth / fixedHeight > aspectRatio) {
            drawWidth = fixedHeight * aspectRatio;
        } else {
            drawHeight = fixedWidth / aspectRatio;
        }

        const offsetX = (fixedWidth - drawWidth) / 2;
        const offsetY = (fixedHeight - drawHeight) / 2;

        return { drawWidth, drawHeight, offsetX, offsetY };
    };

    const rotateImage = (
        ctx: CanvasRenderingContext2D,
        imageElement: HTMLImageElement,
        angle: number,
        drawingActions: DrawDetail[]
    ) => {
        if (!ctx || !imageElement) return;

        const { drawWidth, drawHeight } = calculateImageDimensions(imageElement);
        const centerX = fixedWidth / 2;
        const centerY = fixedHeight / 2;

        ctx.clearRect(0, 0, fixedWidth, fixedHeight);
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(angle);
        ctx.drawImage(imageElement, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
        ctx.restore();
        redrawPreviousData(ctx, drawingActions);
    };

    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!canvasContext || currentStep >= steps.length) return;

        canvasContext.beginPath();
        const dotEvent: DrawDetail = {
            type: DrawType.Dot,
            startX: e.nativeEvent.offsetX,
            startY: e.nativeEvent.offsetY,
        };
        handleDrawEvent(dotEvent);
    };

    const handleDrawEvent = (drawDetail: DrawDetail) => {
        const stepType = steps[currentStep].type;
        switch (stepType) {
            case DrawType.FrankfortPlane:
                handleFrankfortPlane(drawDetail);
                break;
            case DrawType.Dot:
                handleDot(drawDetail);
                break;
            default:
                handleOtherDrawTypes(drawDetail);
                break;
        }
    };

    const handleFrankfortPlane = (drawDetail: DrawDetail) => {
        drawHorizontalLine(canvasContext, fixedWidth, drawDetail, steps[currentStep].pointName.toString());
        setCurrentPath((prev) => [
            ...prev,
            {
                type: DrawType.FrankfortPlane,
                startX: 0,
                startY: drawDetail.startY,
                endX: fixedWidth,
                endY: drawDetail.startY,
            },
        ]);
    };

    const handleDot = (drawDetail: DrawDetail) => {
        drawRectangle(canvasContext, drawDetail, steps[currentStep].pointName.toString());
        setCurrentPath((prev) => [
            ...prev,
            {
                type: DrawType.Dot,
                startX: drawDetail.startX,
                startY: drawDetail.startY,
            },
        ]);
    };

    const handleOtherDrawTypes = (drawDetail: DrawDetail) => {
        drawRectangle(canvasContext, drawDetail, "");
        setCurrentPath((prev) => [
            ...prev,
            {
                type: DrawType.Dot,
                startX: drawDetail.startX,
                startY: drawDetail.startY,
            },
        ]);
    };

    const endDrawing = () => {
        if (canvasContext) canvasContext.closePath();
        updateDrawingActions();
        handleDrawingCompletion();
    };

    const updateDrawingActions = () => {
        if (currentPath.length > 0 && (isStepDrawFrankfortPlane() || isStepDrawDot())) {
            const isDotEvent = isStepDrawFrankfortPlane() ? DrawType.FrankfortPlane : DrawType.Dot;
            setDrawingActions((prev) => [
                ...prev,
                {
                    pointName: steps[currentStep].pointName,
                    type: isDotEvent,
                    startX: currentPath[currentPath.length - 1].startX,
                    startY: currentPath[currentPath.length - 1].startY,
                },
            ]);
        }
    };

    const handleDrawingCompletion = () => {
        if (currentStep < steps.length && currentPath.length != 0) {
            if ((isStepDrawDistance() && currentPath.length === 2) || isStepDrawDot() || isStepDrawFrankfortPlane()) {
                setCurrentStep(currentStep + 1);
                setCurrentPath([]);
            }
        }
    };

    const undoDrawing = () => {
        if (drawingActions.length === 0) return;
        const newDrawingActions = drawingActions.slice(0, currentStep);
        setCurrentPath([]);
        clearCanvasBeforeRedraw(newDrawingActions);
        setDrawingActions(newDrawingActions);
    };

    const clearCanvasBeforeRedraw = (newDrawingActions: DrawDetail[]) => {
        if (canvasContext) {
            canvasContext.clearRect(0, 0, fixedWidth, fixedHeight);
            if (image) {
                rotateImage(canvasContext, image, imageAngle, newDrawingActions);
            }
        }
    };

    const clearDrawing = () => {
        setImage(undefined);
        setDrawingActions([]);
        setCurrentPath([]);
        setCurrentStep(0);
        setIsHasFrankfortPlane(false);
        resetAngle();
        setCurrentStyle({ color: "red", lineWidth: 2 });
        clearCanvas(canvasContext, canvasRef.current);
        if (canvasContext && imageFile) initImageXRay(canvasContext, imageFile);
    };

    const redrawPreviousData = (ctx: CanvasRenderingContext2D | null, drawingActions: DrawDetail[]) => {
        if (!ctx) return;

        drawingActions.forEach((drawDetail) => {
            ctx.beginPath();
            setCanvasStyles(ctx, currentStyle);
            ctx.moveTo(drawDetail.startX, drawDetail.startY);

            switch (drawDetail.type) {
                case DrawType.Dot:
                    drawRectangle(ctx, drawDetail, drawDetail.pointName?.toString() ?? "");
                    break;
                case DrawType.FrankfortPlane:
                    drawHorizontalLine(ctx, fixedWidth, drawDetail, drawDetail.pointName?.toString() ?? "");
                    break;
                case DrawType.Line:
                case DrawType.SetPxDistance:
                    drawLine(
                        ctx,
                        [
                            {
                                type: DrawType.Dot,
                                startX: drawDetail.startX,
                                startY: drawDetail.startY,
                            },
                            {
                                type: DrawType.Dot,
                                startX: drawDetail.endX ?? 0,
                                startY: drawDetail.endY ?? 0,
                            },
                        ],
                        drawDetail.pointName?.toString() ?? ""
                    );
                    drawRectangle(ctx, drawDetail, "");
                    break;
                default:
                    drawRectangle(ctx, drawDetail, drawDetail.pointName?.toString() ?? "");
                    break;
            }
            ctx.stroke();
        });
    };

    const drawLineFromPath = () => {
        if (canvasContext && currentPath.length > 1 && isStepDrawLine()) {
            drawLine(canvasContext, currentPath, steps[currentStep].pointName.toString());
            setDrawingActions((prev) => [
                ...prev,
                {
                    pointName: steps[currentStep].pointName,
                    type: DrawType.Line,
                    startX: currentPath[0].startX,
                    startY: currentPath[0].startY,
                    endX: currentPath[1].startX,
                    endY: currentPath[1].startY,
                },
            ]);
            setCurrentPath([]);
            setCurrentStep(currentStep + 1);
        }
    };

    const drawDistance = () => {
        if (canvasContext && currentPath.length > 1 && isStepDrawDistance()) {
            const distance = getDistanceBetweenPoint(
                currentPath[0].startX,
                currentPath[0].startY,
                currentPath[1].startX,
                currentPath[1].startY
            );
            updatePxToCen(distance);
            drawLine(canvasContext, currentPath, steps[currentStep].pointName.toString());
            setDrawingActions((prev) => [
                ...prev,
                {
                    pointName: PointName.Distance,
                    type: DrawType.SetPxDistance,
                    startX: currentPath[0].startX,
                    startY: currentPath[0].startY,
                    endX: currentPath[1].startX,
                    endY: currentPath[1].startY,
                },
            ]);
        }
    };

    const generateFrankfortPlane = () => {
        const PrPoint = findDrawingAction(PointName.Pr);
        const OrPoint = findDrawingAction(PointName.Or);
        if (isHasFrankfortPlane === false && PrPoint && OrPoint && canvasContext) {
            const intersectPointLeft = findIntersectPointFromExtendLine(
                { x: OrPoint.startX, y: OrPoint.startY },
                { x: PrPoint.startX, y: PrPoint.startY },
                { x: 0, y: 0 },
                { x: 0, y: fixedHeight }
            );

            const intersectPointRight = findIntersectPointFromExtendLine(
                { x: PrPoint.startX, y: PrPoint.startY },
                { x: OrPoint.startX, y: OrPoint.startY },
                { x: fixedWidth, y: 0 },
                { x: fixedWidth, y: fixedHeight }
            );

            if (
                intersectPointLeft?.x != undefined &&
                intersectPointRight?.x != undefined &&
                intersectPointLeft?.y != undefined &&
                intersectPointRight?.y
            ) {
                const paths: DrawDetail[] = [
                    {
                        type: DrawType.Dot,
                        startX: intersectPointLeft.x,
                        startY: intersectPointLeft.y,
                    },
                    {
                        type: DrawType.Dot,
                        startX: intersectPointRight.x,
                        startY: intersectPointRight.y,
                    }
                ]
                setIsHasFrankfortPlane(true)
                drawLine(canvasContext, paths, "");
            }

        }
    }

    const isStepDrawDot = () => steps[currentStep].type === DrawType.Dot;
    const isStepDrawLine = () => steps[currentStep].type === DrawType.Line;
    const isStepDrawDistance = () => steps[currentStep].type === DrawType.SetPxDistance;
    const isStepDrawFrankfortPlane = () => steps[currentStep].type === DrawType.FrankfortPlane;

    const computeYAxis = () => {
        const NPoint = findDrawingAction(PointName.N);
        const SPoint = findDrawingAction(PointName.S);
        const PoPoint = findDrawingAction(PointName.Po);
        const MeToLrLine = findDrawingAction(PointName.MeToLr);

        if (NPoint && SPoint && PoPoint && MeToLrLine && canvasContext) {
            canvasContext.moveTo(NPoint.startX, NPoint.startY);
            canvasContext.lineTo(PoPoint.startX, PoPoint.startY);
            canvasContext.stroke();

            const intersectPoint = findIntersectPointFromExtendLine(
                { x: NPoint.startX, y: NPoint.startY },
                { x: PoPoint.startX, y: PoPoint.startY },
                { x: MeToLrLine.endX ?? 0, y: MeToLrLine.endY ?? 0 },
                { x: MeToLrLine.startX, y: MeToLrLine.startY }
            );

            if (intersectPoint?.x && intersectPoint?.y) {
                const gnPoint = {
                    type: DrawType.Dot,
                    startX: intersectPoint.x,
                    startY: intersectPoint.y,
                };
                const angleResult = getAngleFromPoints(NPoint, SPoint, gnPoint);
                console.log(`>>> Y axis  ${angleResult}`);
                return angleResult;
            }
        }
        return 0;
    };

    const computeFMA = (): number => {
        const PrPoint = findDrawingAction(PointName.Pr);
        const OrPoint = findDrawingAction(PointName.Or);
        const MeToLrLine = findDrawingAction(PointName.MeToLr);

        if (PrPoint && OrPoint && MeToLrLine && canvasContext) {
            const intersectPoint = findIntersectPointFromExtendLine(
                { x: OrPoint.startX, y: OrPoint.startY },
                { x: PrPoint.startX, y: PrPoint.startY },
                { x: MeToLrLine.endX ?? 0, y: MeToLrLine.endY ?? 0 },
                { x: MeToLrLine.startX, y: MeToLrLine.startY }
            );

            if (intersectPoint?.x && intersectPoint?.y) {
                const pivotPoint = {
                    type: DrawType.Dot,
                    startX: intersectPoint.x,
                    startY: intersectPoint.y,
                };
                const angleResult = getAngleFromPoints(PrPoint, pivotPoint, MeToLrLine);

                console.log(`>>> FMA  ${angleResult}`);
                return angleResult;
            }
        }
        return 0;
    };

    const computeGonionAngle = () => {
        const RamusPlane = findDrawingAction(PointName.RamusPlane);
        const MeToLrLine = findDrawingAction(PointName.MeToLr);

        if (RamusPlane && MeToLrLine && canvasContext) {
            const intersectPoint = findIntersectPointFromExtendLine(
                { x: RamusPlane.startX, y: RamusPlane.startY },
                { x: RamusPlane.endX ?? 0, y: RamusPlane.endY ?? 0 },
                { x: MeToLrLine.startX, y: MeToLrLine.startY },
                { x: MeToLrLine.endX ?? 0, y: MeToLrLine.endY ?? 0 }
            );

            if (intersectPoint?.x && intersectPoint?.y) {
                const investRamusPoint: DrawDetail = {
                    type: DrawType.Dot,
                    startX: RamusPlane.endX ?? 0,
                    startY: RamusPlane.endY ?? 0,
                    endX: RamusPlane.startX,
                    endY: RamusPlane.startY,
                };
                const pivotPoint = {
                    type: DrawType.Dot,
                    startX: intersectPoint.x,
                    startY: intersectPoint.y,
                };
                const angleResult = getAngleFromPoints(investRamusPoint, pivotPoint, MeToLrLine);
                console.log(`>>> Gonion ${angleResult}`);
                return angleResult;
            }
        }
        return 0;
    };

    const computeCranialBaseAngle = () => {
        const NPoint = findDrawingAction(PointName.N);
        const SPoint = findDrawingAction(PointName.S);
        const BaPoint = findDrawingAction(PointName.Ba);

        if (NPoint && SPoint && BaPoint && canvasContext) {
            drawAcuteAngle(canvasContext, NPoint, SPoint, BaPoint);
            const angleResult = getAngleFromPoints(NPoint, SPoint, BaPoint);
            console.log(`>>> CranialBase ${angleResult}`);
            return angleResult;
        }
        return 0;
    };

    const computeSNA = (): number => {
        const SPoint = findDrawingAction(PointName.S);
        const NPoint = findDrawingAction(PointName.N);
        const APoint = findDrawingAction(PointName.A);

        if (NPoint && SPoint && APoint && canvasContext) {
            drawAcuteAngle(canvasContext, SPoint, NPoint, APoint);
            const angleResult = getAngleFromPoints(SPoint, NPoint, APoint);

            console.log(`>>> SNA ${angleResult}`);
            return angleResult;
        }
        return 0;
    };

    const computeSNB = (): number => {
        const SPoint = findDrawingAction(PointName.S);
        const NPoint = findDrawingAction(PointName.N);
        const BPoint = findDrawingAction(PointName.B);

        if (NPoint && SPoint && BPoint && canvasContext) {
            drawAcuteAngle(canvasContext, SPoint, NPoint, BPoint);
            const angleResult = getAngleFromPoints(SPoint, NPoint, BPoint);

            console.log(`>>> SNB ${angleResult}`);
            return angleResult;
        }
        return 0;
    };

    const computeANB = () => {
        const sna = computeSNA();
        const snb = computeSNB();

        if (sna && snb) {
            const anb = sna - snb;
            console.log(`>>> anb ${anb}`);
            return anb;
        }
        return 0;
    };

    const computePointAToNvert = () => {
        const NPoint = findDrawingAction(PointName.N);
        const PrPoint = findDrawingAction(PointName.Pr);
        const OrPoint = findDrawingAction(PointName.Or);

        if (NPoint && PrPoint && OrPoint) {
            const perpendicularPoint = getPerpendicularPoint(
                { x: NPoint.startX, y: NPoint.startY },
                { x: PrPoint.startX, y: PrPoint.startY },
                { x: OrPoint.startX, y: OrPoint.startY }
            );
            const distance = getDistanceBetweenPoint(
                NPoint.startX,
                NPoint.startY,
                perpendicularPoint.x,
                perpendicularPoint.y
            );
            console.log(`>>> A To Nvert ${distance} px`);
            return distance;
        }
        return 0;
    };

    const computeWitsAppraisal = () => {
        const APoint = findDrawingAction(PointName.A);
        const A1Point = findDrawingAction(PointName.A1);
        const BPoint = findDrawingAction(PointName.B);
        const MpPoint = findDrawingAction(PointName.Mp);

        if (APoint && A1Point && BPoint && MpPoint) {
            const aoPoint = getPerpendicularPoint(
                { x: APoint.startX, y: APoint.startY },
                { x: A1Point.startX, y: A1Point.startY },
                { x: MpPoint.startX, y: MpPoint.startY }
            );

            const boPoint = getPerpendicularPoint(
                { x: BPoint.startX, y: BPoint.startY },
                { x: A1Point.startX, y: A1Point.startY },
                { x: MpPoint.startX, y: MpPoint.startY }
            );

            const distance = getDistanceBetweenPoint(aoPoint.x, aoPoint.y, boPoint.x, boPoint.y);
            console.log(`>>> computeWitsAppraisal  ${distance}`);
            return distance;
        }
        return 0;
    };

    const computeInterinsialAngle = () => {
        const A1Point = findDrawingAction(PointName.A1);
        const ArPoint = findDrawingAction(PointName.Ar);
        const B1Point = findDrawingAction(PointName.B1);
        const BrPoint = findDrawingAction(PointName.Br);

        if (A1Point && ArPoint && B1Point && BrPoint && canvasContext) {
            const intersectPoint = findIntersectPointFromExtendLine(
                { x: ArPoint.startX, y: ArPoint.startY },
                { x: A1Point.startX, y: A1Point.startY },
                { x: BrPoint.startX, y: BrPoint.startY },
                { x: B1Point.startX, y: B1Point.startY }
            );

            if (intersectPoint?.x && intersectPoint?.y) {
                const pivotPoint = {
                    type: DrawType.Dot,
                    startX: intersectPoint.x,
                    startY: intersectPoint.y,
                };
                const angleResult = getAngleFromPoints(ArPoint, pivotPoint, BrPoint);
                console.log(`>>> InterinsialAngle  ${angleResult}`);
                return angleResult;
            }
        }
        return 0;
    };

    const compute1ToSN = () => {
        const A1Point = findDrawingAction(PointName.A1);
        const ArPoint = findDrawingAction(PointName.Ar);
        const SPoint = findDrawingAction(PointName.S);
        const NPoint = findDrawingAction(PointName.N);

        if (SPoint && NPoint && A1Point && ArPoint && canvasContext) {
            const intersectPoint = findIntersectPointFromExtendLine(
                { x: SPoint.startX, y: SPoint.startY },
                { x: NPoint.startX, y: NPoint.startY },
                { x: A1Point.startX, y: A1Point.startY },
                { x: ArPoint.startX, y: ArPoint.startY }
            );

            if (intersectPoint?.x && intersectPoint?.y) {
                const pivotPoint = {
                    type: DrawType.Dot,
                    startX: intersectPoint.x,
                    startY: intersectPoint.y,
                };
                const angleResult = getAngleFromPoints(SPoint, pivotPoint, ArPoint);
                console.log(`>>> 1\ ToSN  ${angleResult}`);
                return angleResult;
            }
        }
        return 0;
    };

    const computeFMIA = (): number => {
        const PrPoint = findDrawingAction(PointName.Pr);
        const OrPoint = findDrawingAction(PointName.Or);
        const B1Point = findDrawingAction(PointName.B1);
        const BrPoint = findDrawingAction(PointName.Br);

        if (PrPoint && OrPoint && B1Point && BrPoint && canvasContext) {
            // let totalExtendedDistance = 0
            // var pivotPoint: DrawDetail | undefined = undefined

            const intersectPoint = findIntersectPointFromExtendLine(
                { x: BrPoint.startX, y: BrPoint.startY },
                { x: B1Point.startX, y: B1Point.startY },
                { x: PrPoint.startX, y: PrPoint.startY },
                { x: OrPoint.startX, y: OrPoint.startY }
            );

            if (intersectPoint?.x && intersectPoint?.y) {
                const pivotPoint = {
                    type: DrawType.Dot,
                    startX: intersectPoint.x,
                    startY: intersectPoint.y,
                };
                const angleResult = getAngleFromPoints(OrPoint, pivotPoint, B1Point);

                console.log(`>>> FMIA  ${angleResult}`);
                return angleResult;
            }
        }
        return 0;
    };

    const computeIMPA = () => {
        const angleOfFMIA = computeFMIA();
        const angleOfFMA = computeFMA();
        if (angleOfFMA && angleOfFMIA) {
            const impa = 180 - angleOfFMIA - angleOfFMA;
            console.log(`>>> IMPA ${impa}`);
            return impa;
        }
        return 0;
    };

    const computeConvexityToPointA = () => {
        const APoint = findDrawingAction(PointName.A);
        const NPoint = findDrawingAction(PointName.N);
        const PoPoint = findDrawingAction(PointName.Po);

        if (APoint && NPoint && PoPoint) {
            const perpendicularPoint = getPerpendicularPoint(
                { x: APoint.startX, y: APoint.startY },
                { x: PoPoint.startX, y: PoPoint.startY },
                { x: NPoint.startX, y: NPoint.startY }
            );
            const distance = getDistanceBetweenPoint(
                APoint.startX,
                APoint.startY,
                perpendicularPoint.x,
                perpendicularPoint.y
            );
            console.log(`>>> Convexity to A ${distance} px`);
            return distance;
        }
        return 0;
    };

    const computeLowerLipToEPlane = () => {
        const LLPoint = findDrawingAction(PointName.LL);
        const ENPoint = findDrawingAction(PointName.EN);
        const DtPoint = findDrawingAction(PointName.Dt);

        if (LLPoint && ENPoint && DtPoint) {
            canvasContext?.moveTo(ENPoint.startX, ENPoint.startY);
            canvasContext?.lineTo(DtPoint.startX, DtPoint.startY);
            canvasContext?.stroke();

            const perpendicularPoint = getPerpendicularPoint(
                { x: LLPoint.startX, y: LLPoint.startY },
                { x: ENPoint.startX, y: ENPoint.startY },
                { x: DtPoint.startX, y: DtPoint.startY }
            );
            const distance = getDistanceBetweenPoint(
                LLPoint.startX,
                LLPoint.startY,
                perpendicularPoint.x,
                perpendicularPoint.y
            );
            console.log(`>>> LowerLipToEPlane ${distance} px`);
            return distance;
        }
        return 0;
    };

    const compute1ToABPlane = () => {
        const A1Point = findDrawingAction(PointName.A1);
        const APoint = findDrawingAction(PointName.A);
        const BPoint = findDrawingAction(PointName.B);

        if (A1Point && APoint && BPoint) {
            const perpendicularPoint = getPerpendicularPoint(
                { x: A1Point.startX, y: A1Point.startY },
                { x: APoint.startX, y: APoint.startY },
                { x: BPoint.startX, y: BPoint.startY }
            );
            const distance = getDistanceBetweenPoint(
                A1Point.startX,
                A1Point.startY,
                perpendicularPoint.x,
                perpendicularPoint.y
            );
            console.log(`>>> compute1ToABPlane ${distance} px`);
            return distance;
        }
        return 0;
    };

    const computePalatalPlane = () => {
        const NPoint = findDrawingAction(PointName.N);
        const PoPoint = findDrawingAction(PointName.Po);
        const MeToLrLine = findDrawingAction(PointName.MeToLr);
        const ANSPoint = findDrawingAction(PointName.ANS);
        const PNSPoint = findDrawingAction(PointName.PNS);
        const RamusPlane = findDrawingAction(PointName.RamusPlane);

        if (NPoint && PoPoint && MeToLrLine && ANSPoint && PNSPoint && RamusPlane && canvasContext) {
            const gnPoint = findIntersectPointFromExtendLine(
                { x: NPoint.startX, y: NPoint.startY },
                { x: PoPoint.startX, y: PoPoint.startY },
                { x: MeToLrLine.endX ?? 0, y: MeToLrLine.endY ?? 0 },
                { x: MeToLrLine.startX, y: MeToLrLine.startY }
            );

            if (gnPoint?.x && gnPoint?.y) {
                const intersectPoint = findIntersectPointFromExtendLine(
                    { x: ANSPoint.startX, y: ANSPoint.startY },
                    { x: PNSPoint.startX, y: PNSPoint.startY },
                    { x: gnPoint.x, y: gnPoint.y },
                    { x: RamusPlane.startX ?? 0, y: RamusPlane.startY ?? 0 }
                );

                if (intersectPoint?.x && intersectPoint?.y) {
                    const pivotPoint = {
                        type: DrawType.Dot,
                        startX: intersectPoint.x,
                        startY: intersectPoint.y,
                    };
                    const angleResult = getAngleFromPoints(PNSPoint, pivotPoint, RamusPlane);
                    console.log(`>>> computePalatalPlane ${angleResult}`);
                    return angleResult;
                }
            }
        }
        return 0;
    };

    const computeDPO = () => {
        const DPoint = findDrawingAction(PointName.D);
        const A1Point = findDrawingAction(PointName.A1);
        const MpPoint = findDrawingAction(PointName.Mp);

        if (DPoint && A1Point && MpPoint) {
            const perpendicularPoint = getPerpendicularPoint(
                { x: DPoint.startX, y: DPoint.startY },
                { x: A1Point.startX, y: A1Point.startY },
                { x: MpPoint.startX, y: MpPoint.startY }
            );
            const distance = getDistanceBetweenPoint(
                DPoint.startX,
                DPoint.startY,
                perpendicularPoint.x,
                perpendicularPoint.y
            );
            console.log(`>>> computeDPO ${distance} px`);
            return distance;
        }
        return 0;
    };

    const computeAngleOfCondylarPathVSOccPlane = () => {
        const PoCPlane = findDrawingAction(PointName.PoC);
        const A1Point = findDrawingAction(PointName.A1);
        const MpPoint = findDrawingAction(PointName.Mp);

        if (PoCPlane && A1Point && MpPoint && canvasContext) {
            const intersectPoint = findIntersectPointFromExtendLine(
                { x: MpPoint.startX, y: MpPoint.startY },
                { x: A1Point.startX, y: A1Point.startY },
                { x: PoCPlane.startX, y: PoCPlane.startY },
                { x: PoCPlane.endX ?? 0, y: PoCPlane.endY ?? 0 }
            );

            if (intersectPoint?.x && intersectPoint?.y) {
                const pivotPoint = {
                    type: DrawType.Dot,
                    startX: intersectPoint.x,
                    startY: intersectPoint.y,
                };
                const angleResult = getAngleFromPoints(PoCPlane, pivotPoint, A1Point);
                console.log(`>>> computeAngleOfCondylarPathVSOccPlane ${angleResult}`);
                return angleResult;
            }
        }
        return 0;
    };

    const findDrawingAction = (pointName: PointName) => drawingActions.findLast((draw) => draw.pointName === pointName);

    const findIntersectPointFromExtendLine = (
        lineStart: Point,
        lineEnd: Point,
        lineSecond: Point,
        lineSecondEnd: Point
    ): Point | undefined => {
        let totalExtendedDistance = 0;
        while (totalExtendedDistance < 100) {
            totalExtendedDistance += 0.1;

            const newLine = generateNewPointWithExtent(
                lineStart.x,
                lineStart.y,
                lineEnd.x,
                lineEnd.y,
                totalExtendedDistance
            );

            const newLineSecond = generateNewPointWithExtent(
                lineSecond.x,
                lineSecond.y,
                lineSecondEnd.x,
                lineSecondEnd.y,
                totalExtendedDistance
            );

            const intersection = getLineIntersection(
                { x: lineStart.x, y: lineStart.y },
                { x: newLine.x, y: newLine.y },
                { x: lineSecond.x, y: lineSecond.y },
                { x: newLineSecond.x, y: newLineSecond.y }
            );

            if (intersection?.x != null && intersection?.y != null && canvasContext) {
                const newPivot = {
                    type: DrawType.Dot,
                    startX: intersection?.x,
                    startY: intersection?.y,
                };
                drawRectangle(canvasContext, newPivot, "");
                return intersection;
            }
        }
    };

    return <canvas ref={canvasRef} onMouseDown={startDrawing} onMouseUp={endDrawing} />;
});

export default Canvas;
