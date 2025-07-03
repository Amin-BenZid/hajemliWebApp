import { useState } from "react";
import { Briefcase, Check, UserPlus, X } from "lucide-react";
import OwnerBottomNav from "../../components/ShopOwnerBottomNav";
import { useNavigate } from "react-router-dom"; // ⬅ if not already imported

const OwnerJobOffers = () => {
  const [activeTab, setActiveTab] = useState("sent");
  const navigate = useNavigate();

  const sentOffers = [
    { id: "s1", barber: "Ali B.", type: "Freelance", status: "pending" },
    { id: "s2", barber: "Yassine M.", type: "Full-Time", status: "accepted" },
  ];

  const applications = [
    { id: "a1", barber: "Amine BZ", type: "Freelance", message: "Available this summer" },
    {
      id: "a2",
      barber: "Nour H.",
      type: "Full-Time",
      message: "Looking for long-term job",
    },
  ];

  const receivedOffers = [
    { id: "r1", shop: "Urban Barber", type: "Freelance", status: "rejected" },
  ];

  const handleAccept = (id) => {
    console.log("Accepted application:", id);
  };

  const handleReject = (id) => {
    console.log("Rejected application:", id);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "sent":
        return (
          <div className="space-y-4">
            {sentOffers.map((offer) => (
              <div
                key={offer.id}
                className="bg-white dark:bg-zinc-800 border dark:border-zinc-700 p-4 rounded-xl"
              >
                <p>
                  Offer sent to <strong>{offer.barber}</strong> – {offer.type}
                </p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 capitalize">
                  Status: {offer.status}
                </p>
              </div>
            ))}
          </div>
        );
      case "applications":
        return (
          <div className="space-y-4">
            {applications.map((app) => (
              <div
                key={app.id}
                className="bg-white dark:bg-zinc-800 border dark:border-zinc-700 p-4 rounded-xl"
              >
                <p>
                  <strong>{app.barber}</strong> applied for {app.type}
                </p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  "{app.message}"
                </p>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => handleAccept(app.id)}
                    className="px-3 py-1 rounded bg-green-600 text-white text-sm flex items-center gap-1"
                  >
                    <Check size={14} /> Accept
                  </button>
                  <button
                    onClick={() => handleReject(app.id)}
                    className="px-3 py-1 rounded bg-red-600 text-white text-sm flex items-center gap-1"
                  >
                    <X size={14} /> Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        );
      case "received":
        return (
          <div className="space-y-4">
            {receivedOffers.map((offer) => (
              <div
                key={offer.id}
                className="bg-white dark:bg-zinc-800 border dark:border-zinc-700 p-4 rounded-xl"
              >
                <p>
                  Offer from <strong>{offer.shop}</strong> – {offer.type}
                </p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 capitalize">
                  Status: {offer.status}
                </p>
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900 text-black dark:text-white px-6 py-6 pb-28">
      <OwnerBottomNav />
      <h1 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Briefcase size={20} /> Job Offers
      </h1>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab("sent")}
          className={`px-4 py-2 rounded-xl text-sm ${
            activeTab === "sent"
              ? "bg-black text-white dark:bg-white dark:text-black"
              : "bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-white"
          }`}
        >
          Sent Offers
        </button>
        <button
          onClick={() => setActiveTab("applications")}
          className={`px-4 py-2 rounded-xl text-sm ${
            activeTab === "applications"
              ? "bg-black text-white dark:bg-white dark:text-black"
              : "bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-white"
          }`}
        >
          Applications
        </button>
        <button
          onClick={() => setActiveTab("received")}
          className={`px-4 py-2 rounded-xl text-sm ${
            activeTab === "received"
              ? "bg-black text-white dark:bg-white dark:text-black"
              : "bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-white"
          }`}
        >
          Received
        </button>
      </div>

      {renderTabContent()}
      <div className="mb-6 pt-16">
        <button
          onClick={() => navigate("/owner/team")}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-xl shadow flex items-center gap-2"
        >
          <UserPlus size={16} />
          Create Offer
        </button>
      </div>
    </div>
  );
};

export default OwnerJobOffers;
