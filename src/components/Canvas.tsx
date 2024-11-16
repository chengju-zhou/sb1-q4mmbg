import React, { useRef, useEffect } from 'react';
import { Point, Box } from '../types';

interface Props {
  image: string;
  points: Point[];
  box: Box | null;
  mode: 'point' | 'box' | 'mixed' | 'full';
  onPoint: (point: Point) => void;
  onBoxStart: (point: Point) => void;
  onBoxMove: (point: Point) => void;
  onBoxEnd: () => void;
}

const Canvas: React.FC<Props> = ({
  image,
  points,
  box,
  mode,
  onPoint,
  onBoxStart,
  onBoxMove,
  onBoxEnd,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.src = image;
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      drawAnnotations();
    };
  }, [image]);

  const drawAnnotations = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear and redraw image
    const img = new Image();
    img.src = image;
    ctx.drawImage(img, 0, 0);

    // Draw points
    points.forEach(point => {
      ctx.beginPath();
      ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI);
      ctx.fillStyle = '#3B82F6';
      ctx.fill();
    });

    // Draw box
    if (box) {
      ctx.beginPath();
      ctx.strokeStyle = '#3B82F6';
      ctx.lineWidth = 2;
      ctx.rect(
        box.startX,
        box.startY,
        box.endX - box.startX,
        box.endY - box.startY
      );
      ctx.stroke();
    }
  };

  const getCanvasPoint = (e: React.MouseEvent<HTMLCanvasElement>): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (mode !== 'point' && mode !== 'mixed') return;
    onPoint(getCanvasPoint(e));
    drawAnnotations();
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (mode !== 'box' && mode !== 'mixed') return;
    onBoxStart(getCanvasPoint(e));
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    onBoxMove(getCanvasPoint(e));
    drawAnnotations();
  };

  return (
    <canvas
      ref={canvasRef}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={onBoxEnd}
      onMouseLeave={onBoxEnd}
      className="max-w-full h-auto cursor-crosshair"
    />
  );
};

export default Canvas;