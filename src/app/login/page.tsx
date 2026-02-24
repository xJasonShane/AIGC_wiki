"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "登录失败");
        return;
      }

      router.push("/admin/cards");
    } catch {
      setError("网络错误，请重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-2xl font-display font-bold">
            <span className="text-primary text-xl">✦</span>
            AIGC Wiki
          </Link>
          <p className="text-gray-400 mt-2">管理员登录</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-dark-200 rounded-xl p-6 border border-white/10">
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">用户名</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-dark-100 border border-white/10 rounded-lg focus:outline-none focus:border-primary transition-colors"
                placeholder="请输入用户名"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">密码</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-dark-100 border border-white/10 rounded-lg focus:outline-none focus:border-primary transition-colors"
                placeholder="请输入密码"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-primary hover:bg-primary-700 disabled:bg-primary/50 rounded-lg font-medium transition-colors"
            >
              {loading ? "登录中..." : "登录"}
            </button>
          </div>
        </form>

        <p className="text-center text-gray-500 text-sm mt-6">
          <Link href="/" className="hover:text-gray-300 transition-colors">
            返回首页
          </Link>
        </p>
      </div>
    </div>
  );
}
