export type ModelType = 'tensorflow' | 'deepface';

export interface EmotionResponse {
  emotion: string;
  confidence: number | null;
  all_predictions?: Record<string, number>;
}