import React from 'react';

interface Props {
  mode: 'point' | 'box' | 'mixed' | 'full';
  onModeChange: (mode: 'point' | 'box' | 'mixed' | 'full') => void;
}

const SegmentationControls: React.FC<Props> = ({ mode, onModeChange }) => {
  const modes = [
    { id: 'point', label: 'Point segmentation mode' },
    { id: 'box', label: 'Box segmentation mode' },
    { id: 'mixed', label: 'Mixed point and box segmentation mode' },
    { id: 'full', label: 'Full image automatic segmentation mode' },
  ] as const;

  return (
    <div className="flex space-x-4 mb-6">
      {modes.map((m) => (
        <button
          key={m.id}
          onClick={() => onModeChange(m.id)}
          className={`px-4 py-2 rounded-md ${
            mode === m.id
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {m.label}
        </button>
      ))}
    </div>
  );
};

export default SegmentationControls;