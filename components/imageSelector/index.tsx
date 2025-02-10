"use client"

import { useRef, useState } from "react"

interface ImageSelectorProps {
    onImageDataChange: (file: File, width: number, height: number) => void;
}

const ImageSelector: React.FC<ImageSelectorProps> = ({ onImageDataChange: onImageData }) => {
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleSectionClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) {
            setError("No file selected. Please choose an image.");
            return;
        }
        const render = new FileReader()
        render.onload = function (e: ProgressEvent<FileReader>) {
            const img = new Image()
            img.src = e.target?.result as string;

            img.onload = function () {
                const width = img.width;
                const height = img.height;
                setError(null);
                onImageData(file, width, height)
            };
        }
        render.readAsDataURL(file);
    };

    return (
        <div className="w-[600px] h-[600px] flex items-center justify-center bg-blue-50 flex-col" onClick={handleSectionClick}>
            <h2 className="text-gray-400">Drop your x-ray image</h2>
            <input
                accept="image/*"
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: 'none' }}
            />
            {error && (
                <h3 style={{ color: 'red' }}>Please select image file</h3>
            )}
        </div>
    );
}

export default ImageSelector;