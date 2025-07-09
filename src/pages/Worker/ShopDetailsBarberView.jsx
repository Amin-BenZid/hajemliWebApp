import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import { Phone, Clock, CalendarDays, Star } from "lucide-react";
import BarberBottomNav from "../../components/BarberBottomNav";
import { fetchShopDetailsByBarberId, fetchBarberById } from "../../services/api";
import BarberCardWorker from "./BarberCardWorker";

export default function ShopDetailsBarber() {
  const { user, role, loading: authLoading } = useAuth();
  const [shop, setShop] = useState(null);
  const [barbers, setBarbers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        // Only proceed if user and role are loaded and role is worker
        if (!authLoading && user && (role === "worker") && (user.barber_id || user._id || user.id)) {
          const barberId = user.barber_id || user._id || user.id;
          const shopData = await fetchShopDetailsByBarberId(barberId);
          setShop(shopData);
          // Fetch barber details for each barber ID
          const barberDetails = await Promise.all(
            (shopData.barbers || []).map(async (barberId) => {
              const barber = await fetchBarberById(barberId);
              return {
                barber_id: barber.barber_id || barber._id || barber.id || barberId,
                name: barber.name || "Unknown",
                image: barber.profile_image || shopData.profilePicture,
                rating: barber.rating || 0,
              };
            })
          );
          setBarbers(barberDetails);
        }
      } catch (err) {
        setShop(null);
      }
      setLoading(false);
    }
    fetchData();
  }, [user, role, authLoading]);

  if (authLoading || loading) return <div>Loading...</div>;
  if (!shop) return <div>Shop not found.</div>;

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

        <h2 className="text-xl font-semibold mt-4 mb-4">Team & Ratings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {barbers.map((barber) => (
            <BarberCardWorker key={barber.barber_id} barber={barber} />
          ))}
        </div>
      </div>
    </div>
  );
}
