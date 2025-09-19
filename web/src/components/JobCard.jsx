import { ArrowUpRight, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

/**
 * JobCard Component
 * Displays a single job listing with sponsor confidence badge and tech tags.
 *
 * Props:
 * - job: {
 *     title: string,
 *     company: string,
 *     location: string,
 *     remote: boolean,
 *     visa_confidence: "High" | "Medium" | "Low",
 *     tech_tags: string[],
 *     source_url: string
 *   }
 */
export function JobCard({ job }) {
  return (
    <motion.a
      href={job.source_url || "#"}
      target="_blank"
      rel="noreferrer"
      className="group block card p-5 hover:shadow-lg transition-shadow"
      whileHover={{ y: -2 }}
    >
      {/* Header: Title + Sponsor Badge */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-slate-900 dark:text-white text-lg font-semibold tracking-tight">
            {job.title || "Software Engineer"}
          </h3>
          <p className="text-slate-600 dark:text-slate-300 mt-1">
            {job.company || "Company"} · {job.location || "Location"}{" "}
            {job.remote && "· Remote"}
          </p>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1 text-xs font-medium">
          <ShieldCheck className="h-4 w-4 text-brand-500" />
          {job.visa_confidence || "High"} sponsor
        </span>
      </div>

      {/* Tech Tags */}
      {Array.isArray(job.tech_tags) && job.tech_tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {job.tech_tags.slice(0, 6).map((tag) => (
            <span
              key={tag}
              className="text-xs rounded-full bg-brand-50 dark:bg-slate-800 px-2 py-1 text-brand-700 dark:text-slate-200 border border-brand-100 dark:border-slate-700"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer CTA */}
      <div className="mt-5 flex items-center gap-2 text-brand-700 group-hover:gap-2.5 transition-all">
        <span className="text-sm font-medium">View and apply</span>
        <ArrowUpRight className="h-4 w-4" />
      </div>
    </motion.a>
  );
}
