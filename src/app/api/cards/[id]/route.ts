import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { withAuth } from "@/lib/middleware";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withAuth(request, async (req) => {
    try {
      const { id } = await params;
      const data = await req.json();

      if (!data.title?.trim()) {
        return NextResponse.json(
          { error: "标题不能为空" },
          { status: 400 }
        );
      }

      const existingCard = await prisma.card.findUnique({
        where: { id },
      });

      if (!existingCard) {
        return NextResponse.json(
          { error: "卡片不存在" },
          { status: 404 }
        );
      }

      await prisma.lora.deleteMany({
        where: { cardId: id },
      });

      const card = await prisma.card.update({
        where: { id },
        data: {
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
              name: lora.name,
              weight: parseFloat(lora.weight.toString()),
            })),
          } : undefined,
        },
        include: { loras: true },
      });

      return NextResponse.json(card);
    } catch (error) {
      console.error("Update card error:", error);
      return NextResponse.json(
        { error: "更新卡片失败" },
        { status: 500 }
      );
    }
  });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withAuth(request, async (req) => {
    try {
      const { id } = await params;

      const existingCard = await prisma.card.findUnique({
        where: { id },
      });

      if (!existingCard) {
        return NextResponse.json(
          { error: "卡片不存在" },
          { status: 404 }
        );
      }

      await prisma.card.delete({
        where: { id },
      });

      return NextResponse.json({ success: true });
    } catch (error) {
      console.error("Delete card error:", error);
      return NextResponse.json(
        { error: "删除卡片失败" },
        { status: 500 }
      );
    }
  });
}
