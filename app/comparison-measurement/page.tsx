"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CirclePlus, Trash2, Eye, EyeOff } from "lucide-react";
import { CephalometricResult, Measurement } from "../diagnosis/type";
import {
	defaultMeasurement,
	dentureFrameData,
	dentureFrameHeaders,
	labialData,
	labialHeaders,
	measurementCompareHeaders,
	measurementData,
	skeletalData,
	skeletalHeaders,
	surgicalHeaders,
	surgicalTendencyData,
	toothData,
	toothHeaders,
} from "./masterData";

export default function CompareMeasurementPage() {
	const [inputFields, setInputFields] = useState<Measurement[]>([defaultMeasurement]);
	const [isUpdatedResult, setIsUpdatedResult] = useState<boolean>(false);
	const [isHidden, setIsHidden] = useState<boolean>(false);

	const handleValueChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (!file) {
			return;
		}

		const reader = new FileReader();
		reader.onload = (e: ProgressEvent<FileReader>) => {
			const result = e.target?.result as string;
			const obj: CephalometricResult = JSON.parse(result);
			insertMeasurement(index, obj);
		};
		reader.readAsText(file);
	};

	const insertMeasurement = (index: number, obj: CephalometricResult) => {
		const values = [...inputFields];
		values[index] = obj.measurement;
		setInputFields(values);
		setIsUpdatedResult(false);
	};

	const handleAddFields = () => {
		setInputFields([...inputFields, defaultMeasurement]);
	};

	const handleRemoveFields = (index: number) => {
		const newFields = [...inputFields];
		newFields.splice(index, 1);
		setInputFields(newFields);
		setIsUpdatedResult(false);
	};

	const executeResult = () => {
		setIsUpdatedResult(true);
	};

	const hiddenToggle = () => setIsHidden(!isHidden);

	return (
		<div className="min-h-screen">
			<Navbar onClick={() => hiddenToggle()} value={isHidden} />
			<div className={`container px-4 md:px-6 mx-auto ${isHidden ? "py-12" : "py-24"}`}>
				<div className={`w-full h-full bg-white ${isHidden ? "hidden" : "grid"}`}>
					<h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500 text-center leading-tight w-fit">
						Compare Your Data
					</h1>
					<p className="text-start text-gray-500 mt-2 mb-2">
						Upload the file of the record you want to compare.
					</p>
					<div className="border-t border-gray-300 mb-4"></div>
					<SelectorFileSection
						inputFields={inputFields}
						handleValueChange={handleValueChange}
						handleRemoveFields={handleRemoveFields}
					/>
					{inputFields.length < 4 && (
						<Button
							variant="ghost"
							className="group text-gray-600 bg-gray-200 hover:bg-gray-400 hover:text-white mb-2"
							onClick={handleAddFields}
						>
							Add Data
							<CirclePlus className="ml-2 h-4 w-4" />
						</Button>
					)}
					<Button className="group relative z-20 bg-blue-600 hover:bg-blue-700" onClick={executeResult}>
						Start comparison data
					</Button>
				</div>
				<TableSection inputFields={inputFields} isUpdatedResult={isUpdatedResult} />
			</div>
		</div>
	);
}

const Navbar = ({ onClick, value }: { onClick: () => void; value: boolean }) => {
	return (
		<nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b">
			<div className="container mx-auto px-4 md:px-6">
				<div className="flex items-center justify-between h-16">
					<Link className="text-xl font-bold " href="/">
						CephaloMetric
					</Link>
					<Button variant="ghost" onClick={onClick} className="text-gray-600 hover:text-gray-900 gap-1">
						{value ? <EyeOff /> : <Eye />}
						{value ? "Show only table" : "Show all"}
					</Button>
				</div>
			</div>
		</nav>
	);
};

const SelectorFileSection = ({
	inputFields,
	handleValueChange,
	handleRemoveFields,
}: {
	inputFields: Measurement[];
	handleValueChange: (index: number, event: React.ChangeEvent<HTMLInputElement>) => void;
	handleRemoveFields: (index: number) => void;
}) => {
	return inputFields.map((_, index) => (
		<div className="w-full mt-2 mb-2" key={index}>
			<label className="block text-sm font-medium text-gray-700 mb-2">Upload Measurement No. {index}</label>
			<div className="flex gap-2 ">
				<div className="grow">
					<Input
						type="file"
						className="file:border-gray-300 file:bg-gray-50 file:text-gray-700"
						onChange={(e) => handleValueChange(index, e)}
					/>
				</div>
				<div className="flex-none">
					<Button
						variant="ghost"
						className="group text-white hover:text-gray-900 bg-red-500 hover:bg-red-600"
						onClick={() => handleRemoveFields(index)}
					>
						Remove File
						<Trash2 className="ml-2 h-4 w-4" />
					</Button>
				</div>
			</div>
		</div>
	));
};

const TableSection = ({ inputFields, isUpdatedResult }: { inputFields: Measurement[]; isUpdatedResult: boolean }) => {
	const renderTableRow = (row: (string | null)[], rowIndex: number, textColor: string) => (
		<tr key={rowIndex} className="bg-white border-b border-t">
			{row.map((cell, cellIndex) => (
				<td key={cellIndex} className={`px-3 whitespace-nowrap ${textColor}`}>
					{cell}
				</td>
			))}
		</tr>
	);

	const renderTable = (headers: string[], data: (string | null)[][], headerColor: string, textColor: string) => (
		<>
			<tr className={headerColor}>
				{headers.map((header, index) => (
					<th key={index} className="px-3 text-nowrap font-semibold text-start">
						{header}
					</th>
				))}
			</tr>
			{data.map((e, i) => renderTableRow(e, i, textColor))}
		</>
	);

	return (
		isUpdatedResult && (
			<div>
				<table className="w-full mt-8">
					<thead>
						<tr className="bg-gray-200">
							<th className="px-3 text-nowrap font-semibold"></th>
							<th className="px-3 text-nowrap font-semibold">Age (16)</th>
							<th className="px-3 text-nowrap font-semibold">Deviation</th>
							<th className="px-3 text-nowrap font-semibold">Begin</th>
							<th className="px-3 text-nowrap font-semibold">
								2<sup>nd</sup>
							</th>
							<th className="px-3 text-nowrap font-semibold">
								3<sup>rd</sup>
							</th>
							<th className="px-3 text-nowrap font-semibold">Final</th>
							<th className="px-3 text-nowrap font-semibold">Interpretation</th>
						</tr>
					</thead>
					<tbody>
						{renderTable(
							measurementCompareHeaders,
							measurementData(inputFields),
							"bg-red-200",
							"text-red-500"
						)}
						{renderTable(skeletalHeaders, skeletalData(inputFields), "bg-blue-200", "text-blue-500")}
						{renderTable(toothHeaders, toothData(inputFields), "bg-green-200", "text-green-500")}
						{renderTable(labialHeaders, labialData(inputFields), "bg-orange-200", "text-orange-500")}
						{renderTable(
							surgicalHeaders,
							surgicalTendencyData(inputFields),
							"bg-purple-200",
							"text-purple-500"
						)}
						{renderTable(
							dentureFrameHeaders,
							dentureFrameData(inputFields),
							"bg-indigo-200",
							"text-indigo-500"
						)}
					</tbody>
				</table>
			</div>
		)
	);
};
