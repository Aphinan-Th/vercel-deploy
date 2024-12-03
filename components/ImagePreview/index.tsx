import React from "react";
import Image from "next/image";

interface ImagePreviewProps {
	image: File;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ image }) => {
	return (
		<div className="mt-4">
			<p className="text-sm text-gray-600">Preview</p>
			<div className="mt-2 w-full h-48 bg-gray-100 flex items-center justify-center rounded-lg overflow-hidden">
				<Image
					src={URL.createObjectURL(image)}
					alt="Image"
					width={500}
					height={500}
					className="w-full h-full object-cover"
				/>
			</div>
		</div>
	);
};

export default ImagePreview;
