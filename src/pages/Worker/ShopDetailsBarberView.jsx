import { useParams } from "react-router-dom";
import BarberCard from "../../components/BarberCard";
import { useEffect, useState } from "react";
// import axios from "axios";
import { Phone, Clock, CalendarDays, Star } from "lucide-react";
import BarberBottomNav from "../../components/BarberBottomNav";

export default function ShopDetailsBarber() {
  const { code } = useParams();
  const [shop, setShop] = useState(null);
  const [gallery, setGallery] = useState([]);
  const [barbers, setBarbers] = useState([]);

  useEffect(() => {
    // simulate fetching
    const fetchedShop = {
      shop_id: code,
      shop_name: "Barber & Blade",
      localisation: "Tunis",
      number: "+216 12 345 678",
      rating: 4.8,
      work_hours: "09:00 - 18:00",
      day_off: "Sunday",
      profilePicture: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600",
      coverImage: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600",
    };
    const fetchedGallery = [
      "https://images.unsplash.com/photo-1603311686008-81cdb3f22096?w=600",
      "https://images.unsplash.com/photo-1577454825397-eef3c8cdd843?w=600",
    ];
    const fetchedBarbers = [
      { id: "b1", name: "Amine", image: fetchedShop.coverImage, rating: 4.9 },
      { id: "b2", name: "Karim", image: fetchedShop.coverImage, rating: 4.7 },
    ];
    setShop(fetchedShop);
    setGallery(fetchedGallery);
    setBarbers(fetchedBarbers);
  }, [code]);

  if (!shop) return <div>Loading...</div>;

  const handleApply = () => {
    console.log(`Applying to shop ${shop.shop_id}`);
    // TODO: logic to apply
  };

  return (
    <div className="min-h-screen pb-20 bg-white dark:bg-zinc-900 text-black dark:text-white">
      <BarberBottomNav />
      <div className="relative">
        <img
          src={shop.coverImage}
          alt={shop.shop_name}
          className="w-full h-64 object-cover"
        />
        <button
          onClick={handleApply}
          className="absolute top-4 left-4 bg-green-600 text-white px-4 py-2 rounded-xl shadow-lg hover:opacity-90"
        >
          Apply for Job
        </button>
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end p-6 pb-14">
          <div>
            <h1 className="text-3xl font-bold text-white">{shop.shop_name}</h1>
            <p className="text-gray-200 text-sm">{shop.localisation}</p>
          </div>
        </div>
        <img
          src={shop.profilePicture}
          alt="shop logo"
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

        {gallery.length > 0 && (
          <>
            <h2 className="text-xl font-semibold mt-8 mb-4">Shop Gallery</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              {gallery.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`Shop ${i + 1}`}
                  className="rounded-xl object-cover h-40 w-full shadow"
                />
              ))}
            </div>
          </>
        )}

        <h2 className="text-xl font-semibold mt-4 mb-4">Team & Ratings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {barbers.map((barber) => (
            <BarberCard key={barber.id} barber={barber} />
          ))}
        </div>
      </div>
    </div>
  );
}
