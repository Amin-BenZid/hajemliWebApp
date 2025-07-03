import { useState } from "react";
import { MapPin, Building2, Briefcase, Send } from "lucide-react";
import BarberBottomNav from "../../components/BarberBottomNav";

export default function FindJobsPage() {
  const [cityFilter, setCityFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);
  const [message, setMessage] = useState("");

  const jobs = [
    {
      id: "j1",
      shopName: "Luxury Cuts",
      location: "Tunis",
      type: "Full-time",
      description: "We are looking for an experienced barber to join our high-end salon.",
      image:
        "https://images.unsplash.com/photo-1601360421301-318c5c59d410?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: "j2",
      shopName: "Fade Masters",
      location: "Sfax",
      type: "Part-time",
      description: "Evening shifts available. Ideal for students or freelancers.",
      image:
        "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: "j3",
      shopName: "Gentlemen’s Hub",
      location: "Sousse",
      type: "Full-time",
      description: "Join our vibrant team and grow your career.",
      image:
        "https://images.unsplash.com/photo-1616627985886-01a6410d2ed7?auto=format&fit=crop&w=600&q=80",
    },
  ];

  const filteredJobs = jobs.filter(
    (job) =>
      (cityFilter === "" || job.location === cityFilter) &&
      (typeFilter === "" || job.type === typeFilter)
  );

  return (
    <div className="pb-20 min-h-screen bg-white dark:bg-zinc-900 text-black dark:text-white p-5 space-y-6">
      <h1 className="text-2xl font-bold">Find Jobs</h1>
      <BarberBottomNav />
      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <select
          value={cityFilter}
          onChange={(e) => setCityFilter(e.target.value)}
          className="border px-3 py-2 rounded-xl dark:bg-zinc-800 dark:border-zinc-600"
        >
          <option value="">All Cities</option>
          <option value="Tunis">Tunis</option>
          <option value="Sfax">Sfax</option>
          <option value="Sousse">Sousse</option>
        </select>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="border px-3 py-2 rounded-xl dark:bg-zinc-800 dark:border-zinc-600"
        >
          <option value="">All Types</option>
          <option value="Full-time">Full-time</option>
          <option value="Part-time">Part-time</option>
        </select>
      </div>

      {/* Job Cards */}
      <div className="space-y-4">
        {filteredJobs.map((job) => (
          <div
            key={job.id}
            className="border dark:border-zinc-700 rounded-2xl overflow-hidden shadow-sm flex flex-col sm:flex-row"
          >
            <img
              src={job.image}
              alt={job.shopName}
              className="w-full sm:w-40 h-40 object-cover"
            />
            <div className="p-4 flex-1 space-y-2">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Building2 size={18} /> {job.shopName}
              </h2>
              <p className="text-sm flex items-center gap-1 text-zinc-600 dark:text-zinc-400">
                <MapPin size={14} /> {job.location}
              </p>
              <p className="text-sm flex items-center gap-1 text-zinc-600 dark:text-zinc-400">
                <Briefcase size={14} /> {job.type}
              </p>
              <p className="text-sm">{job.description}</p>
              <button
                onClick={() => setSelectedJob(job)}
                className="mt-2 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-xl text-sm"
              >
                Apply
              </button>
            </div>
          </div>
        ))}

        {filteredJobs.length === 0 && (
          <p className="text-zinc-500 dark:text-zinc-400">
            No jobs found for selected filters.
          </p>
        )}
      </div>

      {/* Apply Modal */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-zinc-800 p-6 rounded-2xl shadow-xl w-full max-w-sm space-y-4">
            <h3 className="text-lg font-semibold">Apply to {selectedJob.shopName}</h3>
            <textarea
              rows={4}
              placeholder="Your message..."
              className="w-full px-3 py-2 rounded-xl dark:bg-zinc-700"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setSelectedJob(null);
                  setMessage("");
                }}
                className="text-sm text-zinc-500"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  console.log("Applied to", selectedJob.shopName, "Message:", message);
                  setSelectedJob(null);
                  setMessage("");
                }}
                className="bg-black dark:bg-white text-white dark:text-black px-4 py-2 rounded-xl text-sm flex items-center gap-1"
              >
                <Send size={14} /> Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
