"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

interface Card {
  id: string;
  title: string;
  thumbnail: string | null;
  modelName: string | null;
  modelType: string | null;
}

export default function AdminCardsPage() {
  const router = useRouter();
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCard, setEditingCard] = useState<string | null>(null);

  useEffect(() => {
    checkAuth();
    loadCards();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      if (!data.authenticated) {
        router.push("/login");
      }
    } catch {
      router.push("/login");
    }
  };

  const loadCards = async () => {
    try {
      const res = await fetch("/api/cards");
      const data = await res.json();
      setCards(data);
    } catch {
      console.error("Failed to load cards");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("确定要删除这张卡片吗？")) return;

    try {
      const res = await fetch(`/api/cards/${id}`, { method: "DELETE" });
      if (res.ok) {
        setCards(cards.filter((c) => c.id !== id));
      }
    } catch {
      alert("删除失败");
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingCard(null);
    loadCards();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-400">加载中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <header className="bg-dark-100 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 text-xl font-display font-bold">
            <span className="text-primary">✦</span>
            AIGC Wiki
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-gray-400 hover:text-white transition-colors">
              查看网站
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-display font-semibold">卡片管理</h1>
          <button
            onClick={() => setShowForm(true)}
            className="px-6 py-3 bg-primary hover:bg-primary-700 rounded-lg font-medium transition-colors"
          >
            新增卡片
          </button>
        </div>

        {cards.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <p className="text-lg mb-2">暂无卡片</p>
            <p className="text-sm">点击上方按钮添加第一张卡片</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {cards.map((card) => (
              <div
                key={card.id}
                className="bg-dark-200 rounded-xl overflow-hidden border border-white/10"
              >
                <div className="relative aspect-video bg-dark-100">
                  {card.thumbnail ? (
                    <Image
                      src={card.thumbnail}
                      alt={card.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-600">
                      暂无图片
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-medium truncate mb-3">{card.title}</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingCard(card.id)}
                      className="flex-1 py-2 bg-dark-100 hover:bg-dark-300 rounded-lg text-sm transition-colors"
                    >
                      编辑
                    </button>
                    <button
                      onClick={() => handleDelete(card.id)}
                      className="flex-1 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-sm transition-colors"
                    >
                      删除
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {(showForm || editingCard) && (
        <CardForm
          cardId={editingCard}
          onClose={() => {
            setShowForm(false);
            setEditingCard(null);
          }}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
}

interface CardFormProps {
  cardId: string | null;
  onClose: () => void;
  onSuccess: () => void;
}

function CardForm({ cardId, onClose, onSuccess }: CardFormProps) {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    thumbnail: "",
    fullImage: "",
    modelName: "",
    modelType: "",
    sampler: "",
    cfg: "",
    steps: "",
    vae: "",
    upscaler: "",
    seed: "",
    size: "",
    prompt: "",
    negativePrompt: "",
    loras: [] as { name: string; weight: string }[],
  });

  useEffect(() => {
    if (cardId) {
      loadCard();
    }
  }, [cardId]);

  const loadCard = async () => {
    try {
      const res = await fetch(`/api/cards/${cardId}`);
      const card = await res.json();
      setFormData({
        title: card.title || "",
        thumbnail: card.thumbnail || "",
        fullImage: card.fullImage || "",
        modelName: card.modelName || "",
        modelType: card.modelType || "",
        sampler: card.sampler || "",
        cfg: card.cfg?.toString() || "",
        steps: card.steps?.toString() || "",
        vae: card.vae || "",
        upscaler: card.upscaler || "",
        seed: card.seed || "",
        size: card.size || "",
        prompt: card.prompt || "",
        negativePrompt: card.negativePrompt || "",
        loras: card.loras?.map((l: { name: string; weight: number }) => ({
          name: l.name,
          weight: l.weight.toString(),
        })) || [],
      });
    } catch {
      console.error("Failed to load card");
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: "thumbnail" | "fullImage") => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);

      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();

      if (data.success) {
        setFormData((prev) => ({ ...prev, [field]: data.url }));
      }
    } catch {
      alert("上传失败");
    } finally {
      setUploading(false);
    }
  };

  const addLora = () => {
    setFormData((prev) => ({
      ...prev,
      loras: [...prev.loras, { name: "", weight: "0.8" }],
    }));
  };

  const removeLora = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      loras: prev.loras.filter((_, i) => i !== index),
    }));
  };

  const updateLora = (index: number, field: "name" | "weight", value: string) => {
    setFormData((prev) => ({
      ...prev,
      loras: prev.loras.map((lora, i) =>
        i === index ? { ...lora, [field]: value } : lora
      ),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = cardId ? `/api/cards/${cardId}` : "/api/cards";
      const method = cardId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          cfg: formData.cfg ? parseFloat(formData.cfg) : null,
          steps: formData.steps ? parseInt(formData.steps) : null,
          loras: formData.loras.filter((l) => l.name.trim()),
        }),
      });

      if (res.ok) {
        onSuccess();
      } else {
        const data = await res.json();
        alert(data.error || "保存失败");
      }
    } catch {
      alert("网络错误");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-dark-100 rounded-2xl w-full max-w-3xl my-8 border border-white/10 modal-enter">
        <div className="flex justify-between items-center p-6 border-b border-white/10">
          <h2 className="text-xl font-semibold">{cardId ? "编辑卡片" : "新增卡片"}</h2>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center hover:bg-dark-200 rounded-full transition-colors text-xl"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-gray-400 mb-2">标题 *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 bg-dark-200 border border-white/10 rounded-lg focus:outline-none focus:border-primary"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">尺寸</label>
              <input
                type="text"
                value={formData.size}
                onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                placeholder="如: 512x768"
                className="w-full px-4 py-3 bg-dark-200 border border-white/10 rounded-lg focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-gray-400 mb-2">缩略图</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.thumbnail}
                  onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                  placeholder="/images/xxx.jpg"
                  className="flex-1 px-4 py-3 bg-dark-200 border border-white/10 rounded-lg focus:outline-none focus:border-primary"
                />
                <label className="px-4 py-3 bg-dark-200 hover:bg-dark-300 border border-white/10 rounded-lg cursor-pointer transition-colors">
                  {uploading ? "上传中..." : "上传"}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleUpload(e, "thumbnail")}
                  />
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">原图</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.fullImage}
                  onChange={(e) => setFormData({ ...formData, fullImage: e.target.value })}
                  placeholder="/images/xxx.jpg"
                  className="flex-1 px-4 py-3 bg-dark-200 border border-white/10 rounded-lg focus:outline-none focus:border-primary"
                />
                <label className="px-4 py-3 bg-dark-200 hover:bg-dark-300 border border-white/10 rounded-lg cursor-pointer transition-colors">
                  上传
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleUpload(e, "fullImage")}
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-gray-400 mb-2">模型名称</label>
              <input
                type="text"
                value={formData.modelName}
                onChange={(e) => setFormData({ ...formData, modelName: e.target.value })}
                className="w-full px-4 py-3 bg-dark-200 border border-white/10 rounded-lg focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">模型类型</label>
              <select
                value={formData.modelType}
                onChange={(e) => setFormData({ ...formData, modelType: e.target.value })}
                className="w-full px-4 py-3 bg-dark-200 border border-white/10 rounded-lg focus:outline-none focus:border-primary"
              >
                <option value="">请选择</option>
                <option value="SD 1.5">SD 1.5</option>
                <option value="SD 2.1">SD 2.1</option>
                <option value="SDXL">SDXL</option>
                <option value="SD3">SD3</option>
                <option value="Flux">Flux</option>
                <option value="其他">其他</option>
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm text-gray-400 mb-2">采样方法</label>
              <select
                value={formData.sampler}
                onChange={(e) => setFormData({ ...formData, sampler: e.target.value })}
                className="w-full px-4 py-3 bg-dark-200 border border-white/10 rounded-lg focus:outline-none focus:border-primary"
              >
                <option value="">请选择</option>
                <option value="Euler a">Euler a</option>
                <option value="Euler">Euler</option>
                <option value="DPM++ 2M Karras">DPM++ 2M Karras</option>
                <option value="DPM++ SDE Karras">DPM++ SDE Karras</option>
                <option value="DPM++ 2M SDE Karras">DPM++ 2M SDE Karras</option>
                <option value="DDIM">DDIM</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">CFG Scale</label>
              <input
                type="number"
                step="0.5"
                value={formData.cfg}
                onChange={(e) => setFormData({ ...formData, cfg: e.target.value })}
                placeholder="7.5"
                className="w-full px-4 py-3 bg-dark-200 border border-white/10 rounded-lg focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Steps</label>
              <input
                type="number"
                value={formData.steps}
                onChange={(e) => setFormData({ ...formData, steps: e.target.value })}
                placeholder="30"
                className="w-full px-4 py-3 bg-dark-200 border border-white/10 rounded-lg focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm text-gray-400 mb-2">VAE</label>
              <input
                type="text"
                value={formData.vae}
                onChange={(e) => setFormData({ ...formData, vae: e.target.value })}
                className="w-full px-4 py-3 bg-dark-200 border border-white/10 rounded-lg focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">放大算法</label>
              <select
                value={formData.upscaler}
                onChange={(e) => setFormData({ ...formData, upscaler: e.target.value })}
                className="w-full px-4 py-3 bg-dark-200 border border-white/10 rounded-lg focus:outline-none focus:border-primary"
              >
                <option value="">请选择</option>
                <option value="R-ESRGAN 4x+">R-ESRGAN 4x+</option>
                <option value="R-ESRGAN 4x+ Anime6B">R-ESRGAN 4x+ Anime6B</option>
                <option value="ESRGAN_4x">ESRGAN_4x</option>
                <option value="LDSR">LDSR</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Seed</label>
              <input
                type="text"
                value={formData.seed}
                onChange={(e) => setFormData({ ...formData, seed: e.target.value })}
                className="w-full px-4 py-3 bg-dark-200 border border-white/10 rounded-lg focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm text-gray-400">LoRA模型</label>
              <button
                type="button"
                onClick={addLora}
                className="text-sm text-primary hover:text-primary-400 transition-colors"
              >
                + 添加LoRA
              </button>
            </div>
            <div className="space-y-2">
              {formData.loras.map((lora, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={lora.name}
                    onChange={(e) => updateLora(index, "name", e.target.value)}
                    placeholder="LoRA名称"
                    className="flex-1 px-4 py-2 bg-dark-200 border border-white/10 rounded-lg focus:outline-none focus:border-primary"
                  />
                  <input
                    type="number"
                    step="0.1"
                    value={lora.weight}
                    onChange={(e) => updateLora(index, "weight", e.target.value)}
                    placeholder="权重"
                    className="w-24 px-4 py-2 bg-dark-200 border border-white/10 rounded-lg focus:outline-none focus:border-primary"
                  />
                  <button
                    type="button"
                    onClick={() => removeLora(index)}
                    className="px-3 py-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">提示词 (Positive)</label>
            <textarea
              value={formData.prompt}
              onChange={(e) => setFormData({ ...formData, prompt: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 bg-dark-200 border border-white/10 rounded-lg focus:outline-none focus:border-primary resize-none"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">负面提示词 (Negative)</label>
            <textarea
              value={formData.negativePrompt}
              onChange={(e) => setFormData({ ...formData, negativePrompt: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 bg-dark-200 border border-white/10 rounded-lg focus:outline-none focus:border-primary resize-none"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-dark-200 hover:bg-dark-300 rounded-lg transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 bg-primary hover:bg-primary-700 disabled:bg-primary/50 rounded-lg font-medium transition-colors"
            >
              {loading ? "保存中..." : "保存"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
