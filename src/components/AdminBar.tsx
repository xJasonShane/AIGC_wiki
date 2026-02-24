"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface AdminInfo {
  id: string;
  username: string;
}

export default function AdminBar() {
  const [admin, setAdmin] = useState<AdminInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      if (data.authenticated && data.admin) {
        setAdmin(data.admin);
      }
    } catch {
      // Not authenticated
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setAdmin(null);
    window.location.href = "/";
  };

  if (loading) return null;

  if (!admin) {
    return (
      <div className="fixed top-4 right-4 z-50">
        <Link
          href="/login"
          className="px-4 py-2 bg-dark-200 hover:bg-dark-300 border border-white/10 rounded-lg text-sm transition-colors"
        >
          管理员登录
        </Link>
      </div>
    );
  }

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-3">
      <Link
        href="/admin/cards"
        className="px-4 py-2 bg-primary hover:bg-primary-700 rounded-lg text-sm font-medium transition-colors"
      >
        新增卡片
      </Link>
      <div className="flex items-center gap-2 px-3 py-2 bg-dark-200 border border-white/10 rounded-lg text-sm">
        <span className="text-gray-400">{admin.username}</span>
        <button
          onClick={handleLogout}
          className="text-gray-500 hover:text-gray-300 transition-colors"
        >
          登出
        </button>
      </div>
    </div>
  );
}
