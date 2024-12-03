import { DrawDetail, Point } from "./type";

export const useDraw = () => {
	const drawHorizontalLine = (
		canvasContext: CanvasRenderingContext2D | null,
		imageWidth: number,
		drawDetail: DrawDetail,
		text?: string
	) => {
		if (canvasContext == null) return;
		canvasContext.moveTo(0, drawDetail.startY);
		canvasContext.lineTo(imageWidth, drawDetail.startY);
		canvasContext.stroke();
	};

	const drawLine = (
		canvasContext: CanvasRenderingContext2D,
		currentPath: DrawDetail[],
		text: string
	) => {
		if (canvasContext && currentPath.length > 1) {
			const startX = currentPath[0].startX;
			const startY = currentPath[0].startY;
			const endX = currentPath[1].startX ?? 0;
			const endY = currentPath[1].startY ?? 0;
			canvasContext.moveTo(startX, startY);
			canvasContext.lineTo(endX, endY);
			canvasContext.stroke();
			drawText(canvasContext, text, currentPath[1]);
		}
	};

	const drawText = (
		canvasContext: CanvasRenderingContext2D,
		text: string,
		currentPath: DrawDetail
	) => {
		if (canvasContext) {
			canvasContext.font = "italic 10px courier";
			canvasContext.fillText(
				text,
				currentPath.startX - 5,
				currentPath.startY - 5
			);
		}
	};

	const drawRectangle = (
		canvasContext: CanvasRenderingContext2D | null,
		data: DrawDetail,
		text: string
	) => {
		if (canvasContext == null) return;
		const rectSize = 4;
		const halfRectSize = rectSize / 2;

		canvasContext.beginPath();
		canvasContext.moveTo(data.startX - rectSize, data.startY - rectSize);
		canvasContext.fillRect(
			data.startX - halfRectSize,
			data.startY - halfRectSize,
			rectSize,
			rectSize
		);
		canvasContext.stroke();

		drawText(canvasContext, text, data);

		if (data.endX && data.endY) {
			canvasContext.beginPath();
			canvasContext.moveTo(data.endX - rectSize, data.endY - rectSize);
			canvasContext.fillRect(
				data.endX - halfRectSize,
				data.endY - halfRectSize,
				rectSize,
				rectSize
			);
			canvasContext.stroke();
		}
	};

	const drawAcuteAngle = (
		canvasContext: CanvasRenderingContext2D | null,
		startPoint: DrawDetail,
		pivotPoint: DrawDetail,
		endPoint: DrawDetail
	) => {
		if (canvasContext) {
			canvasContext.beginPath();
			canvasContext.strokeStyle = "green";
			canvasContext.lineWidth = 2;
			canvasContext.moveTo(startPoint.startX, startPoint.startY);
			canvasContext.lineTo(pivotPoint.startX, pivotPoint.startY);
			canvasContext.lineTo(endPoint.startX, endPoint.startY);
			canvasContext.stroke();
		}
	};

	const clearCanvas = (
		canvasContext: CanvasRenderingContext2D | null,
		canvas: HTMLCanvasElement | null
	) => {
		if (!canvasContext || !canvas) return;
		const { width, height } = canvas;
		canvasContext.clearRect(0, 0, width, height);
	};

	const getDistanceBetweenPoint = (
		startX: number,
		startY: number,
		endX: number = 0,
		endY: number = 0
	) => {
		const x = (endX - startX) ** 2;
		const y = (endY - startY) ** 2;
		return Math.sqrt(x + y);
	};

	const getAngleFromPoints = (
		startPoint: DrawDetail,
		pivotPoint: DrawDetail,
		endPoint: DrawDetail
	): number => {
		const BA = [
			startPoint.startX - pivotPoint.startX,
			startPoint.startY - pivotPoint.startY,
		];
		const BC = [
			endPoint.startX - pivotPoint.startX,
			endPoint.startY - pivotPoint.startY,
		];

		const dotProduct = BA[0] * BC[0] + BA[1] * BC[1];
		const magnitudeBA = Math.sqrt(BA[0] ** 2 + BA[1] ** 2);
		const magnitudeBC = Math.sqrt(BC[0] ** 2 + BC[1] ** 2);

		const angleInRadians = Math.acos(dotProduct / (magnitudeBA * magnitudeBC));
		const angleInDegrees = angleInRadians * (180 / Math.PI);
		return angleInDegrees;
	};

	const generateNewPointWithExtent = (
		startX: number,
		startY: number,
		endX: number,
		endY: number,
		extentSize: number
	): Point => {
		const dx = endX - startX;
		const dy = endY - startY;
		const length = getDistanceBetweenPoint(startX, startY, endX, endY);

		const unitX = dx / length;
		const unitY = dy / length;

		const newX = endX + unitX * extentSize;
		const newY = endY + unitY * extentSize;
		return { x: newX, y: newY };
	};

	const getLineIntersection = (
		line1Start: Point,
		line1End: Point,
		line2Start: Point,
		line2End: Point
	): Point | null => {
		const { x: x1, y: y1 } = line1Start;
		const { x: x2, y: y2 } = line1End;
		const { x: x3, y: y3 } = line2Start;
		const { x: x4, y: y4 } = line2End;

		const denominator = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
		if (denominator === 0) {
			return null;
		}

		const intersectX =
			((x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4)) /
			denominator;
		const intersectY =
			((x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4)) /
			denominator;

		return { x: intersectX, y: intersectY };
	};

	const getDistancePointToLine = (
		point: Point,
		lineStart: Point,
		lineEnd: Point
	) => {
		const numerator = Math.abs(
			(lineEnd.y - lineStart.y) * point.x -
			(lineEnd.x - lineStart.x) * point.y +
			lineEnd.x * lineStart.y -
			lineEnd.y * lineStart.x
		);
		const denominator = Math.sqrt(
			Math.pow(lineEnd.y - lineStart.y, 2) +
			Math.pow(lineEnd.x - lineStart.x, 2)
		);
		return numerator / denominator;
	};

	const getPerpendicularPoint = (
		point: Point,
		lineStart: Point,
		lineEnd: Point
	) => {
		const m = (lineEnd.y - lineStart.y) / (lineEnd.x - lineStart.x);
		const mPerpendicular = -1 / m;
		const b = lineStart.y - m * lineStart.x;
		const bPerpendicular = point.y - mPerpendicular * point.x;
		const xIntersection = (bPerpendicular - b) / (m - mPerpendicular);
		const yIntersection = m * xIntersection + b;

		return { x: xIntersection, y: yIntersection };
	};

	return {
		drawHorizontalLine,
		drawLine,
		drawRectangle,
		drawAcuteAngle,
		clearCanvas,
		getAngleFromPoints,
		getDistanceBetweenPoint,
		generateNewPointWithExtent,
		getLineIntersection,
		getDistancePointToLine,
		getPerpendicularPoint,
	};
};
