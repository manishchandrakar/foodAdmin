"use client";

import { asideItems } from "@/lib/dashboard-data";
import useAuthStore from "@/store/authStore";
import { ADMIN_ONLY_HREFS } from "@/utils/constants";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { FaSignOutAlt, FaChevronDown, FaUserCircle } from "react-icons/fa";

// Paths restricted to admin only (subadmin gets redirected by middleware, but also hidden here)e


const Sidebar = () => {
  const pathname = usePathname();
  const [openGroup, setOpenGroup] = useState<string | null>("Main");

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
    <aside className="bg-white dark:bg-zinc-900 border-r dark:border-zinc-800
                      w-16 md:w-64 transition-all duration-300 flex flex-col">

      <div className="p-4 font-bold text-lg hidden md:block">
        Food Admin
      </div>

      <nav className="mt-4 flex-1 overflow-y-auto px-2 space-y-3">
        {filteredItems.map((group) => (
          <div key={group.title}>
            <button
              onClick={() =>
                setOpenGroup(openGroup === group.title ? null : group.title)
              }
              className="hidden md:flex items-center justify-between w-full px-2 text-xs uppercase text-zinc-400 font-semibold"
            >
              {group.title}
              <FaChevronDown
                className={`transition ${
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
                    className={`flex items-center justify-center md:justify-start gap-3 px-3 py-3 rounded-lg transition ${
                      isActive
                        ? "bg-indigo-500 text-white"
                        : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    }`}
                  >
                    <Icon className="text-lg" />
                    <span className="hidden md:inline">{item.label}</span>
                  </Link>
                );
              })}
          </div>
        ))}
      </nav>

      {/* User info + logout */}
      <div className="p-2 border-t dark:border-zinc-800 space-y-1">
        {user && (
          <div className="hidden md:flex items-center gap-2 px-3 py-2 text-sm text-zinc-500 dark:text-zinc-400">
            <FaUserCircle className="text-lg shrink-0" />
            <div className="min-w-0">
              <p className="font-medium text-zinc-700 dark:text-zinc-200 truncate">{user.name}</p>
              <p className="text-xs capitalize">{user.role}</p>
            </div>
          </div>
        )}
        <button
          onClick={logout}
          className="flex items-center justify-center md:justify-start gap-3 px-3 py-3 rounded-lg transition w-full
                     text-zinc-700 dark:text-red-800 hover:bg-gray-50 hover:text-red-600"
        >
          <FaSignOutAlt className="text-lg" />
          <span className="hidden md:inline">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
