import React, { useState } from 'react';
import { Point, Box, SegmentationMode } from '../types';
import { useSegmentationModel } from '../hooks/useSegmentationModel';
import Canvas from './Canvas';

interface Props {
  image: string;
  mode: SegmentationMode;
}

const ImageSegmenter: React.FC<Props> = ({ image, mode }) => {
  const { model, isLoading: isModelLoading, error: modelError } = useSegmentationModel();
  const [points, setPoints] = useState<Point[]>([]);
  const [box, setBox] = useState<Box | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [loading, setLoading] = useState(false);

  const handlePoint = (point: Point) => {
    setPoints(prev => [...prev, point]);
  };

  const handleBoxStart = (point: Point) => {
    setIsDrawing(true);
    setBox({ startX: point.x, startY: point.y, endX: point.x, endY: point.y });
  };

  const handleBoxMove = (point: Point) => {
    if (!isDrawing) return;
    setBox(prev => prev ? { ...prev, endX: point.x, endY: point.y } : null);
  };

  const handleBoxEnd = () => {
    setIsDrawing(false);
  };

  const handleSegment = async () => {
    if (!model) return;
    
    setLoading(true);
    try {
      const canvas = document.querySelector('canvas');
      if (!canvas) return;

      const segmentation = await model.segmentPeople(canvas);
      const ctx = canvas.getContext('2d');
      
      if (ctx && segmentation.length > 0) {
        const mask = segmentation[0].mask;
        const maskCanvas = document.createElement('canvas');
        maskCanvas.width = mask.width;
        maskCanvas.height = mask.height;
        const maskCtx = maskCanvas.getContext('2d');
        
        if (maskCtx) {
          const imageData = maskCtx.createImageData(mask.width, mask.height);
          const data = imageData.data;
          
          for (let i = 0; i < mask.data.length; i++) {
            const j = i * 4;
            data[j] = 255;     // R
            data[j + 1] = 0;   // G
            data[j + 2] = 0;   // B
            data[j + 3] = mask.data[i] * 255; // A
          }
          
          maskCtx.putImageData(imageData, 0, 0);
          ctx.drawImage(maskCanvas, 0, 0);
        }
      }
    } catch (error) {
      console.error('Segmentation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  if (modelError) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600">Failed to load segmentation model: {modelError}</p>
      </div>
    );
  }

  return (
    <div className="relative border rounded-lg overflow-hidden shadow-lg">
      <Canvas
        image={image}
        points={points}
        box={box}
        mode={mode}
        onPoint={handlePoint}
        onBoxStart={handleBoxStart}
        onBoxMove={handleBoxMove}
        onBoxEnd={handleBoxEnd}
      />
      <div className="absolute top-4 right-4 space-x-2">
        <button
          onClick={() => {
            setPoints([]);
            setBox(null);
          }}
          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 disabled:opacity-50"
          disabled={loading || isModelLoading}
        >
          Clear
        </button>
        <button
          onClick={handleSegment}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50"
          disabled={loading || isModelLoading}
        >
          {loading ? 'Processing...' : isModelLoading ? 'Loading model...' : 'Submit'}
        </button>
      </div>
    </div>
  );
};

export default ImageSegmenter;