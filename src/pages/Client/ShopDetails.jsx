import { useParams, useNavigate } from "react-router-dom";
import BarberCard from "../../components/BarberCard";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import BottomNav from "../../components/BottomNav";
import { Phone, Clock, CalendarDays, Star, Edit, Trash2, Flag, PlusCircle } from "lucide-react";
import { motion } from "framer-motion";
import { API_BASE_URL } from "../../services/api";

export default function ShopDetails() {
  const { id } = useParams();
  const [reviews, setReviews] = useState([]);
  const [editingReview, setEditingReview] = useState(null);
  const [editComment, setEditComment] = useState("");
  const [editStars, setEditStars] = useState(5);
  const [shop, setShop] = useState(null);
  const [barbers, setBarbers] = useState([]);
  const barbersRef = useRef(null);
  const client = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const [showAddReview, setShowAddReview] = useState(false);
  const [addStars, setAddStars] = useState(5);
  const [addComment, setAddComment] = useState("");
  const [addReviewError, setAddReviewError] = useState("");

  const scrollToBarbers = () => {
    barbersRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!id) return;
    axios
      .get(`${API_BASE_URL}/reviews/shop/${id}`)
      .then((res) => setReviews(res.data))
      .catch((err) => console.error("Error fetching reviews:", err));
  }, [id]);

  useEffect(() => {
    if (!id) return;
    axios
      .get(`${API_BASE_URL}/shops/${id}`)
      .then((res) => setShop(res.data))
      .catch((err) => console.error("Error fetching shop details:", err));
  }, [id]);

  useEffect(() => {
    if (!shop || !shop.barbers || shop.barbers.length === 0) {
      setBarbers([]);
      return;
    }
    Promise.all(
      shop.barbers.map((barberId) =>
        axios
          .get(`${API_BASE_URL}/barbers/${barberId}`)
          .then((res) => res.data)
          .catch((err) => null)
      )
    ).then((barberData) => {
      setBarbers(barberData.filter(Boolean));
    });
  }, [shop]);

  const handleEdit = (review) => {
    setEditingReview(review);
    setEditComment(review.comment || "");
    setEditStars(review.nb_stars || 5);
  };

  const handleDelete = async (id) => {
    await axios.delete(`${API_BASE_URL}/reviews/${id}`);
    setReviews((prev) => prev.filter((r) => r._id !== id));
  };

  const handleUpdate = async () => {
    await axios.put(`${API_BASE_URL}/reviews/${editingReview._id}`, {
      nb_stars: editStars,
      comment: editComment,
    });
    const updated = reviews.map((r) =>
      r._id === editingReview._id
        ? { ...r, nb_stars: editStars, comment: editComment }
        : r
    );
    setReviews(updated);
    setEditingReview(null);
  };

  const handleLeaveShop = async () => {
    if (!client?.client_id) return;
    try {
      await axios.put(`${API_BASE_URL}/clients/${client.client_id}/shop`, { shop_id: null });
      navigate("/client/discover-shops");
    } catch (err) {
      alert("Failed to leave shop. Please try again.");
    }
  };

  const hasMyReview = reviews.some((r) => client?.client_id === r.user_id);

  const handleAddReview = async () => {
    setAddReviewError("");
    if (!addComment.trim()) {
      setAddReviewError("Please enter a comment.");
      return;
    }
    try {
      const res = await axios.post(`${API_BASE_URL}/reviews`, {
        shop_id: id,
        user_id: client.client_id,
        nb_stars: addStars,
        comment: addComment,
      });
      setReviews((prev) => [...prev, res.data]);
      setShowAddReview(false);
      setAddComment("");
      setAddStars(5);
    } catch (err) {
      setAddReviewError("Failed to add review. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 text-black dark:text-white">
      <BottomNav />
      <div className="relative">
        {shop?.coverImage && (
          <img
            src={shop.coverImage}
            alt={shop?.shop_name || "Shop Cover"}
            className="w-full h-64 object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end justify-between p-6 pb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-3xl font-bold text-white">{shop?.shop_name || "Shop Name"}</h1>
            <p className="text-gray-200 text-sm">{shop?.localisation || "Location"}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col gap-3"
          >
            <button
              onClick={scrollToBarbers}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-full shadow-lg transition-all duration-300"
            >
              💈 Book Now
            </button>
            {client?.client_id && (
              <button
                onClick={handleLeaveShop}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-full shadow-lg transition-all duration-300"
              >
                Leave Shop
              </button>
            )}
          </motion.div>
        </div>

        {shop?.profilePicture && (
          <motion.img
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
            src={shop.profilePicture}
            alt="profile"
            className="w-24 h-24 object-cover rounded-full border-4 border-white absolute -bottom-12 left-6 shadow-md bg-white"
          />
        )}
      </div>

      <div className="mt-20 px-6 md:px-12">
        <div className="mb-4 text-sm text-gray-600 dark:text-zinc-300 space-y-1">
          <p className="flex items-center gap-2">
            <Phone size={16} /> <strong>Phone:</strong> {shop?.number || "N/A"}
          </p>
          <p className="flex items-center gap-2">
            <Clock size={16} /> <strong>Hours:</strong> {shop?.work_hours || "N/A"}
          </p>
          <p className="flex items-center gap-2">
            <CalendarDays size={16} /> <strong>Day Off:</strong> {shop?.day_off || "N/A"}
          </p>
          <p className="flex items-center gap-2">
            <Star size={16} className="text-yellow-500" /> <strong>Rating:</strong>{" "}
            {shop?.rating !== undefined ? shop.rating : "N/A"}
          </p>
        </div>

        {/* Gallery */}
        <h2 className="text-xl font-semibold mt-8 mb-4">Our Shop Gallery</h2>
        {(!shop?.images || shop.images.length === 0) ? (
          <p className="text-sm text-gray-500 mb-8">No images in the shop gallery.</p>
        ) : (
          <motion.div
            className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8"
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: { staggerChildren: 0.1 },
              },
            }}
          >
            {(shop?.images || []).map((img, i) => (
              img ? (
                <motion.img
                  key={i}
                  src={img}
                  alt={`Shop ${i + 1}`}
                  className="rounded-xl object-cover h-40 w-full shadow"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                />
              ) : null
            ))}
          </motion.div>
        )}

        {/* Barbers */}
        <h2 ref={barbersRef} className="text-xl font-semibold mt-8 mb-4">
          Our Barbers
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {barbers.length === 0 ? (
            <p className="text-sm text-gray-500">No barbers found for this shop.</p>
          ) : (
            barbers.map((barber, idx) => (
              <motion.div
                key={barber._id || barber.barber_id || idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * idx }}
              >
                <BarberCard barber={{ ...barber, image: barber.profile_image }} />
              </motion.div>
            ))
          )}
        </div>

        {/* Reviews */}
        <h2 className=" text-xl font-semibold mt-12 mb-4">Client Reviews</h2>
        <div className="pb-20 space-y-4">
          {/* User's own review at the top */}
          {client?.client_id && reviews.some(r => r.user_id === client.client_id) && (() => {
            const myReview = reviews.find(r => r.user_id === client.client_id);
            if (!myReview) return null;
            const isEditing = editingReview && editingReview._id === myReview._id;
            return (
              <motion.div
                className="border border-zinc-200 dark:border-zinc-700 rounded-xl p-4 bg-white dark:bg-zinc-800 relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0 }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex gap-1 text-yellow-500">
                    {Array.from({ length: isEditing ? editStars : myReview.nb_stars }, (_, i) => (
                      <Star key={i} size={16} fill="currentColor" />
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
              </motion.div>
            );
          })()}
          {/* Other reviews */}
          {reviews.filter(r => !client || r.user_id !== client.client_id).length === 0 && reviews.length === 0 && (
            <p className="text-sm text-gray-500">No reviews yet for this shop.</p>
          )}
          {reviews.filter(r => !client || r.user_id !== client.client_id).map((r, i) => (
            <motion.div
              key={r._id || i}
              className="border border-zinc-200 dark:border-zinc-700 rounded-xl p-4 bg-white dark:bg-zinc-800 relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="flex gap-1 text-yellow-500">
                  {Array.from({ length: r.nb_stars }, (_, i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                </div>
                <span className="text-xs text-gray-500 ml-auto">
                  {new Date(r.date_of_send).toLocaleDateString()}
                </span>
              </div>
              <p className="text-sm text-gray-700 dark:text-zinc-200 mb-2">
                {r.comment || "No comment."}
              </p>
            </motion.div>
          ))}
          {/* Add review button/form remains unchanged */}
          {!hasMyReview && client?.client_id && !showAddReview && (
            <button
              className="flex items-center gap-2 mt-4 px-4 py-2 bg-black text-white rounded-xl hover:bg-zinc-800"
              onClick={() => setShowAddReview(true)}
            >
              <PlusCircle size={18} /> Add a Review
            </button>
          )}
          {showAddReview && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
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
            </motion.div>
          )}
        </div>

        {/* Edit Review Popup */}
       
      </div>
    </div>
  );
}
