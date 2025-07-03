import { useState } from "react";
import { Star, MapPin, Pencil, Users, Flag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import OwnerBottomNav from "../../components/ShopOwnerBottomNav";

export default function BarberShopView() {
  const navigate = useNavigate();
  const [shop] = useState({
    name: "Hajemli Studio",
    address: "123 Main Street, Sousse",
    coverImg: "/shop-cover.jpg",
    profileImg: "/shop-profile.jpg",
    showcaseImages: ["/shop1.jpg", "/shop2.jpg", "/shop3.jpg", "/shop4.jpg"],
  });

  const [reviews] = useState([
    {
      id: 1,
      user: "Ahmed B.",
      stars: 5,
      comment: "Great vibe and amazing haircut!",
    },
    {
      id: 2,
      user: "Sara K.",
      stars: 4,
      comment: "Clean shop and friendly staff.",
    },
  ]);

  const handleReport = (id) => {
    alert(`Reported review ID: ${id}`);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900 dark:text-white pb-28">
      {/* Cover Image */}
      <OwnerBottomNav />
      <div className="h-48 w-full relative">
        <img src={shop.coverImg} alt="cover" className="h-full w-full object-cover" />
        <div className="absolute bottom-[-32px] left-4 rounded-full border-4 border-white dark:border-zinc-900 overflow-hidden w-20 h-20">
          <img
            src={shop.profileImg}
            alt="profile"
            className="object-cover w-full h-full"
          />
        </div>
      </div>

      <div className="p-4 space-y-4 mt-6">
        {/* Shop Info */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">{shop.name}</h1>
            <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
              <MapPin className="w-4 h-4" />
              {shop.address}
            </div>
          </div>
          <button
            onClick={() => navigate("/owner/settings")}
            className="bg-black dark:bg-white text-white dark:text-black px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1"
          >
            <Pencil className="w-4 h-4" />
            Edit
          </button>
        </div>

        {/* Showcase Images */}
        <div className="grid grid-cols-2 gap-2">
          {shop.showcaseImages.map((img, i) => (
            <img
              key={i}
              src={img}
              alt={`shop-${i}`}
              className="rounded-lg w-full h-32 object-cover"
            />
          ))}
        </div>

        {/* Reviews */}
        <div className="bg-white dark:bg-zinc-800 rounded-xl p-4 shadow-sm space-y-3">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Star className="w-5 h-5" />
            Shop Reviews
          </h2>
          {reviews.map((review) => (
            <div key={review.id} className="border-b pb-2 dark:border-zinc-700">
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium">{review.user}</span>
                <div className="flex items-center gap-1">
                  {Array(review.stars)
                    .fill()
                    .map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    ))}
                  {Array(5 - review.stars)
                    .fill()
                    .map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-zinc-400" />
                    ))}
                </div>
              </div>
              <p className="text-sm text-zinc-600 dark:text-zinc-300">{review.comment}</p>
              <button
                onClick={() => handleReport(review.id)}
                className="text-xs text-red-500 flex items-center gap-1 mt-1 hover:underline"
              >
                <Flag className="w-3 h-3" />
                Report
              </button>
            </div>
          ))}
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
