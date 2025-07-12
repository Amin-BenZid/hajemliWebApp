import { useState, useEffect } from "react";
import { Briefcase, Check, UserPlus, X, Image as ImageIcon, Lock, Unlock } from "lucide-react";
import OwnerBottomNav from "../../components/ShopOwnerBottomNav";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { fetchShopByOwnerId, fetchShopById } from "../../services/api";
import api from "../../services/api";

const OwnerJobOffers = () => {
  const [activeTab, setActiveTab] = useState("sent");
  const navigate = useNavigate();
  const { user } = useAuth();

  const [sentOffers, setSentOffers] = useState([]);
  const [loadingOffers, setLoadingOffers] = useState(true);

  useEffect(() => {
    async function fetchOffers() {
      setLoadingOffers(true);
      try {
        // Get the current owner's shop_id
        let shopId = null;
        let shopName = null;
        if (user?.owner_id) {
          const ownerShop = await fetchShopByOwnerId(user.owner_id);
          shopId = ownerShop?.shop_id;
          // Fetch shop name
          if (shopId) {
            try {
              const shopRes = await api.get(`/shops/${shopId}`);
              shopName = shopRes.data.shop_name || shopId;
            } catch {
              shopName = shopId;
            }
          }
        }
        if (!shopId) {
          setSentOffers([]);
          setLoadingOffers(false);
          return;
        }
        // Fetch offers for this shop
        const res = await api.get(`/job-offers/shop/${shopId}`);
        const offers = (res.data || []).map(offer => ({
          id: offer._id,
          shop_id: offer.shop_id, // Ensure shop_id is present
          shopName: shopName || offer.shop_id,
          area: offer.area,
          type: offer.type,
          description: offer.description,
          image: offer.picture || null,
          status: offer.state || 'pending',
          availability: offer.availability || false, // Add availability field
        }));
        setSentOffers(offers);
      } catch (err) {
        setSentOffers([]);
      }
      setLoadingOffers(false);
    }
    fetchOffers();
  }, [user]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [shopInfo, setShopInfo] = useState(null);
  const [form, setForm] = useState({ type: "", description: "", image: null });
  const [imagePreview, setImagePreview] = useState(null);
  const [loadingShop, setLoadingShop] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    if (showCreateModal && user?.owner_id) {
      (async () => {
        setLoadingShop(true);
        try {
          const ownerShop = await fetchShopByOwnerId(user.owner_id);
          if (ownerShop && ownerShop.shop_id) {
            const shopDetails = await fetchShopById(ownerShop.shop_id);
            setShopInfo(shopDetails);
          }
        } catch {}
        setLoadingShop(false);
      })();
    }
  }, [showCreateModal, user]);

  const handleFormChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image" && files && files[0]) {
      setForm((prev) => ({ ...prev, image: files[0] }));
      setImagePreview(URL.createObjectURL(files[0]));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCreateOffer = async (e) => {
    e.preventDefault();
    if (!shopInfo) return;
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("shop_id", shopInfo.shop_id);
      formData.append("area", shopInfo.area || shopInfo.localisation || "");
      formData.append("type", form.type);
      formData.append("description", form.description);
      if (form.image) {
        formData.append("file", form.image);
      }
      const res = await api.post("/job-offers", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      // Add to sentOffers only if request succeeds
      const newOffer = {
        id: res.data.id || `s${Date.now()}`,
        shopName: shopInfo.shop_name,
        area: shopInfo.area || shopInfo.localisation || "",
        type: form.type,
        description: form.description,
        image: res.data.fileUrl || imagePreview,
        status: res.data.status || "pending",
        availability: false, // New offers are initially unavailable
      };
      setSentOffers((prev) => [newOffer, ...prev]);
      setShowCreateModal(false);
      setForm({ type: "", description: "", image: null });
      setImagePreview(null);
    } catch (err) {
      // Optionally show error
      alert("Failed to create offer. Please try again.");
    }
    setSubmitting(false);
  };

  const [applications, setApplications] = useState([]);
  const [loadingApplications, setLoadingApplications] = useState(true);
  const [updatingBarberId, setUpdatingBarberId] = useState(null);

  useEffect(() => {
    async function fetchApplications() {
      setLoadingApplications(true);
      try {
        // Get the current owner's shop_id
        let shopId = null;
        if (user?.owner_id) {
          const ownerShop = await fetchShopByOwnerId(user.owner_id);
          shopId = ownerShop?.shop_id;
        }
        if (!shopId) {
          setApplications([]);
          setLoadingApplications(false);
          return;
        }
        // Fetch applications for this shop
        const res = await api.get(`/job-offers/shop/${shopId}/barber-summaries`);
        const appsRaw = res.data || [];
        // Fetch barber names for each application
        const barberMap = {};
        await Promise.all(appsRaw.map(async (app) => {
          if (!app.barber_id) return;
          try {
            const barberRes = await api.get(`/barbers/${app.barber_id}`);
            barberMap[app.barber_id] = barberRes.data.name || app.barber_id;
          } catch {
            barberMap[app.barber_id] = app.barber_id;
          }
        }));
        // Map applications and set _id from appointment_id
        const apps = appsRaw.map(app => ({
          ...app,
          _id: app.appointment_id,
          barberName: barberMap[app.barber_id] || app.barber_id,
        }));
        setApplications(apps);
      } catch (err) {
        setApplications([]);
      }
      setLoadingApplications(false);
    }
    fetchApplications();
  }, [user, sentOffers]); // Added sentOffers to dependency array

  const receivedOffers = [
    { id: "r1", shop: "Urban Barber", type: "Freelance", status: "rejected" },
  ];

  const handleAccept = async (barber_id, offer_id) => {
    if (!barber_id || !offer_id) return;
    setUpdatingBarberId(barber_id);
    try {
      await api.put(`/job-offers/${offer_id}/barber/state`, {
        barber_id,
        state: "accepted",
      });
      // Find the offer to get the shopId
      const offer = sentOffers.find(o => o.id === offer_id);
      const shopId = offer ? offer.shop_id || offer.shop_id : null; // Use offer.shop_id
      if (shopId) {
        await api.post(`/shops/${shopId}/add-barber/${barber_id}`);
      }
      setApplications((prev) => prev.map(a => a.barber_id === barber_id && a._id === offer_id ? { ...a, state: "accepted" } : a));
    } catch (err) {
      alert("Failed to accept application or add barber to shop.");
    }
    setUpdatingBarberId(null);
  };

  const handleReject = async (barber_id, offer_id) => {
    if (!barber_id || !offer_id) return;
    setUpdatingBarberId(barber_id);
    try {
      await api.put(`/job-offers/${offer_id}/barber/state`, {
        barber_id,
        state: "rejected",
      });
      setApplications((prev) => prev.map(a => a.barber_id === barber_id && a._id === offer_id ? { ...a, state: "rejected" } : a));
    } catch (err) {
      alert("Failed to reject application.");
    }
    setUpdatingBarberId(null);
  };

  // Handler to toggle availability
  const handleToggleAvailability = async (id, currentAvailability) => {
    try {
      await api.put(`/job-offers/${id}/availability`, { availability: !currentAvailability });
      setSentOffers((prev) => prev.map(offer => offer.id === id ? { ...offer, availability: !currentAvailability } : offer));
    } catch (err) {
      alert('Failed to update availability.');
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "sent":
        return (
          <div className="space-y-4">
            {loadingOffers ? (
              <div className="text-center py-8 text-zinc-500 dark:text-zinc-400">Loading offers...</div>
            ) : sentOffers.length === 0 ? (
              <div className="text-center py-8 text-zinc-500 dark:text-zinc-400">No offers found.</div>
            ) : (
              sentOffers.map((offer) => (
                <div
                  key={offer.id}
                  className={`relative border rounded-2xl overflow-hidden shadow-sm flex flex-col sm:flex-row ${offer.availability ? 'border-zinc-700 bg-white dark:bg-zinc-800' : 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900 opacity-80'}`}
                >
                  {/* Toggle Availability button (always shown) */}
                  <button
                    onClick={() => handleToggleAvailability(offer.id, offer.availability)}
                    className={`absolute top-2 right-2 z-10 p-1 rounded-full ${offer.availability ? 'bg-yellow-200 hover:bg-yellow-300 dark:bg-yellow-800 dark:hover:bg-yellow-700 text-yellow-700 dark:text-yellow-200' : 'bg-green-200 hover:bg-green-300 dark:bg-green-800 dark:hover:bg-green-700 text-green-700 dark:text-green-200'}`}
                    title={offer.availability ? 'Deactivate Offer' : 'Activate Offer'}
                  >
                    {offer.availability ? <Lock size={18} /> : <Unlock size={18} />}
                  </button>
                  {/* Image or icon for shop */}
                  {offer.image ? (
                    <img
                      src={offer.image}
                      alt={offer.shopName}
                      className="w-full sm:w-32 h-32 object-cover bg-zinc-100 dark:bg-zinc-700"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full sm:w-32 h-32 bg-zinc-100 dark:bg-zinc-700">
                      <Briefcase size={40} className="text-zinc-400" />
                    </div>
                  )}
                  <div className="p-4 flex-1 space-y-2">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                      {offer.shopName}
                    </h2>
                    <p className="text-sm flex items-center gap-1 text-zinc-600 dark:text-zinc-400">
                      <span className="font-medium">Area:</span> {offer.area}
                    </p>
                    <p className="text-sm flex items-center gap-1 text-zinc-600 dark:text-zinc-400">
                      <Briefcase size={14} /> {offer.type}
                    </p>
                    <p className="text-sm text-zinc-700 dark:text-zinc-300">
                      {offer.description}
                    </p>
                    {!offer.availability && (
                      <span className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700 dark:bg-yellow-800 dark:text-yellow-200">
                        Unavailable
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        );
      case "applications":
        return (
          <div className="space-y-4">
            {loadingApplications ? (
              <div className="text-center py-8 text-zinc-500 dark:text-zinc-400">Loading applications...</div>
            ) : applications.filter(app => app.state === 'pending').length === 0 ? (
              <div className="text-center py-8 text-zinc-500 dark:text-zinc-400">No applications found.</div>
            ) : (
              applications.filter(app => app.state === 'pending').map((app) => (
                <div
                  key={app.barber_id}
                  className="bg-white dark:bg-zinc-800 border dark:border-zinc-700 p-4 rounded-xl"
                >
                  <p>
                    <strong>{app.barberName}</strong> applied for {app.type}
                  </p>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    "{app.message}"
                  </p>
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => app._id ? handleAccept(app.barber_id, app._id) : alert('No job offer ID found for this application.')}
                      className={`px-3 py-1 rounded bg-green-600 text-white text-sm flex items-center gap-1 ${updatingBarberId === app.barber_id ? 'opacity-50 pointer-events-none' : ''}`}
                      disabled={updatingBarberId === app.barber_id}
                    >
                      {updatingBarberId === app.barber_id ? (
                        <span className="w-4 h-4 animate-spin border-2 border-white border-t-transparent rounded-full inline-block"></span>
                      ) : (
                        <><Check size={14} /> Accept</>
                      )}
                    </button>
                    <button
                      onClick={() => app._id ? handleReject(app.barber_id, app._id) : alert('No job offer ID found for this application.')}
                      className={`px-3 py-1 rounded bg-red-600 text-white text-sm flex items-center gap-1 ${updatingBarberId === app.barber_id ? 'opacity-50 pointer-events-none' : ''}`}
                      disabled={updatingBarberId === app.barber_id}
                    >
                      {updatingBarberId === app.barber_id ? (
                        <span className="w-4 h-4 animate-spin border-2 border-white border-t-transparent rounded-full inline-block"></span>
                      ) : (
                        <><X size={14} /> Reject</>
                      )}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        );
      case "received":
        return (
          <div className="space-y-4">
            {loadingApplications ? (
              <div className="text-center py-8 text-zinc-500 dark:text-zinc-400">Loading applications...</div>
            ) : applications.filter(app => app.state && app.state !== 'pending').length === 0 ? (
              <div className="text-center py-8 text-zinc-500 dark:text-zinc-400">No received applications found.</div>
            ) : (
              applications.filter(app => app.state && app.state !== 'pending').map((app) => (
                <div
                  key={app.barber_id}
                  className="bg-white dark:bg-zinc-800 border dark:border-zinc-700 p-4 rounded-xl"
                >
                  <p>
                    <strong>{app.barberName}</strong> applied for {app.type}
                  </p>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    "{app.message}"
                  </p>
                  <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${app.state === 'accepted' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {app.state === 'accepted' ? 'Accepted' : 'Rejected'}
                  </span>
                </div>
              ))
            )}
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
          Created Offers
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
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-xl shadow flex items-center gap-2"
        >
          <UserPlus size={16} />
          Create Offer
        </button>
      </div>

      {/* Create Offer Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-xl w-full max-w-md relative">
            <button
              className="absolute top-3 right-3 text-zinc-400 hover:text-zinc-700 dark:hover:text-white"
              onClick={() => setShowCreateModal(false)}
            >
              <X size={22} />
            </button>
            <h2 className="text-lg font-bold mb-4">Create New Offer</h2>
            {loadingShop ? (
              <div className="text-center py-8">Loading shop info...</div>
            ) : shopInfo ? (
              <form onSubmit={handleCreateOffer} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Shop Name</label>
                  <input
                    type="text"
                    value={shopInfo.shop_name}
                    disabled
                    className="w-full rounded-lg border px-3 py-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Area</label>
                  <input
                    type="text"
                    value={shopInfo.area || shopInfo.localisation || ""}
                    disabled
                    className="w-full rounded-lg border px-3 py-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Type</label>
                  <select
                    name="type"
                    value={form.type}
                    onChange={handleFormChange}
                    required
                    className="w-full rounded-lg border px-3 py-2 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-white"
                  >
                    <option value="" disabled>Select type</option>
                    <option value="Part-Time">Part-Time</option>
                    <option value="Full-Time">Full-Time</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleFormChange}
                    required
                    className="w-full rounded-lg border px-3 py-2 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Picture (optional)</label>
                  <div className="flex items-center gap-3">
                    <label className="cursor-pointer flex items-center gap-2 text-blue-600 hover:underline">
                      <ImageIcon size={20} />
                      <span>Choose Image</span>
                      <input
                        type="file"
                        name="image"
                        accept="image/*"
                        onChange={handleFormChange}
                        className="hidden"
                      />
                      {imagePreview && (
                        <img src={imagePreview} alt="Preview" className="w-12 h-12 object-cover rounded-lg border" />
                      )}
                    </label>
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl font-semibold mt-2 disabled:opacity-60"
                  disabled={submitting}
                >
                  {submitting ? "Creating..." : "Create Offer"}
                </button>
              </form>
            ) : (
              <div className="text-center py-8 text-red-500">No shop found for your account.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnerJobOffers;


// import { useState } from "react";
// import { Briefcase, Check, UserPlus, X } from "lucide-react";
// import OwnerBottomNav from "../../components/ShopOwnerBottomNav";
// import { useNavigate } from "react-router-dom"; // ⬅ if not already imported

// const OwnerJobOffers = () => {
//   const [activeTab, setActiveTab] = useState("sent");
//   const navigate = useNavigate();

//   const sentOffers = [
//     { id: "s1", barber: "Ali B.", type: "Freelance", status: "pending" },
//     { id: "s2", barber: "Yassine M.", type: "Full-Time", status: "accepted" },
//   ];

//   const applications = [
//     { id: "a1", barber: "Amine BZ", type: "Freelance", message: "Available this summer" },
//     {
//       id: "a2",
//       barber: "Nour H.",
//       type: "Full-Time",
//       message: "Looking for long-term job",
//     },
//   ];

//   const receivedOffers = [
//     { id: "r1", shop: "Urban Barber", type: "Freelance", status: "rejected" },
//   ];

//   const handleAccept = (id) => {
//     console.log("Accepted application:", id);
//   };

//   const handleReject = (id) => {
//     console.log("Rejected application:", id);
//   };

//   const renderTabContent = () => {
//     switch (activeTab) {
//       case "sent":
//         return (
//           <div className="space-y-4">
//             {sentOffers.map((offer) => (
//               <div
//                 key={offer.id}
//                 className="bg-white dark:bg-zinc-800 border dark:border-zinc-700 p-4 rounded-xl"
//               >
//                 <p>
//                   Offer sent to <strong>{offer.barber}</strong> – {offer.type}
//                 </p>
//                 <p className="text-sm text-zinc-500 dark:text-zinc-400 capitalize">
//                   Status: {offer.status}
//                 </p>
//               </div>
//             ))}
//           </div>
//         );
//       case "applications":
//         return (
//           <div className="space-y-4">
//             {applications.map((app) => (
//               <div
//                 key={app.id}
//                 className="bg-white dark:bg-zinc-800 border dark:border-zinc-700 p-4 rounded-xl"
//               >
//                 <p>
//                   <strong>{app.barber}</strong> applied for {app.type}
//                 </p>
//                 <p className="text-sm text-zinc-500 dark:text-zinc-400">
//                   "{app.message}"
//                 </p>
//                 <div className="flex gap-2 mt-3">
//                   <button
//                     onClick={() => handleAccept(app.id)}
//                     className="px-3 py-1 rounded bg-green-600 text-white text-sm flex items-center gap-1"
//                   >
//                     <Check size={14} /> Accept
//                   </button>
//                   <button
//                     onClick={() => handleReject(app.id)}
//                     className="px-3 py-1 rounded bg-red-600 text-white text-sm flex items-center gap-1"
//                   >
//                     <X size={14} /> Reject
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         );
//       case "received":
//         return (
//           <div className="space-y-4">
//             {receivedOffers.map((offer) => (
//               <div
//                 key={offer.id}
//                 className="bg-white dark:bg-zinc-800 border dark:border-zinc-700 p-4 rounded-xl"
//               >
//                 <p>
//                   Offer from <strong>{offer.shop}</strong> – {offer.type}
//                 </p>
//                 <p className="text-sm text-zinc-500 dark:text-zinc-400 capitalize">
//                   Status: {offer.status}
//                 </p>
//               </div>
//             ))}
//           </div>
//         );
//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="min-h-screen bg-white dark:bg-zinc-900 text-black dark:text-white px-6 py-6 pb-28">
//       <OwnerBottomNav />
//       <h1 className="text-xl font-bold mb-4 flex items-center gap-2">
//         <Briefcase size={20} /> Job Offers
//       </h1>

//       <div className="flex gap-2 mb-6">
//         <button
//           onClick={() => setActiveTab("sent")}
//           className={`px-4 py-2 rounded-xl text-sm ${
//             activeTab === "sent"
//               ? "bg-black text-white dark:bg-white dark:text-black"
//               : "bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-white"
//           }`}
//         >
//           Sent Offers
//         </button>
//         <button
//           onClick={() => setActiveTab("applications")}
//           className={`px-4 py-2 rounded-xl text-sm ${
//             activeTab === "applications"
//               ? "bg-black text-white dark:bg-white dark:text-black"
//               : "bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-white"
//           }`}
//         >
//           Applications
//         </button>
//         <button
//           onClick={() => setActiveTab("received")}
//           className={`px-4 py-2 rounded-xl text-sm ${
//             activeTab === "received"
//               ? "bg-black text-white dark:bg-white dark:text-black"
//               : "bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-white"
//           }`}
//         >
//           Received
//         </button>
//       </div>

//       {renderTabContent()}
//       <div className="mb-6 pt-16">
//         <button
//           onClick={() => navigate("/owner/team")}
//           className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-xl shadow flex items-center gap-2"
//         >
//           <UserPlus size={16} />
//           Create Offer
//         </button>
//       </div>
//     </div>
//   );
// };

// export default OwnerJobOffers;