import React, { useState } from "react";
import { Pencil, Phone, CalendarDays, User, Eye, EyeOff, Plus } from "lucide-react";
import BarberBottomNav from "../../components/BarberBottomNav";
import * as LucideIcons from "lucide-react";

export default function BarberProfilePage() {
  const [barber, setBarber] = useState({
    id: "b1",
    name: "Youssef Amara",
    phone: "+216 55 123 456",
    bio: "Barber with 10+ years experience. Precision cuts, fades & beard styling.",
    image: "https://randomuser.me/api/portraits/men/75.jpg",
    services: [
      { id: "s1", name: "Haircut", price: 30, duration: "30 mins", icon: "Scissors" },
      { id: "s2", name: "Beard Trim", price: 20, duration: "15 mins", icon: "Beard" },
      { id: "s3", name: "Facial", price: 25, duration: "20 mins", icon: "Smile" },
    ],
  });

  const [editMode, setEditMode] = useState(false);
  const [clientView, setClientView] = useState(false);
  const [showReportBox, setShowReportBox] = useState(false);
  const [showAddService, setShowAddService] = useState(false);
  const [newService, setNewService] = useState({ name: "", price: "", duration: "" });
  const [selectedReview, setSelectedReview] = useState(null);
  const [reportReason, setReportReason] = useState("");
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const [editService, setEditService] = useState(null);
  const [isAvailable, setIsAvailable] = useState(true);

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

  const [appointments] = useState([
    {
      id: "a1",
      clientName: "Amine BZ",
      date: "2025-07-01",
      time: "14:00",
      services: ["Haircut", "Beard Trim"],
    },
    {
      id: "a2",
      clientName: "Yassine M",
      date: "2025-07-02",
      time: "10:30",
      services: ["Facial"],
    },
  ]);

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

  const handleAddService = () => {
    if (newService.name && newService.price && newService.duration) {
      const newId = "s" + (barber.services.length + 1);
      setBarber({
        ...barber,
        services: [...barber.services, { ...newService, id: newId }],
      });
      setNewService({ name: "", price: "", duration: "" });
      setShowAddService(false);
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
            src={barber.image}
            alt={barber.name}
            className="w-24 h-24 rounded-full border dark:border-zinc-600"
          />

          <p className="text-sm">{barber.bio}</p>
          <p className="text-sm flex items-center gap-1">
            <Phone size={14} /> {barber.phone}
          </p>

          <h2 className="text-lg font-semibold">Services</h2>
          <ul className="space-y-2">
            {barber.services.map((s) => (
              <div
                key={s.id}
                className="border dark:border-zinc-700 p-3 rounded-xl flex justify-between items-center"
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    {s.icon && LucideIcons[s.icon] && (
                      <div className="text-zinc-500 dark:text-zinc-300">
                        {React.createElement(LucideIcons[s.icon], {
                          size: 18,
                        })}
                      </div>
                    )}
                    <p className="font-medium">{s.name}</p>
                  </div>

                  <p className="font-medium">{s.name}</p>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    {s.price} DT – {s.duration}
                  </p>
                </div>
              </div>
            ))}
          </ul>

          {/* Reviews Section */}
          <div className="mt-10">
            <h2 className="text-lg font-semibold mb-4">Client Reviews</h2>
            <div className="space-y-4">
              {[
                {
                  id: "r1",
                  user: "Ali B.",
                  rating: 5,
                  comment: "Amazing haircut and friendly service!",
                },
                {
                  id: "r2",
                  user: "Lina Z.",
                  rating: 4,
                  comment: "Great experience but a bit of delay.",
                },
              ].map((r) => (
                <div
                  key={r.id}
                  className="bg-white dark:bg-zinc-800 p-4 rounded-xl border dark:border-zinc-700"
                >
                  <p className="font-semibold">{r.user}</p>
                  <p className="text-yellow-500 text-sm mb-1">
                    {Array.from({ length: r.rating })
                      .map((_, i) => "★")
                      .join("")}
                  </p>
                  <p className="text-sm text-zinc-700 dark:text-zinc-300">{r.comment}</p>
                </div>
              ))}
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
              src={barber.image}
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
                <textarea
                  name="bio"
                  value={barber.bio}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-xl dark:bg-zinc-700"
                />
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
                onClick={() => setEditMode(!editMode)}
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
              onClick={() => setIsAvailable((prev) => !prev)}
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
            {barber.services.map((s) => (
              <div
                key={s.id}
                className="border dark:border-zinc-700 p-3 rounded-xl flex justify-between items-center"
              >
                <div className="flex items-center gap-3">
                  {LucideIcons[s.icon] &&
                    React.createElement(LucideIcons[s.icon], {
                      className: "w-6 h-6 text-zinc-500 dark:text-zinc-300",
                    })}

                  <p className="font-medium">{s.name}</p>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    {s.price} DT – {s.duration}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditService(s);
                    }}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => {
                      setBarber({
                        ...barber,
                        services: barber.services.filter((srv) => srv.id !== s.id),
                      });
                    }}
                    className="text-sm text-red-600 hover:underline"
                  >
                    🗑️
                  </button>
                </div>
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
            <a
              href={`/shop/TUNX45`} // replace 123 with real shop id when integrated
              className="flex items-center gap-4 hover:opacity-90 transition"
            >
              <img
                src="https://images.unsplash.com/photo-1604004214946-48f3f8bfbf19" // sample image
                alt="Shop"
                className="w-16 h-16 rounded-lg object-cover border dark:border-zinc-600"
              />
              <div>
                <p className="font-medium text-base">Luxury Barber Shop</p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  Sousse, Tunisia
                </p>
              </div>
            </a>

            <button
              onClick={() => setShowLeaveConfirm(true)}
              className="w-full mt-2 text-sm bg-red-600 text-white px-4 py-2 rounded-xl"
            >
              Leave Shop
            </button>
          </div>
        </div>

        {/* Leave Shop Confirmation Modal */}
        {showLeaveConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-zinc-800 p-6 rounded-2xl shadow-xl w-full max-w-sm space-y-4">
              <h3 className="text-lg font-semibold">Confirm Leaving Shop</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Are you sure you want to leave <strong>Luxury Barber Shop</strong>?
              </p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowLeaveConfirm(false)}
                  className="text-sm text-zinc-500"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowLeaveConfirm(false);
                    console.log("Barber left the shop");
                    // TODO: handle leave logic
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
          {appointments.map((a) => (
            <div
              key={a.id}
              className="bg-white dark:bg-zinc-800 border dark:border-zinc-700 p-4 rounded-xl mb-2"
            >
              <p className="font-medium flex items-center gap-1">
                <User size={14} /> {a.clientName}
              </p>
              <p className="text-sm text-zinc-500 dark:text-zinc-300">
                <CalendarDays size={14} className="inline-block mr-1" />
                {a.date} – {a.time}
              </p>
              <p className="text-sm">Services: {a.services.join(", ")}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Add Service Modal */}
      {showAddService && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-zinc-800 p-6 rounded-2xl shadow-xl w-full max-w-sm space-y-4">
            <h3 className="text-lg font-semibold">Add Service</h3>
            <select
              value={newService.icon}
              onChange={(e) => setNewService({ ...newService, icon: e.target.value })}
              className="w-full px-3 py-2 rounded-xl dark:bg-zinc-700"
            >
              <option value="">Select Icon</option>
              {availableIcons.map((item) => {
                return (
                  <option key={item.name} value={item.name}>
                    {item.label}
                  </option>
                );
              })}
            </select>

            <input
              type="text"
              placeholder="Name"
              className="w-full px-3 py-2 rounded-xl dark:bg-zinc-700"
              value={newService.name}
              onChange={(e) => setNewService({ ...newService, name: e.target.value })}
            />
            <input
              type="number"
              placeholder="Price (DT)"
              className="w-full px-3 py-2 rounded-xl dark:bg-zinc-700"
              value={newService.price}
              onChange={(e) => setNewService({ ...newService, price: e.target.value })}
            />
            <input
              type="text"
              placeholder="Duration (e.g. 20 mins)"
              className="w-full px-3 py-2 rounded-xl dark:bg-zinc-700"
              value={newService.duration}
              onChange={(e) => setNewService({ ...newService, duration: e.target.value })}
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
          {[
            {
              id: "r1",
              user: "Ali B.",
              rating: 5,
              comment: "Amazing haircut and friendly service!",
            },
            {
              id: "r2",
              user: "Lina Z.",
              rating: 4,
              comment: "Great experience but a bit of delay.",
            },
          ].map((r) => (
            <div
              key={r.id}
              className="bg-white dark:bg-zinc-800 p-4 rounded-xl border dark:border-zinc-700"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold">{r.user}</p>
                  <p className="text-yellow-500 text-sm mb-1">
                    {Array.from({ length: r.rating })
                      .map((_, i) => "★")
                      .join("")}
                  </p>
                  <p className="text-sm text-zinc-700 dark:text-zinc-300">{r.comment}</p>
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
          ))}
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
