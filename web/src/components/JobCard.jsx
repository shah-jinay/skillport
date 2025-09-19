// web/src/components/JobCard.jsx
export function JobCard({ job }) {
  return (
    <div className="border rounded-xl p-4 shadow-sm bg-white hover:shadow-md transition">
      <h3 className="text-lg font-semibold">{job.title}</h3>
      <p className="text-gray-600 mt-1">
        {job.company?.name} · {job.location || "Location N/A"}
      </p>
      {job.visa_sponsorship && (
        <span className="text-green-600 text-sm font-medium mt-2 block">
          Visa Sponsorship Available
        </span>
      )}
    </div>
  );
}
