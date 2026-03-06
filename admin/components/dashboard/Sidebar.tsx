"use client";

import { asideItems } from "@/lib/dashboard-data";
import useAuthStore from "@/store/authStore";
import { ADMIN_ONLY_HREFS } from "@/utils/constants";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useTheme } from "next-themes";
import {
  FaSignOutAlt,
  FaChevronDown,
  FaUserCircle,
  FaSun,
  FaMoon,
  FaStore,
} from "react-icons/fa";

const Sidebar = () => {
  const pathname = usePathname();
  const [openGroup, setOpenGroup] = useState<string | null>("Main");
  const { resolvedTheme, setTheme } = useTheme();

  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const isAdmin = user?.role === "admin";

  const filteredItems = asideItems
    .map((group) => ({
      ...group,
      items: group.items.filter(
        (item) => isAdmin || !ADMIN_ONLY_HREFS.includes(item.href)
      ),
    }))
    .filter((group) => group.items.length > 0);

  return (
    <aside className="
      bg-white dark:bg-zinc-900
      border-r border-gray-100 dark:border-zinc-800
      w-16 md:w-64 transition-all duration-300
      flex flex-col shrink-0
    ">
      {/* Brand header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100 dark:border-zinc-800">
        <div className="hidden md:flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-themeColor flex items-center justify-center shrink-0">
            <FaStore className="text-white text-xs" />
          </div>
          <span className="font-bold text-base text-slateGray tracking-tight">
            Food Admin
          </span>
        </div>

        {/* Mobile: icon only */}
        <div className="md:hidden w-7 h-7 rounded-lg bg-themeColor flex items-center justify-center mx-auto">
          <FaStore className="text-white text-xs" />
        </div>

        {/* Theme toggle */}
        <button
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          className="hidden md:flex items-center justify-center w-7 h-7 rounded-md
                     text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200
                     hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
          title="Toggle theme"
        >
          {resolvedTheme === "dark" ? <FaSun size={13} /> : <FaMoon size={13} />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto no-scrollbar px-2 py-3 space-y-0.5">
        {filteredItems.map((group) => (
          <div key={group.title} className="mb-2">
            <button
              onClick={() =>
                setOpenGroup(openGroup === group.title ? null : group.title)
              }
              className="hidden md:flex items-center justify-between w-full px-2 py-1.5
                         text-xs uppercase tracking-widest font-semibold
                         text-zinc-400 dark:text-zinc-500 hover:text-zinc-500 dark:hover:text-zinc-400
                         transition-colors"
            >
              {group.title}
              <FaChevronDown
                size={9}
                className={`transition-transform duration-200 ${
                  openGroup === group.title ? "rotate-180" : ""
                }`}
              />
            </button>

            {(openGroup === group.title || !openGroup) &&
              group.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`
                      flex items-center justify-center md:justify-start gap-3
                      px-3 py-2.5 rounded-lg transition-colors text-sm font-medium mt-0.5
                      ${isActive
                        ? "bg-themeColor text-white shadow-sm"
                        : "text-zinc-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800 hover:text-zinc-800 dark:hover:text-zinc-100"
                      }
                    `}
                  >
                    <Icon
                      className={`text-base shrink-0 ${
                        isActive ? "text-white" : "text-zinc-400 dark:text-zinc-500"
                      }`}
                    />
                    <span className="hidden md:inline">{item.label}</span>
                  </Link>
                );
              })}
          </div>
        ))}
      </nav>

      {/* User + logout */}
      <div className="px-2 py-3 border-t border-gray-100 dark:border-zinc-800 space-y-1">
        {user && (
          <div className="hidden md:flex items-center gap-2.5 px-3 py-2 rounded-lg
                          bg-gray-50 dark:bg-zinc-800/60">
            <div className="w-7 h-7 rounded-full bg-themeColor/10 dark:bg-themeColor/20
                            flex items-center justify-center shrink-0">
              <FaUserCircle className="text-themeColor text-base" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slateGray truncate leading-tight">
                {user.name}
              </p>
              <p className="text-xs text-zinc-400 capitalize">{user.role}</p>
            </div>
          </div>
        )}

        <button
          onClick={logout}
          className="flex items-center justify-center md:justify-start gap-3
                     w-full px-3 py-2.5 rounded-lg transition-colors text-sm font-medium
                     text-zinc-500 dark:text-zinc-400
                     hover:bg-red-50 dark:hover:bg-red-950/40
                     hover:text-red-600 dark:hover:text-red-400"
        >
          <FaSignOutAlt className="text-base shrink-0" />
          <span className="hidden md:inline">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
