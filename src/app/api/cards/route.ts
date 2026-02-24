import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { withAuth } from "@/lib/middleware";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: NextRequest) {
  return withAuth(request, async (req) => {
    try {
      const data = await req.json();
      
      if (!data.title?.trim()) {
        return NextResponse.json(
          { error: "标题不能为空" },
          { status: 400 }
        );
      }

      const card = await prisma.card.create({
        data: {
          id: uuidv4(),
          title: data.title.trim(),
          thumbnail: data.thumbnail || null,
          fullImage: data.fullImage || null,
          modelName: data.modelName || null,
          modelType: data.modelType || null,
          sampler: data.sampler || null,
          cfg: data.cfg ? parseFloat(data.cfg) : null,
          steps: data.steps ? parseInt(data.steps) : null,
          vae: data.vae || null,
          upscaler: data.upscaler || null,
          seed: data.seed?.toString() || null,
          size: data.size || null,
          prompt: data.prompt || null,
          negativePrompt: data.negativePrompt || null,
          loras: data.loras?.length > 0 ? {
            create: data.loras.map((lora: { name: string; weight: number }) => ({
              id: uuidv4(),
              name: lora.name,
              weight: parseFloat(lora.weight.toString()),
            })),
          } : undefined,
        },
        include: { loras: true },
      });

      return NextResponse.json(card, { status: 201 });
    } catch (error) {
      console.error("Create card error:", error);
      return NextResponse.json(
        { error: "创建卡片失败" },
        { status: 500 }
      );
    }
  });
}
