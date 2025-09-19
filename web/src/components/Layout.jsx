import { ThemeToggle } from "./ThemeToggle";
import { motion } from "framer-motion";

/**
 * Layout
 * Provides a consistent structure: header, footer, and animated main content area.
 * Wrap all pages with <Layout> ... </Layout>.
 */
export function Layout({ children }) {
  return (
    <div className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      {/* Accessibility: Skip to content link */}
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 rounded-lg bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-3 py-2 shadow-lg"
      >
        Skip to content
      </a>

      {/* ---------- HEADER ---------- */}
      <header className="sticky top-0 z-40 backdrop-blur bg-white/70 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800">
        <div className="mx-auto max-w-[1280px] px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2">
            <div
              className="h-8 w-8 rounded-xl bg-brand-500"
              aria-hidden="true"
            />
            <span className="text-lg font-bold tracking-tight">SkillPort</span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 text-sm text-slate-600 dark:text-slate-300">
            <a href="#" className="hover:text-slate-900 dark:hover:text-white">
              Jobs
            </a>
            <a href="#" className="hover:text-slate-900 dark:hover:text-white">
              Companies
            </a>
            <a href="#" className="hover:text-slate-900 dark:hover:text-white">
              Methodology
            </a>
          </nav>

          {/* Right-side actions */}
          <div className="flex items-center gap-3">
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* ---------- MAIN CONTENT ---------- */}
      <motion.main
        id="content"
        className="mx-auto max-w-[1280px] px-4 py-10"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
      >
        {children}
      </motion.main>

      {/* ---------- FOOTER ---------- */}
      <footer className="border-t border-slate-200 dark:border-slate-800 mt-12">
        <div className="mx-auto max-w-[1280px] px-4 py-6 text-sm text-slate-500 flex flex-col md:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} SkillPort, all rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-slate-700 dark:hover:text-slate-300">
              Privacy
            </a>
            <a href="#" className="hover:text-slate-700 dark:hover:text-slate-300">
              Terms
            </a>
            <a href="#" className="hover:text-slate-700 dark:hover:text-slate-300">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
