import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import ImageSegmenter from './components/ImageSegmenter';
import SegmentationControls from './components/SegmentationControls';

type SegmentationMode = 'point' | 'box' | 'mixed' | 'full';

export default function App() {
  const [image, setImage] = useState<string | null>(null);
  const [mode, setMode] = useState<SegmentationMode>('point');

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg']
    },
    multiple: false
  });

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">AI Image Segmentation</h1>
        
        <SegmentationControls mode={mode} onModeChange={setMode} />

        {!image ? (
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
              isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-500'
            }`}
          >
            <input {...getInputProps()} />
            <p className="text-gray-600">
              {isDragActive ? 'Drop the image here' : 'Drag and drop an image here, or click to select one'}
            </p>
          </div>
        ) : (
          <ImageSegmenter image={image} mode={mode} />
        )}
      </div>
    </div>
  );
}