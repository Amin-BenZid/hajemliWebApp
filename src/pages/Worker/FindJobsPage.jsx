import { useState, useEffect } from "react";
import { MapPin, Building2, Briefcase, Send } from "lucide-react";
import BarberBottomNav from "../../components/BarberBottomNav";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

export default function FindJobsPage() {
  const [cityFilter, setCityFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);
  const [message, setMessage] = useState("");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applyResult, setApplyResult] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    async function fetchJobs() {
      setLoading(true);
      try {
        const res = await api.get("/job-offers");
        const jobsRaw = res.data || [];
        // Get unique shop_ids
        const uniqueShopIds = Array.from(new Set(jobsRaw.map(job => job.shop_id)));
        // Fetch shop details for each unique shop_id
        const shopMap = {};
        await Promise.all(uniqueShopIds.map(async (shopId) => {
          if (!shopId) return;
          try {
            const shopRes = await api.get(`/shops/${shopId}`);
            shopMap[shopId] = shopRes.data.shop_name || shopId;
          } catch {
            shopMap[shopId] = shopId;
          }
        }));
        // Map backend fields to frontend card fields, using shop name
        const jobsData = jobsRaw.map(job => ({
          id: job._id,
          shopName: shopMap[job.shop_id] || job.shop_id,
          location: job.area || job.location || "",
          type: job.type === 'Full-time' || job.type === 'Full-Time' ? 'Full-Time' : job.type === 'Part-time' || job.type === 'Part-Time' ? 'Part-Time' : job.type,
          description: job.description,
          image: job.picture || null,
          availability: job.availability, // Add availability to the job object
        }));
        setJobs(jobsData);
      } catch (err) {
        setJobs([]);
      }
      setLoading(false);
    }
    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter(
    (job) =>
      job.availability === true &&
      (cityFilter === "" || job.location === cityFilter) &&
      (typeFilter === "" || job.type === typeFilter)
  );

  const handleApply = async () => {
    if (!selectedJob || !user?.barber_id) return;
    setApplying(true);
    setApplyResult(null);
    try {
      await api.put(`/job-offers/${selectedJob.id}/barber`, {
        barber_id: user.barber_id,
        applytext: message,
      });
      setApplyResult({ success: true, message: "Application sent!" });
      setSelectedJob(null);
      setMessage("");
    } catch (err) {
      setApplyResult({ success: false, message: "Failed to apply. Please try again." });
    }
    setApplying(false);
  };

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
          <option value="Full-Time">Full-Time</option>
          <option value="Part-Time">Part-Time</option>
        </select>
      </div>

      {/* Active Type Filter Badge */}
      {typeFilter && (
        <div className="mb-2 flex items-center gap-2">
          <span className="inline-flex items-center bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium">
            Type: {typeFilter}
            <button
              className="ml-2 text-blue-600 hover:text-blue-900 dark:text-blue-300 dark:hover:text-blue-100"
              onClick={() => setTypeFilter("")}
              title="Clear type filter"
            >
              ×
            </button>
          </span>
        </div>
      )}

      {/* Job Cards */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8 text-zinc-500 dark:text-zinc-400">Loading jobs...</div>
        ) : filteredJobs.length === 0 ? (
          <p className="text-zinc-500 dark:text-zinc-400">
            No jobs found for selected filters.
          </p>
        ) : (
          filteredJobs.map((job) => (
            <div
              key={job.id}
              className="border dark:border-zinc-700 rounded-2xl overflow-hidden shadow-sm flex flex-col sm:flex-row"
            >
              {job.image ? (
                <img
                  src={job.image}
                  alt={job.shopName}
                  className="w-full sm:w-40 h-40 object-cover"
                />
              ) : (
                <div className="w-full sm:w-40 h-40 flex items-center justify-center bg-zinc-200 dark:bg-zinc-700">
                  <Briefcase size={40} className="text-zinc-400" />
                </div>
              )}
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
          ))
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
                disabled={applying}
              >
                Cancel
              </button>
              <button
                onClick={handleApply}
                className="bg-black dark:bg-white text-white dark:text-black px-4 py-2 rounded-xl text-sm flex items-center gap-1 disabled:opacity-60"
                disabled={applying}
              >
                {applying ? "Sending..." : (<><Send size={14} /> Send</>)}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Apply Result Message */}
      {applyResult && (
        <div className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 px-4 py-2 rounded-xl text-sm font-medium ${applyResult.success ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
          {applyResult.message}
        </div>
      )}
    </div>
  );
}
