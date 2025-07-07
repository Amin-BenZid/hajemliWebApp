import { useState } from "react";
import axios from "axios";
import { Star, MessageSquareText, AlertCircle, Pencil, Trash } from "lucide-react";
import { API_BASE_URL } from "../services/api";

export default function BarberReviewSection({ barberId, reviews }) {
  const client = JSON.parse(localStorage.getItem("client"));
  //   const [reviews, setReviews] = useState([]);
  const [comment, setComment] = useState("");
  const [stars, setStars] = useState(5);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [editing, setEditing] = useState(null);
  const [editComment, setEditComment] = useState("");
  const [editStars, setEditStars] = useState(5);

  //   useEffect(() => {
  //     axios
  //       .get(`${API_BASE_URL}/reviews/barber/${barberId}`)
  //       .then((res) => {
  //         setReviews(res.data);
  //         const alreadyReviewed = res.data.some((r) => r.user_id === client?.client_id);
  //         setHasReviewed(alreadyReviewed);
  //       })
  //       .catch((err) => console.error("Error loading reviews", err));
  //   }, [barberId, client?.client_id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!client) return;

    try {
      // const res = await axios.post(`${API_BASE_URL}/reviews`, {
      //   barber_id: barberId,
      //   user_id: client.client_id,
      //   nb_stars: stars,
      //   comment,
      //   date_of_send: new Date().toISOString(),
      // });
      //   setReviews((prev) => [res.data, ...prev]);
      setHasReviewed(true);
      setComment("");
      setStars(5);
    } catch (err) {
      console.error("Submit error:", err);
    }
  };

  const handleDelete = async (id) => {
    await axios.delete(`${API_BASE_URL}/reviews/${id}`);
    // setReviews(reviews.filter((r) => r._id !== id));
    setHasReviewed(false);
  };

  const handleUpdate = async () => {
    await axios.put(`${API_BASE_URL}/reviews/${editing._id}`, {
      nb_stars: editStars,
      comment: editComment,
    });
    // setReviews(
    //   reviews.map((r) =>
    //     r._id === editing._id ? { ...r, nb_stars: editStars, comment: editComment } : r
    //   )
    // );
    setEditing(null);
  };

  return (
    <div className="mt-10 px-4 pb-20 ">
      <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
        <MessageSquareText size={20} />
        Client Reviews
      </h2>

      {client && !hasReviewed && (
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-zinc-800 p-4 rounded-xl shadow space-y-3 mb-6"
        >
          <div>
            <label className="block mb-1 text-sm">Stars:</label>
            <select
              value={stars}
              onChange={(e) => setStars(Number(e.target.value))}
              className="w-full rounded-md border dark:bg-zinc-700 p-2"
            >
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n} Stars
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1 text-sm">Comment:</label>
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full p-2 border rounded-md dark:bg-zinc-700"
            />
          </div>
          <button type="submit" className="bg-black text-white px-5 py-2 rounded-xl">
            Submit Review
          </button>
        </form>
      )}

      <div className="space-y-4">
        {reviews.length === 0 ? (
          <p className="text-gray-500">No reviews yet for this barber.</p>
        ) : (
          reviews.map((r) => {
            const isMine = client?.client_id === r.user_id;
            return (
              <div
                key={r._id}
                className="bg-white dark:bg-zinc-800 border dark:border-zinc-700 p-4 rounded-xl relative"
              >
                <div className="flex items-center gap-2 mb-1">
                  <Star className="text-yellow-500" size={16} />
                  <span className="font-medium">{r.nb_stars} Stars</span>
                  <span className="ml-auto text-xs text-gray-500">
                    {new Date(r.date_of_send).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-gray-700 dark:text-zinc-300 mb-2">
                  {r.comment || "No comment provided."}
                </p>

                {isMine && (
                  <div className="flex gap-3 absolute top-2 right-2">
                    <button
                      onClick={() => {
                        setEditing(r);
                        setEditComment(r.comment || "");
                        setEditStars(r.nb_stars || 5);
                      }}
                      className="text-blue-500 hover:underline"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(r._id)}
                      className="text-red-500 hover:underline"
                    >
                      <Trash size={16} />
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
      {!client && (
        <p className="pt-4 text-sm text-red-500 flex items-center gap-1">
          <AlertCircle size={16} /> You must be logged in to post a review.
        </p>
      )}

      {editing && (
        <div className="mt-6 border p-4 rounded-xl dark:bg-zinc-800 bg-white">
          <h3 className="text-lg font-semibold mb-2 flex items-center gap-1">
            <Pencil size={18} /> Edit Your Review
          </h3>
          <label className="block text-sm mb-1">Stars:</label>
          <select
            className="w-full mb-2 p-2 rounded-md border dark:bg-zinc-700"
            value={editStars}
            onChange={(e) => setEditStars(Number(e.target.value))}
          >
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>
                {n} Stars
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
              onClick={() => setEditing(null)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
