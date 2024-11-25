import { DrawType, PointName } from "@/components/canvas/enum";

export type Step = {
	title: string;
	description: string;
	pointName: PointName;
	type: DrawType;
	isCompleted: boolean;
};
