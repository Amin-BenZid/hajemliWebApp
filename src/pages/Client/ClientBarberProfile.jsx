import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BottomNav from "../../components/BottomNav";
import BarberReviewSection from "../../components/BarberReviewSection";
import { MapPin, Phone, CalendarCheck, Edit, Trash2, PlusCircle } from "lucide-react";
import FloatingBookButton from "../../components/FloatingBookButton";
import ServiceCard from "../../components/ServiceCard";
import { fetchBarberById, fetchBarberReviews, fetchServiceById } from "../../services/api";

export default function BarberProfile() {
  const { barberId } = useParams(); // barberId from URL
  const [barber, setBarber] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [editingReview, setEditingReview] = useState(null);
  const [editComment, setEditComment] = useState("");
  const [editStars, setEditStars] = useState(5);
  const [showAddReview, setShowAddReview] = useState(false);
  const [addStars, setAddStars] = useState(5);
  const [addComment, setAddComment] = useState("");
  const [addReviewError, setAddReviewError] = useState("");
  const [error, setError] = useState(null);
  const client = JSON.parse(localStorage.getItem("user"));
  const [services, setServices] = useState([]);

  useEffect(() => {
    async function fetchBarber() {
      try {
        const data = await fetchBarberById(barberId);
        setBarber(data);
        // Fetch service details if services is an array of IDs
        if (Array.isArray(data.services) && data.services.length > 0) {
          const serviceDetails = await Promise.all(
            data.services.map((serviceId) => fetchServiceById(serviceId))
          );
          setServices(serviceDetails);
        } else {
          setServices([]);
        }
      } catch (err) {
        setError("Failed to load barber details.");
      }
    }
    fetchBarber();
  }, [barberId]);

  useEffect(() => {
    async function fetchReviews() {
      try {
        const data = await fetchBarberReviews(barberId);
        setReviews(data);
      } catch (err) {
        // Optionally handle error
      }
    }
    fetchReviews();
  }, [barberId]);

  // Handlers for review actions
  const myReview = client && reviews.find(r => r.user_id === client.client_id);
  const hasMyReview = !!myReview;

  const handleEdit = (review) => {
    setEditingReview(review);
    setEditComment(review.comment || "");
    setEditStars(review.nb_stars || 5);
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${process.env.REACT_APP_API_BASE_URL || "http://localhost:3000"}/reviews/${id}`, { method: "DELETE" });
      setReviews((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      // Optionally handle error
    }
  };

  const handleUpdate = async () => {
    try {
      await fetch(`${process.env.REACT_APP_API_BASE_URL || "http://localhost:3000"}/reviews/${editingReview._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nb_stars: editStars, comment: editComment })
      });
      setReviews((prev) => prev.map((r) =>
        r._id === editingReview._id ? { ...r, nb_stars: editStars, comment: editComment } : r
      ));
      setEditingReview(null);
    } catch (err) {
      // Optionally handle error
    }
  };

  const handleAddReview = async () => {
    setAddReviewError("");
    if (!addComment.trim()) {
      setAddReviewError("Please enter a comment.");
      return;
    }
    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL || "http://localhost:3000"}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          barber_id: barberId,
          user_id: client.client_id,
          nb_stars: addStars,
          comment: addComment,
        })
      });
      const data = await res.json();
      setReviews((prev) => [...prev, data]);
      setShowAddReview(false);
      setAddComment("");
      setAddStars(5);
    } catch (err) {
      setAddReviewError("Failed to add review. Please try again.");
    }
  };

  if (error) return <div className="p-6 text-red-500">{error}</div>;
  if (!barber) return <div className="p-6 text-gray-500">Loading...</div>;

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900 text-black dark:text-white">
      <BottomNav />
      <FloatingBookButton />

      {/* Top Profile Section */}
      <div className="relative bg-gray-100 dark:bg-zinc-800 p-6 rounded-b-3xl">
        <div className="flex flex-col items-center gap-4">
          <img
            src={barber.profile_image}
            alt={barber.name}
            className="w-28 h-28 rounded-full object-cover border-4 border-white shadow"
          />
          <div className="text-center">
            <h1 className="text-2xl font-bold">{barber.name}</h1>
            <p className="text-yellow-500 font-semibold">{barber.rating} ⭐</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{barber.bio}</p>
          </div>
        </div>
      </div>

      {/* Contact + Services */}
      <div className="px-6 py-4 space-y-6">
        <div className="space-y-1 text-sm text-gray-600 dark:text-zinc-300">
          <p className="flex items-center gap-2">
            <Phone size={16} /> {barber.phone}
          </p>
          <p className="flex items-center gap-2">
            <MapPin size={16} /> Based in your shop
          </p>
          <p className="flex items-center gap-2">
            <CalendarCheck size={16} /> Born:{" "}
            {new Date(barber.birthdate).toLocaleDateString()}
          </p>
        </div>

        {/* Services */}
        <div>
          <h2 className="text-lg font-semibold mb-2">💈 Services Offered</h2>
          <div className="space-y-2">
            {Array.isArray(services) && services.length > 0 ? (
              services.map((service) => (
                <ServiceCard key={service._id || service.service_id} service={service} />
              ))
            ) : (
              <div className="text-gray-400">No services listed.</div>
            )}
          </div>
        </div>

        {/* Days Off */}
        {Array.isArray(barber.dayoff) && barber.dayoff.length > 0 && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-2">🛌 Days Off</h2>
            <ul className="flex flex-wrap gap-2">
              {barber.dayoff.map((day) => (
                <li key={day} className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 px-3 py-1 rounded-full text-sm font-medium">
                  {day}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Images Gallery */}
        {Array.isArray(barber.images) && barber.images.length > 0 && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-2">📸 Gallery</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {barber.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`Barber gallery ${idx + 1}`}
                  className="rounded-xl object-cover w-full h-32 md:h-40 shadow"
                />
              ))}
            </div>
          </div>
        )}

        {/* Reviews */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Client Reviews</h2>
          <div className="space-y-4 pb-20">
            {/* User's own review at the top */}
            {client?.client_id && hasMyReview && (() => {
              const isEditing = editingReview && editingReview._id === myReview._id;
              return (
                <div
                  className="border border-zinc-200 dark:border-zinc-700 rounded-xl p-4 bg-white dark:bg-zinc-800 relative"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex gap-1 text-yellow-500">
                      {Array.from({ length: isEditing ? editStars : myReview.nb_stars }, (_, i) => (
                        <span key={i} className="text-yellow-500">★</span>
                      ))}
                    </div>
                    <span className="text-xs text-gray-500 ml-auto">
                      {new Date(myReview.date_of_send).toLocaleDateString()}
                    </span>
                  </div>
                  {isEditing ? (
                    <>
                      <select
                        className="w-full mb-2 p-2 rounded-md border dark:bg-zinc-700"
                        value={editStars}
                        onChange={(e) => setEditStars(Number(e.target.value))}
                      >
                        {[1, 2, 3, 4, 5].map((n) => (
                          <option key={n} value={n}>{n}</option>
                        ))}
                      </select>
                      <textarea
                        className="w-full p-2 rounded-md border dark:bg-zinc-700"
                        rows={3}
                        value={editComment}
                        onChange={(e) => setEditComment(e.target.value)}
                      />
                      <div className="flex gap-3 mt-3">
                        <button
                          className="bg-black text-white px-4 py-2 rounded-xl"
                          onClick={handleUpdate}
                        >
                          Save
                        </button>
                        <button
                          className="text-gray-500 hover:underline"
                          onClick={() => setEditingReview(null)}
                        >
                          Cancel
                        </button>
                      </div>
                    </>
                  ) : (
                    <p className="text-sm text-gray-700 dark:text-zinc-200 mb-2">
                      {myReview.comment || "No comment."}
                    </p>
                  )}
                  <div className="flex gap-2 absolute bottom-2 right-2">
                    <button onClick={() => handleEdit(myReview)} title="Edit" >
                      <Edit size={16} className="text-blue-500" />
                    </button>
                    <button onClick={() => handleDelete(myReview._id)} title="Delete">
                      <Trash2 size={16} className="text-red-500" />
                    </button>
                  </div>
                </div>
              );
            })()}
            {/* Other reviews */}
            {reviews.filter(r => !client || r.user_id !== client.client_id).length === 0 && reviews.length === 0 && (
              <p className="text-sm text-gray-500">No reviews yet for this barber.</p>
            )}
            {reviews.filter(r => !client || r.user_id !== client.client_id).map((r, i) => (
              <div
                key={r._id || i}
                className="border border-zinc-200 dark:border-zinc-700 rounded-xl p-4 bg-white dark:bg-zinc-800 relative"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex gap-1 text-yellow-500">
                    {Array.from({ length: r.nb_stars }, (_, j) => (
                      <span key={j} className="text-yellow-500">★</span>
                    ))}
                  </div>
                  <span className="text-xs text-gray-500 ml-auto">
                    {r.date_of_send ? new Date(r.date_of_send).toLocaleDateString() : ''}
                  </span>
                </div>
                <p className="text-sm text-gray-700 dark:text-zinc-200 mb-2">
                  {r.comment || "No comment."}
                </p>
              </div>
            ))}
            {/* Add review button/form */}
            {!hasMyReview && client?.client_id && !showAddReview && (
              <button
                className="flex items-center gap-2 mt-4 px-4 py-2 bg-black text-white rounded-xl hover:bg-zinc-800"
                onClick={() => setShowAddReview(true)}
              >
                <PlusCircle size={18} /> Add a Review
              </button>
            )}
            {showAddReview && (
              <div
                className="mt-6 border p-4 rounded-xl dark:bg-zinc-800 bg-white"
              >
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                  <PlusCircle size={18} /> Add Your Review
                </h3>
                <label className="block text-sm mb-1">Stars:</label>
                <select
                  className="w-full mb-2 p-2 rounded-md border dark:bg-zinc-700"
                  value={addStars}
                  onChange={(e) => setAddStars(Number(e.target.value))}
                >
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
                <label className="block text-sm mb-1">Comment:</label>
                <textarea
                  className="w-full p-2 rounded-md border dark:bg-zinc-700"
                  rows={3}
                  value={addComment}
                  onChange={(e) => setAddComment(e.target.value)}
                />
                {addReviewError && (
                  <div className="text-red-500 mt-2 text-sm">{addReviewError}</div>
                )}
                <div className="flex gap-3 mt-3">
                  <button
                    className="bg-black text-white px-4 py-2 rounded-xl"
                    onClick={handleAddReview}
                  >
                    Submit
                  </button>
                  <button
                    className="text-gray-500 hover:underline"
                    onClick={() => setShowAddReview(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
