"use client"

import { useTheme } from "next-themes"
import { FaSun, FaMoon } from "react-icons/fa"

const ThemeToggle = () => {
  const {  setTheme, resolvedTheme } = useTheme()

  // Use resolvedTheme instead of theme
  const currentTheme = resolvedTheme

  if (!currentTheme) return null

  const isDark = currentTheme === "dark"

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="p-2 rounded-lg bg-zinc-200 dark:bg-zinc-800 transition hover:scale-105"
    >
      {isDark ? (
        <FaSun className="text-yellow-500" />
      ) : (
        <FaMoon className="text-zinc-700 dark:text-white" />
      )}
    </button>
  )
}

export default ThemeToggle