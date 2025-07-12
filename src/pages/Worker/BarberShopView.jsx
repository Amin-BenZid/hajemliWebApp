import { useState, useEffect } from "react";
import { Star, MapPin, Pencil, Users, Flag, Calendar, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import OwnerBottomNav from "../../components/ShopOwnerBottomNav";
import { useAuth } from "../../context/AuthContext";
import { fetchShopByOwnerId, fetchShopById, fetchShopReviews, fetchClientByUserId } from "../../services/api";

export default function BarberShopView() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [userNames, setUserNames] = useState({}); // user_id -> name

  const handleReport = (id) => {
    alert(`Reported review ID: ${id}`);
  };

  useEffect(() => {
    const fetchShop = async () => {
      if (!user?.owner_id) return;
      setLoading(true);
      setError("");
      try {
        // 1. Get shop_id from owner_id
        const ownerShop = await fetchShopByOwnerId(user.owner_id);
        if (!ownerShop.shop_id) {
          setShop(null);
          setLoading(false);
          return;
        }
        // 2. Get full shop details
        const shopDetails = await fetchShopById(ownerShop.shop_id);
        setShop(shopDetails);
        // 3. Fetch reviews
        setReviewsLoading(true);
        try {
          const shopReviews = await fetchShopReviews(ownerShop.shop_id);
          setReviews(shopReviews);
        } catch {
          setReviews([]);
        }
        setReviewsLoading(false);
      } catch (err) {
        setError("Failed to load shop details.");
        setShop(null);
      }
      setLoading(false);
    };
    fetchShop();
  }, [user]);

  // Fetch user names for reviews
  useEffect(() => {
    const fetchNames = async () => {
      const idsToFetch = reviews
        .map((r) => r.user_id)
        .filter((id) => id && !userNames[id]);
      if (idsToFetch.length === 0) return;
      const newNames = {};
      for (const id of idsToFetch) {
        try {
          const user = await fetchClientByUserId(id);
          newNames[id] = user.first_name ? `${user.first_name} ${user.last_name || ""}`.trim() : id;
        } catch {
          newNames[id] = "Anonymous";
        }
      }
      setUserNames((prev) => ({ ...prev, ...newNames }));
    };
    if (reviews.length > 0) fetchNames();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reviews]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;
  if (!shop) return <div className="min-h-screen flex items-center justify-center">No shop found.</div>;

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900 dark:text-white pb-28">
      {/* Cover Image */}
      <OwnerBottomNav />
      <div className="h-48 w-full relative">
        <img src={shop.coverImage} alt="cover" className="h-full w-full object-cover" />
        <div className="absolute bottom-[-32px] left-4 rounded-full border-4 border-white dark:border-zinc-900 overflow-hidden w-20 h-20">
          <img
            src={shop.profilePicture}
            alt="profile"
            className="object-cover w-full h-full"
          />
        </div>
      </div>

      <div className="p-4 space-y-4 mt-6">
        {/* Shop Info */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">{shop.shop_name}</h1>
            <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
              <MapPin className="w-4 h-4" />
              {shop.localisation}
            </div>
            <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 space-y-0.5">
              <div className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 mr-1" />
                <span>Day off: <span className="font-medium">{shop.day_off || 'N/A'}</span></span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 mr-1" />
                <span>Working hours: <span className="font-medium">{shop.work_hours || 'N/A'}</span></span>
              </div>
              <div className="flex items-center gap-1 mt-1">
                <Star className="w-3.5 h-3.5 mr-1 text-yellow-400 fill-yellow-400" />
                <span>Rating: <span className="font-medium">{typeof shop.rating === 'number' ? shop.rating.toFixed(1) : 'N/A'}</span></span>
              </div>
            </div>
          </div>
          <button
            onClick={() => navigate("/owner/shopsettings")}
            className="bg-black dark:bg-white text-white dark:text-black px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1"
          >
            <Pencil className="w-4 h-4" />
            Edit
          </button>
        </div>

        {/* Showcase Images (optional, fallback to cover/profile if not available) */}
        <div className="grid grid-cols-2 gap-2">
          {shop.coverImage && (
            <img
              src={shop.coverImage}
              alt="cover"
              className="rounded-lg w-full h-32 object-cover"
            />
          )}
          {shop.profilePicture && (
            <img
              src={shop.profilePicture}
              alt="profile"
              className="rounded-lg w-full h-32 object-cover"
            />
          )}
        </div>

        {/* Reviews */}
        <div className="bg-white dark:bg-zinc-800 rounded-xl p-4 shadow-sm space-y-3">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Star className="w-5 h-5" />
            Shop Reviews
          </h2>
          {reviewsLoading ? (
            <div className="text-sm text-zinc-500">Loading reviews...</div>
          ) : reviews.length === 0 ? (
            <div className="text-sm text-zinc-500 text-center py-2">No reviews yet.</div>
          ) : (
            reviews.map((review) => (
              <div key={review._id} className="border-b pb-2 dark:border-zinc-700">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium">{userNames[review.user_id] || "Anonymous"}</span>
                  <div className="flex items-center gap-1">
                    {Array(Math.floor(review.nb_stars))
                      .fill()
                      .map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      ))}
                    {review.nb_stars % 1 !== 0 && (
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 opacity-60" />
                    )}
                    {Array(5 - Math.ceil(review.nb_stars))
                      .fill()
                      .map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-zinc-400" />
                      ))}
                  </div>
                </div>
                <p className="text-sm text-zinc-600 dark:text-zinc-300">{review.comment}</p>
                {/* Optionally, add a report button here */}
              </div>
            ))
          )}
        </div>

        {/* Team Access */}
        <button
          onClick={() => navigate("/owner/team")}
          className="bg-zinc-100 dark:bg-zinc-800 text-black dark:text-white w-full flex items-center justify-center gap-2 py-3 rounded-xl font-medium"
        >
          <Users className="w-4 h-4" />
          View Team
        </button>
      </div>
    </div>
  );
}
