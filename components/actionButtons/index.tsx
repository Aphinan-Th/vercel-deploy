import React from "react";
import { Button } from "../ui/button";

import { Save, Undo2, RotateCcw, RotateCw, Eraser, Trash2 } from "lucide-react";

interface ActionButtonsProps {
	clearAll: () => void;
	clearCanvas: () => void;
	rotateImageUp: () => void;
	rotateImageDown: () => void;
	prevStep: () => void;
	saveResult: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
	clearAll,
	clearCanvas,
	rotateImageUp,
	rotateImageDown,
	prevStep,
	saveResult,
}) => {
	return (
		<div className="flex gap-1">
			<Button variant="ghost" onClick={clearAll} className="text-gray-600 hover:text-gray-900 gap-1">
				<Trash2 width="24" height="24" /> Remove Image
			</Button>
			<Button variant="ghost" onClick={clearCanvas} className="text-gray-600 hover:text-gray-900 gap-1">
				<Eraser width="24" height="24" /> Clean Canvas
			</Button>
			<Button variant="ghost" onClick={rotateImageDown} className="text-gray-600 hover:text-gray-900 gap-1">
				<RotateCcw width="24" height="24" /> Rotate Left
			</Button>
			<Button variant="ghost" onClick={rotateImageUp} className="text-gray-600 hover:text-gray-900 gap-1">
				<RotateCw width="24" height="24" /> Rotate Right
			</Button>
			<Button variant="ghost" onClick={prevStep} className="text-gray-600 hover:text-gray-900 gap-1">
				<Undo2 width="24" height="24" /> Undo
			</Button>
			<Button variant="ghost" onClick={saveResult} className="text-gray-600 hover:text-gray-900 gap-1">
				<Save width="24" height="24" /> Save
			</Button>
		</div>
	);
};

export default ActionButtons;
