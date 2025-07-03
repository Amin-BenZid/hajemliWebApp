import { useState } from "react";
import { MapPin, LogOut } from "lucide-react";
import BarberBottomNav from "../../components/BarberBottomNav";

export default function BarberShopPage() {
  const [showConfirmLeave, setShowConfirmLeave] = useState(false);

  const shop = {
    name: "Elite Cuts Lounge",
    address: "15 Rue des Coiffeurs, Sousse",
    image: "https://images.unsplash.com/photo-1519413847747-c0d4b47e5046",
    barbers: [
      {
        id: "b1",
        name: "Youssef Amara",
        image: "https://randomuser.me/api/portraits/men/75.jpg",
      },
      {
        id: "b2",
        name: "Khaled Slim",
        image: "https://randomuser.me/api/portraits/men/65.jpg",
      },
      {
        id: "b3",
        name: "Hamza Zitoun",
        image: "https://randomuser.me/api/portraits/men/35.jpg",
      },
    ],
  };

  return (
    <div className=" pb-20 pt-14 min-h-screen bg-white dark:bg-zinc-900 text-black dark:text-white p-5">
      <div className="max-w-xl mx-auto space-y-6">
        <BarberBottomNav />
        {/* Shop Card */}
        <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-md overflow-hidden">
          <img src={shop.image} alt="Shop" className="w-full h-44 object-cover" />
          <div className="p-5 space-y-2">
            <h1 className="text-xl font-bold">{shop.name}</h1>
            <p className="flex items-center text-sm text-zinc-500 dark:text-zinc-400 gap-1">
              <MapPin size={14} /> {shop.address}
            </p>

            <button
              onClick={() => setShowConfirmLeave(true)}
              className="mt-4 w-full text-center text-sm py-2 bg-red-600 text-white rounded-xl"
            >
              <LogOut size={16} className="inline-block mr-1" />
              Leave Shop
            </button>
          </div>
        </div>

        {/* Barbers Row */}
        <div>
          <h2 className="text-base font-semibold mb-2">Other Barbers</h2>
          <div className="flex gap-4 overflow-x-auto pb-1">
            {shop.barbers.map((b) => (
              <div key={b.id} className="text-center min-w-[80px]">
                <img
                  alt="img"
                  src={b.image}
                  className="w-14 h-14 rounded-full border mx-auto dark:border-zinc-700"
                />
                <p className="text-xs mt-1 truncate">{b.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Confirm Modal */}
      {showConfirmLeave && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-zinc-800 rounded-xl p-6 w-full max-w-sm shadow-xl space-y-4">
            <h3 className="text-lg font-semibold">Confirm Leaving</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Are you sure you want to leave <strong>{shop.name}</strong>?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirmLeave(false)}
                className="text-sm text-zinc-500"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  console.log("Barber left the shop.");
                  setShowConfirmLeave(false);
                }}
                className="bg-red-600 text-white px-4 py-2 rounded-xl text-sm"
              >
                Leave
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
