"use client";

import { useEffect } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import useAuthStore from "@/store/authStore";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const setUser = useAuthStore((s) => s.setUser);

  useEffect(() => {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";
    fetch(`${baseUrl}/api/auth/me`, { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        if (data?.role) setUser(data);
      })
      .catch(() => {});
  }, [setUser]);

  return (
    <div className="flex w-full min-h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8 bg-zinc-50 dark:bg-black">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
