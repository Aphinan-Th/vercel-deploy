import React from "react";
import { TrashIcon } from "@/public/assets/icons/trashIcon";
import { RotateLeftIcon } from "@/public/assets/icons/rotateLeftIcon";
import { RotateRightIcon } from "@/public/assets/icons/rotateRightIcon";
import { CleanIcon } from "@/public/assets/icons/cleanIcon";
import { UndoIcon } from "@/public/assets/icons/undoIcon";

interface ActionButtonsProps {
	clearAll: () => void;
	clearCanvas: () => void;
	rotateImageUp: () => void;
	rotateImageDown: () => void;
	prevStep: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
	clearAll,
	clearCanvas,
	rotateImageUp,
	rotateImageDown,
	prevStep,
}) => {
	return (
		<div className="flex gap-1">
			<div
				onClick={clearAll}
				className="rounded-lg border hover:bg-blue-200 hover:border-blue-400 transition p-1 cursor-pointer"
			>
				<TrashIcon width="24" height="24" />
			</div>
			<div
				onClick={clearCanvas}
				className="rounded-lg border hover:bg-blue-200 hover:border-blue-400 transition p-1 cursor-pointer"
			>
				<CleanIcon width="24" height="24" />
			</div>
			<div
				onClick={rotateImageDown}
				className="rounded-lg border hover:bg-blue-200 hover:border-blue-400 transition p-1 cursor-pointer"
			>
				<RotateLeftIcon width="24" height="24" />
			</div>
			<div
				onClick={rotateImageUp}
				className="rounded-lg border hover:bg-blue-200 hover:border-blue-400 transition p-1 cursor-pointer"
			>
				<RotateRightIcon width="24" height="24" />
			</div>
			<div
				onClick={prevStep}
				className="flex rounded-lg border hover:bg-blue-200 hover:border-blue-400 transition p-1 gap-1 cursor-pointer text-gray-700"
			>
				<UndoIcon width="24" height="24" /> Undo
			</div>
		</div>
	);
};

export default ActionButtons;
