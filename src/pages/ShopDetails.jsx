import { useParams } from "react-router-dom";
import BarberCard from "../components/BarberCard";
import { useEffect, useState } from "react";
import axios from "axios";
import BottomNav from "../components/BottomNav";
import { Phone, Clock, CalendarDays, Star, Edit, Trash2 } from "lucide-react";
// import FloatingBookButton from "../components/FloatingBookButton";

export default function ShopDetails() {
  const { code } = useParams();
  const [reviews, setReviews] = useState([]);
  const [editingReview, setEditingReview] = useState(null);
  const [editComment, setEditComment] = useState("");
  const [editStars, setEditStars] = useState(5);
  const client = JSON.parse(localStorage.getItem("client"));

  const shop = {
    shop_id: code,
    shop_name: "Barber & Blade",
    owner_id: "owner123",
    localisation: "Tunis",
    number: "+216 12 345 678",
    rating: 4.8,
    work_hours: "09:00 - 18:00",
    day_off: "Sunday",
    profilePicture: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600",
    coverImage: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600",
  };

  const barbers = [
    { id: "b1", name: "Amine", image: shop.coverImage, rating: 4.9 },
    { id: "b2", name: "Karim", image: shop.coverImage, rating: 4.7 },
  ];

  useEffect(() => {
    axios
      .get(`http://localhost:3000/reviews/shop/${code}`)
      .then((res) => setReviews(res.data))
      .catch((err) => console.error("Error fetching reviews:", err));
  }, [code]);

  const handleEdit = (review) => {
    setEditingReview(review);
    setEditComment(review.comment || "");
    setEditStars(review.nb_stars || 5);
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:3000/reviews/${id}`);
    setReviews((prev) => prev.filter((r) => r._id !== id));
  };

  const handleUpdate = async () => {
    await axios.put(`http://localhost:3000/reviews/${editingReview._id}`, {
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 text-black dark:text-white">
      <BottomNav />
      <div className="relative">
        <img
          src={shop.coverImage}
          alt={shop.shop_name}
          className="w-full h-64 object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end p-6 pb-14">
          <div>
            <h1 className="text-3xl font-bold text-white">{shop.shop_name}</h1>
            <p className="text-gray-200 text-sm">{shop.localisation}</p>
          </div>
        </div>
        <img
          src={shop.profilePicture}
          alt="profile"
          className="w-24 h-24 object-cover rounded-full border-4 border-white absolute -bottom-12 left-6 shadow-md bg-white"
        />
      </div>

      <div className="mt-20 px-6 md:px-12">
        <div className="mb-4 text-sm text-gray-600 dark:text-zinc-300 space-y-1">
          <p className="flex items-center gap-2">
            <Phone size={16} /> <strong>Phone:</strong> {shop.number}
          </p>
          <p className="flex items-center gap-2">
            <Clock size={16} /> <strong>Hours:</strong> {shop.work_hours}
          </p>
          <p className="flex items-center gap-2">
            <CalendarDays size={16} /> <strong>Day Off:</strong> {shop.day_off}
          </p>
          <p className="flex items-center gap-2">
            <Star size={16} className="text-yellow-500" /> <strong>Rating:</strong>{" "}
            {shop.rating}
          </p>
        </div>

        <h2 className="text-xl font-semibold mt-8 mb-4">Our Barbers</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {barbers.map((barber) => (
            <BarberCard key={barber.id} barber={barber} />
          ))}
        </div>

        <h2 className=" text-xl font-semibold mt-12 mb-4">Client Reviews</h2>
        <div className="pb-20 space-y-4">
          {reviews.length === 0 ? (
            <p className="text-sm text-gray-500">No reviews yet for this shop.</p>
          ) : (
            reviews.map((r, i) => {
              const isMine = client?.client_id === r.user_id;
              return (
                <div
                  key={i}
                  className="border border-zinc-200 dark:border-zinc-700 rounded-xl p-4 bg-white dark:bg-zinc-800 relative"
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

                  {isMine && (
                    <div className="flex gap-2 absolute top-2 right-2">
                      <button onClick={() => handleEdit(r)} title="Edit">
                        <Edit size={16} className="text-blue-500" />
                      </button>
                      <button onClick={() => handleDelete(r._id)} title="Delete">
                        <Trash2 size={16} className="text-red-500" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {editingReview && (
          <div className="mt-6 border p-4 rounded-xl dark:bg-zinc-800 bg-white">
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <Edit size={18} /> Edit Your Review
            </h3>
            <label className="block text-sm mb-1">Stars:</label>
            <select
              className="w-full mb-2 p-2 rounded-md border dark:bg-zinc-700"
              value={editStars}
              onChange={(e) => setEditStars(Number(e.target.value))}
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
          </div>
        )}
      </div>
    </div>
  );
}
