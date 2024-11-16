import { useState, useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';
import * as bodySegmentation from '@tensorflow-models/body-segmentation';
import { SupportedModels } from '@tensorflow-models/body-segmentation';

export function useSegmentationModel() {
  const [model, setModel] = useState<bodySegmentation.BodySegmenter | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadModel = async () => {
      try {
        await tf.setBackend('webgl');
        const segmenterConfig = {
          modelType: 'general',
          enableSmoothing: true,
          enableSegmentation: true
        };
        const loadedModel = await bodySegmentation.createSegmenter(
          SupportedModels.MediaPipeSelfieSegmentation,
          segmenterConfig
        );
        setModel(loadedModel);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load model');
      } finally {
        setIsLoading(false);
      }
    };

    loadModel();
  }, []);

  return { model, isLoading, error };
}