import React, { useState, useEffect } from "react";
import { Pencil, Phone, CalendarDays, User, Eye, EyeOff, Plus, Upload } from "lucide-react";
import BarberBottomNav from "../../components/BarberBottomNav";
import * as LucideIcons from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { fetchBarberById } from "../../services/api";
import api from "../../services/api";

export default function BarberProfilePage() {
  const [barber, setBarber] = useState(null);
  const { user, role } = useAuth();

  const [editMode, setEditMode] = useState(false);
  const [clientView, setClientView] = useState(false);
  const [showReportBox, setShowReportBox] = useState(false);
  const [showAddService, setShowAddService] = useState(false);
  const [newService, setNewService] = useState({ name: "", price: "", time: "", bio: "", image: null });
  const [selectedReview, setSelectedReview] = useState(null);
  const [reportReason, setReportReason] = useState("");
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const [editService, setEditService] = useState(null);
  const [isAvailable, setIsAvailable] = useState(true);
  const [services, setServices] = useState([]);
  const [newServiceImage, setNewServiceImage] = useState(null);
  const [shop, setShop] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [reviewUserNames, setReviewUserNames] = useState({});
  const [editImage, setEditImage] = useState(null);

  const availableIcons = [
    { name: "Scissors", label: "Haircut" },
    { name: "Beard", label: "Beard Trim" },
    { name: "Smile", label: "Facial" },
    { name: "Brush", label: "Makeup" },
    { name: "Sparkles", label: "Styling" },
    { name: "Droplet", label: "Shampoo" },
    { name: "SprayCan", label: "Hair Spray" },
    { name: "Bath", label: "Spa" },
    { name: "Comb", label: "Combing" },
    { name: "Hand", label: "Massage" },
    { name: "Wand", label: "Special Care" },
    { name: "UserCheck", label: "Consultation" },
    { name: "Crown", label: "VIP Service" },
    { name: "Gem", label: "Nail Art" },
  ];

  useEffect(() => {
    async function getBarber() {
      if (role === "worker" && user && (user.barber_id || user._id || user.id)) {
        const barberId = user.barber_id || user._id || user.id;
        try {
          const data = await fetchBarberById(barberId);
          setBarber(data);
          setIsAvailable(!!data.Availability);
          // Fetch services for this barber
          const res = await api.get(`/barbers/${barberId}/services`);
          setServices(res.data);
          // Fetch shop details
          const shopRes = await api.get(`/barbers/${barberId}/shop`);
          setShop(shopRes.data);
          // Fetch upcoming appointments
          const apptRes = await api.get(`/appointments/pending/${barberId}`);
          setAppointments(apptRes.data);
          // Fetch reviews
          const reviewsRes = await api.get(`/reviews/barber/${barberId}`);
          setReviews(reviewsRes.data);
          // Fetch user names for reviews
          const userIds = Array.from(new Set(reviewsRes.data.map(r => r.user_id)));
          const userNamesObj = {};
          for (const uid of userIds) {
            try {
              const userRes = await api.get(`/clients/${uid}`);
              userNamesObj[uid] = userRes.data.first_name ? `${userRes.data.first_name} ${userRes.data.last_name || ''}`.trim() : userRes.data.name || uid;
            } catch {
              userNamesObj[uid] = uid;
            }
          }
          setReviewUserNames(userNamesObj);
        } catch (err) {
          // Optionally handle error
        }
      }
    }
    getBarber();
  }, [user, role]);

  if (!barber) {
    return <div className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-900 text-black dark:text-white">Loading...</div>;
  }

  const handleChange = (e) => {
    setBarber({ ...barber, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imgURL = URL.createObjectURL(file);
      setBarber({ ...barber, image: imgURL });
    }
  };

  const handleAddService = async () => {
    if (!newService.name || !newService.price || !newService.time) return;
    const barberId = barber.barber_id || barber._id || barber.id;
    const payload = {
      name: newService.name,
      price: newService.price,
      time: newService.time,
      bio: newService.bio || ""
    };
    try {
      // Step 1: Add service (JSON)
      const res = await api.post(`/barbers/${barberId}/addservices`, payload);
      const newServiceObj = res.data;
      // Step 2: If image selected, upload it
      if (newServiceImage && newServiceObj && newServiceObj.service_id) {
        const imgForm = new FormData();
        imgForm.append('file', newServiceImage);
        imgForm.append('service_id', newServiceObj.service_id);
        await api.post('/services/upload', imgForm, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
      // Refresh services
      const updated = await api.get(`/barbers/${barberId}/services`);
      setServices(updated.data);
      setShowAddService(false);
      setNewService({ name: "", price: "", time: "", bio: "", image: null });
      setNewServiceImage(null);
    } catch (err) {
      // Optionally show error
    }
  };

  const handleToggleAvailability = async () => {
    if (!barber) return;
    const barberId = barber.barber_id || barber._id || barber.id;
    try {
      await api.patch(`/barbers/${barberId}/toggle-availability`);
      // Refetch barber data to get the new Availability state
      const updated = await fetchBarberById(barberId);
      setIsAvailable(!!updated.Availability);
      setBarber(updated);
    } catch (err) {
      // Optionally show error
    }
  };

  const handleSaveProfile = async () => {
    if (!barber) return;
    const barberId = barber.barber_id || barber._id || barber.id;
    try {
      // 1. If a new image is selected, upload it
      if (editImage) {
        const imgForm = new FormData();
        imgForm.append('file', editImage);
        imgForm.append('barber_id', barberId);
        await api.post('/barbers/upload', imgForm, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
      // 2. Update barber info
      await api.put(`/barbers/${barberId}`, {
        name: barber.name,
        phone: barber.phone,
        mail: barber.mail,
        bio: barber.bio,
      });
      // 3. Refresh barber data
      const updated = await fetchBarberById(barberId);
      setBarber(updated);
      setEditMode(false);
      setEditImage(null);
    } catch (err) {
      // Optionally show error
    }
  };

  if (clientView) {
    return (
      <div className="min-h-screen bg-white dark:bg-zinc-900 text-black dark:text-white p-6 transition-colors">
        <div className="max-w-xl mx-auto space-y-6">
          <div className="flex justify-start items-center">
            <h1 className="text-2xl font-bold">{barber.name}</h1>
            <button
              onClick={() => setClientView(false)}
              className="flex items-center gap-1 px-4 py-1 rounded-full border text-sm dark:border-zinc-600"
            >
              <EyeOff size={16} />
              Barber View
            </button>
          </div>

          <img
            src={barber.profile_image}
            alt={barber.name}
            className="w-24 h-24 rounded-full border dark:border-zinc-600"
          />

          <p className="text-sm">{barber.bio}</p>
          <p className="text-sm flex items-center gap-1">
            <Phone size={14} /> {barber.phone}
          </p>

          <h2 className="text-lg font-semibold">Services</h2>
          <div className="space-y-2">
            {services.map((s) => (
              <div
                key={s._id}
                className="border dark:border-zinc-700 p-3 rounded-xl flex justify-between items-center"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={s.image}
                    alt={s.name}
                    className="w-16 h-16 rounded-lg object-cover border dark:border-zinc-600"
                  />
                  <div>
                    <p className="font-medium">{s.name}</p>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                      {s.price} DT – {s.time} mins
                    </p>
                    <p className="text-sm text-zinc-400 dark:text-zinc-300 mt-1">{s.bio}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Reviews Section */}
          <div className="mt-10">
            <h2 className="text-lg font-semibold mb-4">Client Reviews</h2>
            <div className="space-y-4">
              {reviews.length === 0 ? (
                <div className="text-sm text-zinc-500 dark:text-zinc-400">No reviews yet.</div>
              ) : (
                reviews.map((r) => (
                  <div
                    key={r._id}
                    className="bg-white dark:bg-zinc-800 p-4 rounded-xl border dark:border-zinc-700"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold">{reviewUserNames[r.user_id] || r.user_id}</p>
                        <p className="text-yellow-500 text-sm mb-1">
                          {Array.from({ length: r.nb_stars }).map(() => "★").join("")}
                        </p>
                        <p className="text-sm text-zinc-700 dark:text-zinc-300">{r.comment}</p>
                        <p className="text-xs text-zinc-400 mt-1">{r.date_of_send ? new Date(r.date_of_send).toLocaleDateString() : ""}</p>
                      </div>
                      <button
                        onClick={() => {
                          setShowReportBox(true);
                          setSelectedReview(r);
                        }}
                        className="text-sm text-red-500 hover:underline"
                      >
                        Report
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-20 min-h-screen bg-white dark:bg-zinc-900 text-black dark:text-white p-6 transition-colors">
      <BarberBottomNav />

      <div className="max-w-2xl mx-auto space-y-8">
        <div className="flex justify-start">
          <button
            onClick={() => setClientView(true)}
            className="flex items-center gap-1 px-4 py-1 rounded-full border text-sm dark:border-zinc-600"
          >
            <Eye size={16} />
            Client View
          </button>
        </div>

        {/* Profile */}
        <div className="flex items-center gap-6">
          <div className="relative">
            <img
              src={barber.profile_image}
              alt={barber.name}
              className="w-24 h-24 rounded-full border dark:border-zinc-600"
            />
            {editMode && (
              <label className="absolute bottom-0 right-0 bg-black p-1 rounded-full cursor-pointer">
                <input type="file" className="hidden" onChange={handleImageUpload} />
                <Pencil size={14} className="text-white" />
              </label>
            )}
          </div>
          <div className="flex-1 space-y-2">
            {editMode ? (
              <>
                <input
                  className="w-full px-3 py-2 rounded-xl dark:bg-zinc-700"
                  name="name"
                  value={barber.name}
                  onChange={handleChange}
                />
                <input
                  className="w-full px-3 py-2 rounded-xl dark:bg-zinc-700"
                  name="phone"
                  value={barber.phone}
                  onChange={handleChange}
                />
                <input
                  className="w-full px-3 py-2 rounded-xl dark:bg-zinc-700"
                  name="mail"
                  value={barber.mail || ''}
                  onChange={handleChange}
                  placeholder="Email"
                />
                <textarea
                  name="bio"
                  value={barber.bio}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-xl dark:bg-zinc-700"
                />
                <div className="mt-2">
                  <label htmlFor="edit-barber-image" className="flex items-center gap-2 cursor-pointer bg-black text-white dark:bg-white dark:text-black px-4 py-2 rounded-xl font-semibold w-fit hover:opacity-90 transition">
                    <Upload size={18} />
                    {editImage ? editImage.name : "Change profile picture"}
                    <input
                      id="edit-barber-image"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={e => setEditImage(e.target.files[0])}
                    />
                  </label>
                  {editImage && (
                    <img
                      src={URL.createObjectURL(editImage)}
                      alt="Preview"
                      className="w-24 h-24 object-cover rounded-lg border mt-2"
                    />
                  )}
                </div>
              </>
            ) : (
              <>
                <h1 className="text-xl font-bold">{barber.name}</h1>
                <p className="text-sm flex items-center gap-1">
                  <Phone size={14} /> {barber.phone}
                </p>
                <p className="text-sm">{barber.bio}</p>
              </>
            )}
            <div className="flex gap-4">
              <button
                onClick={editMode ? handleSaveProfile : () => setEditMode(true)}
                className="px-4 py-1 bg-black dark:bg-white text-white dark:text-black rounded-xl text-sm"
              >
                {editMode ? "Save" : "Edit Profile"}
              </button>
              <a
                href="/barber/settings"
                className="px-4 py-1 bg-black dark:bg-white text-white dark:text-black rounded-xl text-sm"
              >
                Settings
              </a>
            </div>
          </div>
        </div>
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Availability</h2>
          <div className="flex items-center justify-between border dark:border-zinc-700 p-4 rounded-xl bg-white dark:bg-zinc-800">
            <div>
              <p className="font-medium">
                {isAvailable ? "🟢 Available for Appointments" : "🔴 Not Available"}
              </p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Toggle this to let clients know if you’re accepting bookings.
              </p>
            </div>
            <button
              onClick={handleToggleAvailability}
              className={`px-4 py-2 rounded-xl text-sm font-semibold ${
                isAvailable ? "bg-red-600 text-white" : "bg-green-600 text-white"
              }`}
            >
              {isAvailable ? "Set Unavailable" : "Set Available"}
            </button>
          </div>
        </div>

        {/* Services */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Services</h2>
          <div className="space-y-2">
            {services.map((s) => (
              <div
                key={s._id}
                className="border dark:border-zinc-700 p-3 rounded-xl flex justify-between items-center"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={s.image}
                    alt={s.name}
                    className="w-16 h-16 rounded-lg object-cover border dark:border-zinc-600"
                  />
                  <div>
                    <p className="font-medium">{s.name}</p>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                      {s.price} DT – {s.time} mins
                    </p>
                    <p className="text-sm text-zinc-400 dark:text-zinc-300 mt-1">{s.bio}</p>
                  </div>
                </div>
                {/* Optionally, add edit/delete buttons here if needed */}
              </div>
            ))}
            <button
              onClick={() => setShowAddService(true)}
              className="mt-2 w-full flex items-center justify-center gap-1 bg-black dark:bg-white text-white dark:text-black py-2 rounded-xl text-sm"
            >
              <Plus size={16} /> Add Service
            </button>
          </div>
        </div>
        <div className="mt-10">
          <h2 className="text-lg font-semibold mb-2">Current Shop</h2>
          <div className="border dark:border-zinc-700 rounded-xl p-4 bg-white dark:bg-zinc-800 space-y-3">
            {shop && shop.message === "This barber is not a part of any shop." ? (
              <div className="text-sm text-zinc-500 dark:text-zinc-400 text-center">{shop.message}</div>
            ) : shop ? (
              <>
                <a
                  href="#"
                  className="flex items-center gap-4 hover:opacity-90 transition"
                >
                  <img
                    src={shop.profilePicture}
                    alt={shop.shop_name}
                    className="w-16 h-16 rounded-lg object-cover border dark:border-zinc-600"
                  />
                  <div>
                    <p className="font-medium text-base">{shop.shop_name}</p>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                      {shop.localisation}
                    </p>
                  </div>
                </a>
                <button
                  onClick={() => setShowLeaveConfirm(true)}
                  className="w-full mt-2 text-sm bg-red-600 text-white px-4 py-2 rounded-xl"
                >
                  Leave Shop
                </button>
              </>
            ) : (
              <div className="text-sm text-zinc-500 dark:text-zinc-400">No shop found.</div>
            )}
          </div>
        </div>

        {/* Leave Shop Confirmation Modal */}
        {showLeaveConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-zinc-800 p-6 rounded-2xl shadow-xl w-full max-w-sm space-y-4">
              <h3 className="text-lg font-semibold">Confirm Leaving Shop</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Are you sure you want to leave <strong>{shop?.shop_name || "this shop"}</strong>?
              </p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowLeaveConfirm(false)}
                  className="text-sm text-zinc-500"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    setShowLeaveConfirm(false);
                    const barberId = barber.barber_id || barber._id || barber.id;
                    try {
                      await api.patch(`/barbers/${barberId}/leave-shop`);
                      // Refresh shop info
                      const shopRes = await api.get(`/barbers/${barberId}/shop`);
                      setShop(shopRes.data);
                    } catch (err) {
                      // Optionally show error
                    }
                  }}
                  className="bg-red-600 text-white px-4 py-2 rounded-xl text-sm"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Appointments */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Upcoming Appointments</h2>
          {(() => {
            const now = new Date();
            const futureAppointments = appointments.filter(a => {
              if (!a.time_and_date) return false;
              return new Date(a.time_and_date) > now;
            });
            if (futureAppointments.length === 0) {
              return <div className="text-sm text-zinc-500 dark:text-zinc-400">No upcoming appointments.</div>;
            }
            return futureAppointments.map((a) => (
              <div
                key={a.appointment_id}
                className="bg-white dark:bg-zinc-800 border dark:border-zinc-700 p-4 rounded-xl mb-2"
              >
                <p className="font-medium flex items-center gap-1">
                  <User size={14} /> {a.client_name}
                </p>
                <p className="text-sm text-zinc-500 dark:text-zinc-300">
                  <CalendarDays size={14} className="inline-block mr-1" />
                  {a.time_and_date ? new Date(a.time_and_date).toLocaleDateString() : ""} – {a.time_and_date ? new Date(a.time_and_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
                </p>
                <p className="text-sm">Services: {Array.isArray(a.services) ? a.services.join(", ") : ""}</p>
              </div>
            ));
          })()}
        </div>
      </div>

      {/* Add Service Modal */}
      {showAddService && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-zinc-800 p-6 rounded-2xl shadow-xl w-full max-w-sm space-y-4">
            <h3 className="text-lg font-semibold">Add Service</h3>
            <div className="mb-2">
              <label htmlFor="service-image-upload" className="flex items-center justify-center gap-2 cursor-pointer bg-black text-white dark:bg-white dark:text-black px-4 py-2 rounded-xl font-semibold w-full hover:opacity-90 transition">
                <Upload size={18} />
                {newServiceImage ? newServiceImage.name : "Choisir un fichier"}
                <input
                  id="service-image-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={e => setNewServiceImage(e.target.files[0])}
                />
              </label>
              {newServiceImage && (
                <img
                  src={URL.createObjectURL(newServiceImage)}
                  alt="Preview"
                  className="w-24 h-24 object-cover rounded-lg border mt-2 mx-auto"
                />
              )}
            </div>

            <input
              type="text"
              placeholder="Name"
              className="w-full px-3 py-2 rounded-xl dark:bg-zinc-700"
              value={newService.name || ""}
              onChange={e => setNewService({ ...newService, name: e.target.value })}
            />
            <input
              type="number"
              placeholder="Price (DT)"
              className="w-full px-3 py-2 rounded-xl dark:bg-zinc-700"
              value={newService.price || ""}
              onChange={e => setNewService({ ...newService, price: e.target.value })}
            />
            <input
              type="text"
              placeholder="Time (mins)"
              className="w-full px-3 py-2 rounded-xl dark:bg-zinc-700"
              value={newService.time || ""}
              onChange={e => setNewService({ ...newService, time: e.target.value })}
            />
            <input
              type="text"
              placeholder="Bio"
              className="w-full px-3 py-2 rounded-xl dark:bg-zinc-700"
              value={newService.bio || ""}
              onChange={e => setNewService({ ...newService, bio: e.target.value })}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowAddService(false)}
                className="text-sm text-zinc-500"
              >
                Cancel
              </button>
              <button
                onClick={handleAddService}
                className="bg-black dark:bg-white text-white dark:text-black px-4 py-2 rounded-xl text-sm"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Reviews Section */}
      <div className="max-w-2xl mx-auto mt-10">
        <h2 className="text-lg font-semibold mb-4">Client Reviews</h2>
        <div className="space-y-4">
          {reviews.length === 0 ? (
            <div className="text-sm text-zinc-500 dark:text-zinc-400">No reviews yet.</div>
          ) : (
            reviews.map((r) => (
              <div
                key={r._id}
                className="bg-white dark:bg-zinc-800 p-4 rounded-xl border dark:border-zinc-700"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold">{reviewUserNames[r.user_id] || r.user_id}</p>
                    <p className="text-yellow-500 text-sm mb-1">
                      {Array.from({ length: r.nb_stars }).map(() => "★").join("")}
                    </p>
                    <p className="text-sm text-zinc-700 dark:text-zinc-300">{r.comment}</p>
                    <p className="text-xs text-zinc-400 mt-1">{r.date_of_send ? new Date(r.date_of_send).toLocaleDateString() : ""}</p>
                  </div>
                  <button
                    onClick={() => {
                      setShowReportBox(true);
                      setSelectedReview(r);
                    }}
                    className="text-sm text-red-500 hover:underline"
                  >
                    Report
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      {/* Edit Service Modal */}
      {editService && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-zinc-800 p-6 rounded-2xl shadow-xl w-full max-w-sm space-y-4">
            <h3 className="text-lg font-semibold">Edit Service</h3>
            <select
              value={editService.icon}
              onChange={(e) => setEditService({ ...editService, icon: e.target.value })}
              className="w-full px-3 py-2 rounded-xl dark:bg-zinc-700"
            >
              <option value="">Select Icon</option>
              {availableIcons.map((item) => (
                <option key={item.name} value={item.name}>
                  {item.label}
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Name"
              className="w-full px-3 py-2 rounded-xl dark:bg-zinc-700"
              value={editService.name}
              onChange={(e) => setEditService({ ...editService, name: e.target.value })}
            />
            <input
              type="number"
              placeholder="Price (DT)"
              className="w-full px-3 py-2 rounded-xl dark:bg-zinc-700"
              value={editService.price}
              onChange={(e) => setEditService({ ...editService, price: e.target.value })}
            />
            <input
              type="text"
              placeholder="Duration"
              className="w-full px-3 py-2 rounded-xl dark:bg-zinc-700"
              value={editService.duration}
              onChange={(e) =>
                setEditService({ ...editService, duration: e.target.value })
              }
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditService(null)}
                className="text-sm text-zinc-500"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setBarber({
                    ...barber,
                    services: barber.services.map((s) =>
                      s.id === editService.id ? editService : s
                    ),
                  });
                  setEditService(null);
                }}
                className="bg-black dark:bg-white text-white dark:text-black px-4 py-2 rounded-xl text-sm"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Report Review Modal */}
      {showReportBox && selectedReview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-zinc-800 p-6 rounded-2xl shadow-xl w-full max-w-sm space-y-4">
            <h3 className="text-lg font-semibold">Report Review</h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Reporting review by{" "}
              <span className="font-medium">{selectedReview.user}</span>
            </p>
            <textarea
              rows={4}
              placeholder="Reason for reporting..."
              className="w-full px-3 py-2 rounded-xl dark:bg-zinc-700"
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowReportBox(false);
                  setReportReason("");
                  setSelectedReview(null);
                }}
                className="text-sm text-zinc-500"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  console.log("Reported:", selectedReview.id, "Reason:", reportReason);
                  setShowReportBox(false);
                  setReportReason("");
                  setSelectedReview(null);
                }}
                className="bg-red-600 text-white px-4 py-2 rounded-xl text-sm"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
