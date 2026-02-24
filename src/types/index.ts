export interface Card {
  id: string;
  title: string;
  thumbnail: string | null;
  fullImage: string | null;
  modelName: string | null;
  modelType: string | null;
  sampler: string | null;
  cfg: number | null;
  steps: number | null;
  vae: string | null;
  upscaler: string | null;
  seed: string | null;
  size: string | null;
  prompt: string | null;
  negativePrompt: string | null;
  createdAt: Date;
  updatedAt: Date;
  loras: Lora[];
}

export interface Lora {
  id: string;
  cardId: string;
  name: string;
  weight: number;
}

export interface CardFormData {
  title: string;
  thumbnail?: string;
  fullImage?: string;
  modelName?: string;
  modelType?: string;
  sampler?: string;
  cfg?: number;
  steps?: number;
  vae?: string;
  upscaler?: string;
  seed?: string;
  size?: string;
  prompt?: string;
  negativePrompt?: string;
  loras?: { name: string; weight: number }[];
}

export interface Admin {
  id: string;
  username: string;
}
