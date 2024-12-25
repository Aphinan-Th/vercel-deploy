"use client";

import React, { useEffect, useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import SectionWrapper from "@/components/section-wrapper";
import Link from "next/link";
import * as fabric from "fabric";
import { FabricImage } from "fabric";
import { FabricJSCanvas, useFabricJSEditor } from "fabricjs-react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export default function ComparePage() {
	const [imageBefore, setImageBefore] = useState<File | null>(null);
	const [imageAfter, setImageAfter] = useState<File | null>(null);
	const { editor, onReady } = useFabricJSEditor();
	const imageBeforeRef = useRef<HTMLInputElement>(null);
	const imageAfterRef = useRef<HTMLInputElement>(null);

	const handleImageChange = (
		e: React.ChangeEvent<HTMLInputElement>,
		setImage: React.Dispatch<React.SetStateAction<File | null>>
	) => {
		const file = e.target.files?.[0];
		if (file) {
			setImage(file);
		}
	};

	useEffect(() => {
		const addImageToCanvas = (file: File | null, customType: string) => {
			if (!file) return;

			const url = URL.createObjectURL(file);

			FabricImage.fromURL(url, { crossOrigin: "anonymous" })
				.then((img: fabric.Image) => {
					const existingImage = editor?.canvas
						.getObjects()
						.find((obj) => obj instanceof FabricImage && obj.get("customType") === customType);

					if (existingImage) {
						editor?.canvas.remove(existingImage);
					}
					img.set({ customType: "imageBefore" });
					editor?.canvas.add(img.set({ left: 0, top: 0, scaleY: 0.5, scaleX: 0.5, opacity: 0.5 }));
					editor?.canvas.centerObject(img);
					editor?.canvas.setActiveObject(img);
				})
				.finally(() => URL.revokeObjectURL(url));
		};

		if (imageBefore) addImageToCanvas(imageBefore, "imageBefore");
	}, [imageBefore, editor]);

	useEffect(() => {
		const addImageToCanvas = (file: File | null, customType: string) => {
			if (!file) return;

			const url = URL.createObjectURL(file);

			FabricImage.fromURL(url, { crossOrigin: "anonymous" })
				.then((img: fabric.Image) => {
					const existingImage = editor?.canvas
						.getObjects()
						.find((obj) => obj instanceof fabric.Image && obj.get("customType") === customType);

					if (existingImage) {
						editor?.canvas.remove(existingImage);
					}
					img.set({ customType: "imageAfter" });
					editor?.canvas.add(img.set({ left: 0, top: 0, scaleY: 0.5, scaleX: 0.5, opacity: 0.5 }));
					editor?.canvas.centerObject(img);
					editor?.canvas.setActiveObject(img);
				})
				.finally(() => URL.revokeObjectURL(url));
		};

		if (imageAfter) addImageToCanvas(imageAfter, "imageAfter");
	}, [imageAfter, editor]);

	const onRemoveImage = () => {
		const activeObject = editor?.canvas.getActiveObject();

		if (!(activeObject instanceof FabricImage)) return;

		const customType = activeObject.get("customType");

		const resetImage = (
			setImage: React.Dispatch<React.SetStateAction<File | null>>,
			ref: React.RefObject<HTMLInputElement>
		) => {
			setImage(null);
			if (ref.current) ref.current.value = "";
		};

		switch (customType) {
			case "imageBefore":
				resetImage(setImageBefore, imageBeforeRef);
				break;
			case "imageAfter":
				resetImage(setImageAfter, imageAfterRef);
				break;
			default:
				break;
		}

		editor?.canvas.remove(activeObject);
	};

	return (
		<div className="min-h-screen">
			<nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b">
				<div className="container mx-auto px-4 md:px-6">
					<div className="flex items-center justify-between h-16">
						<Link className="text-xl font-bold " href="/">
							CephaloMetric
						</Link>
					</div>
				</div>
			</nav>
			<SectionWrapper className="relative overflow-hidden bg-gradient-to-b from-white to-gray-50">
				<div className="w-full h-full bg-white rounded-lg shadow-lg p-8">
					<h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500 text-center leading-tight w-fit">
						Compare Your Images
					</h1>
					<div className="hidden md:flex items-center justify-end space-x-8">
						<Button
							variant="ghost"
							onClick={() => {
								onRemoveImage();
							}}
							className="group text-gray-600 hover:text-gray-900"
						>
							Remove Image
							<Trash2 className="ml-2 h-4 w-4" />
						</Button>
					</div>
					<div className="border-t border-gray-300"></div>
					<div className="flex justify-between gap-8 mb-8 mt-8">
						<div className="w-full">
							<label className="block text-sm font-medium text-gray-700 mb-2">Upload Image Before</label>
							<Input
								ref={imageBeforeRef}
								type="file"
								onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
									handleImageChange(e, setImageBefore)
								}
								className="file:border-gray-300 file:bg-gray-50 file:text-gray-700"
							/>
						</div>
						<div className="w-full">
							<label className="block text-sm font-medium text-gray-700 mb-2">Upload Image After</label>
							<Input
								ref={imageAfterRef}
								type="file"
								onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
									handleImageChange(e, setImageAfter)
								}
								className="file:border-gray-300 file:bg-gray-50 file:text-gray-700"
							/>
						</div>
					</div>
					<div className="flex justify-center">
						{imageBefore || imageAfter ? (
							<FabricJSCanvas className="flex w-[1200px] h-[1200px]" onReady={onReady} />
						) : (
							<p className="w-[1200px] h-[1200px] text-center text-gray-500">
								Upload two images to compare them.
							</p>
						)}
					</div>
				</div>
			</SectionWrapper>
		</div>
	);
}
