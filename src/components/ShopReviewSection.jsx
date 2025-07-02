import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

toast.configure();

export default function ShopReviewSection({ shopId, currentClientId }) {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    if (shopId) {
      axios
        .get(`${import.meta.env.VITE_API_BASE_URL}/reviews/shop/${shopId}`)
        .then((res) => setReviews(res.data))
        .catch(() => toast.error("Failed to load reviews"));
    }
  }, [shopId]);

  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this review?");
    if (!confirm) return;

    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/reviews/${id}`);
      toast.success("Review deleted successfully");
      setReviews((prev) => prev.filter((r) => r._id !== id));
    } catch {
      toast.error("Failed to delete review");
    }
  };

  const handleEdit = async (id, nb_stars, comment) => {
    const newComment = prompt("Edit your review:", comment);
    if (newComment === null) return;

    const newStars = parseInt(prompt("New star rating (1-5):", nb_stars), 10);
    if (isNaN(newStars) || newStars < 1 || newStars > 5) {
      return toast.error("Invalid rating");
    }

    try {
      await axios.put(`${import.meta.env.VITE_API_BASE_URL}/reviews/${id}`, {
        nb_stars: newStars,
        comment: newComment,
      });
      toast.success("Review updated");
      setReviews((prev) =>
        prev.map((r) =>
          r._id === id ? { ...r, nb_stars: newStars, comment: newComment } : r
        )
      );
    } catch {
      toast.error("Failed to update review");
    }
  };

  return (
    <div className="space-y-4">
      {reviews.length === 0 ? (
        <p className="text-sm text-gray-500">No reviews yet for this shop.</p>
      ) : (
        reviews.map((r) => (
          <div
            key={r._id}
            className="border border-zinc-200 dark:border-zinc-700 rounded-xl p-4 bg-white dark:bg-zinc-800"
          >
            <div className="flex items-center gap-2 mb-2">
              <p className="text-yellow-500 font-medium">{"⭐".repeat(r.nb_stars)}</p>
              <span className="text-xs text-gray-500 ml-auto">
                {new Date(r.date_of_send).toLocaleDateString()}
              </span>
            </div>
            <p className="text-sm text-gray-700 dark:text-zinc-200">
              {r.comment || "No comment."}
            </p>

            {r.user_id === currentClientId && (
              <div className="flex gap-4 mt-2 text-sm">
                <button
                  onClick={() => handleEdit(r._id, r.nb_stars, r.comment)}
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(r._id)}
                  className="text-red-600 dark:text-red-400 hover:underline"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
