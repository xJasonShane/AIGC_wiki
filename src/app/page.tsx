import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db";
import CardModal from "@/components/CardModal";
import AdminBar from "@/components/AdminBar";

export default async function Home() {
  const cards = await prisma.card.findMany({
    include: { loras: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <AdminBar />
      
      <header className="relative overflow-hidden bg-gradient-to-b from-dark-100 to-transparent py-12 text-center">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[600px] h-[200px] bg-primary/20 rounded-full blur-3xl opacity-50" />
        </div>
        <div className="relative z-10">
          <h1 className="font-display text-4xl font-bold tracking-tight flex items-center justify-center gap-3">
            <span className="text-primary text-3xl pulse-icon">✦</span>
            AIGC Wiki
          </h1>
          <p className="text-gray-400 mt-2">探索AI艺术的参数奥秘</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <section>
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/10">
            <h2 className="font-display text-xl font-semibold">作品展示</h2>
            <span className="text-gray-500 text-sm bg-dark-200 px-3 py-1.5 rounded-lg">
              {cards.length} 张作品
            </span>
          </div>

          {cards.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <div className="text-5xl mb-4 opacity-50">🖼️</div>
              <p>暂无作品展示</p>
              <p className="text-sm mt-2">管理员登录后可添加卡片</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {cards.map((card) => (
                <CardModal key={card.id} card={card}>
                  <article className="group bg-dark-200 rounded-xl overflow-hidden cursor-pointer border border-white/5 transition-all duration-300 hover:-translate-y-1 hover:border-white/10 card-glow">
                    <div className="relative aspect-[3/4] bg-dark-100 overflow-hidden">
                      {card.thumbnail ? (
                        <Image
                          src={card.thumbnail}
                          alt={card.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-gray-600">
                          暂无图片
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium truncate">{card.title}</h3>
                      <div className="flex gap-2 mt-2 flex-wrap">
                        {card.modelName && (
                          <span className="text-xs text-gray-400 bg-dark-100 px-2 py-1 rounded">
                            {card.modelName}
                          </span>
                        )}
                        {card.modelType && (
                          <span className="text-xs text-gray-400 bg-dark-100 px-2 py-1 rounded">
                            {card.modelType}
                          </span>
                        )}
                      </div>
                    </div>
                  </article>
                </CardModal>
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="text-center py-8 text-gray-500 text-sm border-t border-white/5">
        AIGC Wiki © 2024 | 记录AI艺术的每一份灵感
      </footer>
    </>
  );
}
