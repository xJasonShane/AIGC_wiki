"use client";

import { useState } from "react";
import Image from "next/image";

interface Card {
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
  loras: { name: string; weight: number }[];
  createdAt: Date;
}

interface CardModalProps {
  card: Card;
  children: React.ReactNode;
}

export default function CardModal({ card, children }: CardModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div onClick={() => setIsOpen(true)}>{children}</div>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="bg-dark-100 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-white/10 modal-enter"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-end p-4">
              <button
                onClick={() => setIsOpen(false)}
                className="w-10 h-10 flex items-center justify-center bg-black/50 hover:bg-primary rounded-full transition-colors text-xl"
              >
                ×
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-0">
              <div className="relative bg-dark flex items-center justify-center min-h-[300px]">
                {card.fullImage || card.thumbnail ? (
                  <Image
                    src={card.fullImage || card.thumbnail!}
                    alt={card.title}
                    width={600}
                    height={800}
                    className="max-h-[70vh] w-auto object-contain"
                  />
                ) : (
                  <div className="text-gray-600">暂无图片</div>
                )}
              </div>

              <div className="p-6 overflow-y-auto max-h-[70vh]">
                <h2 className="font-display text-2xl font-semibold mb-1">{card.title}</h2>
                <p className="text-gray-500 text-sm mb-6">
                  {new Date(card.createdAt).toLocaleDateString("zh-CN")}
                </p>

                <div className="space-y-6">
                  <section>
                    <h3 className="text-cyan-400 text-sm font-medium uppercase tracking-wide mb-3 pb-2 border-b border-white/10">
                      模型信息
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-dark-200 p-3 rounded-lg">
                        <span className="text-gray-500 text-xs block mb-1">模型名称</span>
                        <span className="text-sm">{card.modelName || "-"}</span>
                      </div>
                      <div className="bg-dark-200 p-3 rounded-lg">
                        <span className="text-gray-500 text-xs block mb-1">模型类型</span>
                        <span className="text-sm">{card.modelType || "-"}</span>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-cyan-400 text-sm font-medium uppercase tracking-wide mb-3 pb-2 border-b border-white/10">
                      生成参数
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-dark-200 p-3 rounded-lg">
                        <span className="text-gray-500 text-xs block mb-1">采样方法</span>
                        <span className="text-sm">{card.sampler || "-"}</span>
                      </div>
                      <div className="bg-dark-200 p-3 rounded-lg">
                        <span className="text-gray-500 text-xs block mb-1">CFG Scale</span>
                        <span className="text-sm">{card.cfg ?? "-"}</span>
                      </div>
                      <div className="bg-dark-200 p-3 rounded-lg">
                        <span className="text-gray-500 text-xs block mb-1">Steps</span>
                        <span className="text-sm">{card.steps ?? "-"}</span>
                      </div>
                      <div className="bg-dark-200 p-3 rounded-lg">
                        <span className="text-gray-500 text-xs block mb-1">尺寸</span>
                        <span className="text-sm">{card.size || "-"}</span>
                      </div>
                      <div className="bg-dark-200 p-3 rounded-lg">
                        <span className="text-gray-500 text-xs block mb-1">VAE</span>
                        <span className="text-sm">{card.vae || "-"}</span>
                      </div>
                      <div className="bg-dark-200 p-3 rounded-lg">
                        <span className="text-gray-500 text-xs block mb-1">放大算法</span>
                        <span className="text-sm">{card.upscaler || "-"}</span>
                      </div>
                      <div className="bg-dark-200 p-3 rounded-lg col-span-2">
                        <span className="text-gray-500 text-xs block mb-1">Seed</span>
                        <span className="text-sm font-mono text-primary">{card.seed || "-"}</span>
                      </div>
                    </div>
                  </section>

                  {card.loras.length > 0 && (
                    <section>
                      <h3 className="text-cyan-400 text-sm font-medium uppercase tracking-wide mb-3 pb-2 border-b border-white/10">
                        LoRA模型
                      </h3>
                      <div className="space-y-2">
                        {card.loras.map((lora, idx) => (
                          <div key={idx} className="flex justify-between items-center bg-dark-200 p-3 rounded-lg">
                            <span className="text-sm">{lora.name}</span>
                            <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded font-mono">
                              {lora.weight}
                            </span>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  <section>
                    <h3 className="text-cyan-400 text-sm font-medium uppercase tracking-wide mb-3 pb-2 border-b border-white/10">
                      提示词
                    </h3>
                    <div className="bg-dark-200 p-4 rounded-lg mb-3">
                      <span className="text-gray-500 text-xs uppercase tracking-wide block mb-2">Positive</span>
                      <p className="text-sm text-gray-300 leading-relaxed break-words">
                        {card.prompt || "-"}
                      </p>
                    </div>
                    <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-lg">
                      <span className="text-red-400 text-xs uppercase tracking-wide block mb-2">Negative</span>
                      <p className="text-sm text-gray-300 leading-relaxed break-words">
                        {card.negativePrompt || "-"}
                      </p>
                    </div>
                  </section>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
