export interface Point {
  x: number;
  y: number;
}

export interface Box {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

export type SegmentationMode = 'point' | 'box' | 'mixed' | 'full';