"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { CanvasHandler, CanvasProps, Point } from "../../app/diagnosis/model/type";
import { CANVAS_CONFIG } from "../../app/base-const";

const Canvas = forwardRef<CanvasHandler, CanvasProps>(function Canvas(
	{ imageFile, diagnosis },
	ref
) {

	const fixedWidth = CANVAS_CONFIG.size;
	const fixedHeight = CANVAS_CONFIG.size;
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const [image, setImage] = useState<HTMLImageElement>();

	useImperativeHandle(ref, () => ({
		current: canvasRef.current,
		redrawImage: redrawImage
	}));

	useEffect(() => {
		if (canvasRef.current && imageFile) {
			const context = canvasRef.current.getContext("2d");
			if (context && diagnosis.current) {
				initializeCanvas(context, imageFile);
				setCanvasStyles();
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [imageFile]);

	const setCanvasStyles = () => {
		if (canvasRef.current == null) return
		const context = canvasRef.current.getContext("2d");
		if (context == null) return
		context.fillStyle = "red";
		context.strokeStyle = "red";
		context.lineCap = "round";
		context.lineJoin = "round";
		context.lineWidth = 0.5;
	};

	const redrawImage = (rotationAngle: number) => {
		if (canvasRef.current) {
			const canvasContext = canvasRef.current.getContext("2d");
			if (canvasContext && image) {
				const { drawWidth, drawHeight } = calculateImageDimensions(image);
				const centerX = fixedWidth / 2;
				const centerY = fixedHeight / 2;
				const angleInRadians = (rotationAngle * Math.PI) / 180
				
				canvasContext.clearRect(0, 0, fixedWidth, fixedHeight);
				canvasContext.save();
				canvasContext.translate(centerX, centerY);
				canvasContext.rotate(angleInRadians)
				canvasContext.imageSmoothingEnabled = true
				canvasContext.drawImage(image, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
				canvasContext.restore();
			}
		}
	}

	const initializeCanvas = (context2D: CanvasRenderingContext2D, imageFile: File) => {
		if (canvasRef.current) {
			if (context2D) {
				context2D.canvas.width = fixedWidth;
				context2D.canvas.height = fixedHeight;
				initImageXRay(context2D, imageFile);
			}
		}
	};

	const initImageXRay = (context2D: CanvasRenderingContext2D, imageFile: File | null) => {
		if (!imageFile) return;

		const imageElement = new Image();
		imageElement.onload = () => {
			const { drawWidth, drawHeight} = calculateImageDimensions(imageElement);
			const centerX = fixedWidth / 2;
			const centerY = fixedHeight / 2;

			context2D.clearRect(0, 0, fixedWidth, fixedHeight);
			context2D.save();
			context2D.translate(centerX, centerY);
			context2D.imageSmoothingEnabled = true
			context2D.drawImage(imageElement, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
			context2D.restore();

			setImage(imageElement);
			diagnosis?.current?.setCanvasContext(context2D)
			diagnosis?.current?.reRenderFromTab(context2D)
		};

		imageElement.src = URL.createObjectURL(imageFile);
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

	const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
		if (diagnosis.current) {
			const point: Point = {
				x: e.nativeEvent.offsetX,
				y: e.nativeEvent.offsetY
			}
			diagnosis.current.click(point)
		}
	};

	const endDrawing = () => {
		if (canvasRef.current) {
			const canvasContext = canvasRef.current.getContext("2d");
			if (canvasContext) canvasContext.closePath();
		}
	};

	return <canvas id="canvas" ref={canvasRef} className="border border-grey-300 " width={fixedWidth} height={fixedHeight} onMouseDown={startDrawing} onMouseUp={endDrawing} style={{
		imageRendering: "auto",
		textRendering: "auto"
	  }} />;
});
export default Canvas;
