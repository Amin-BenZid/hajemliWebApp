import { useState } from "react";
import ShopCard from "../components/ShopCard";
import BottomNav from "../components/BottomNav";
import { useNavigate } from "react-router-dom";
import { Key, Search } from "lucide-react";
import { motion } from "framer-motion";

export default function DiscoverShops() {
  const [code, setCode] = useState("");
  const [area, setArea] = useState("");
  const [type, setType] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleCodeSubmit = (e) => {
    e.preventDefault();
    console.log("Submit code:", code);
  };

  const handleSearch = () => {
    setLoading(true);

    // simulate a fake API/filter delay
    setTimeout(() => {
      console.log("Search by:", area, type);
      setLoading(false);
    }, 1500);
  };

  const mockShops = [
    {
      name: "Barber & Blade",
      area: "Tunis",
      type: "Barber",
      code: "TUNX45",
      rating: 4.8,
      image:
        "https://plus.unsplash.com/premium_photo-1682090689948-2c8b24f501b7?w=600&auto=format&fit=crop&q=60",
    },
    {
      name: "Glow & Go",
      area: "Sousse",
      type: "Nails",
      code: "SOU88N",
      rating: 4.6,
      image:
        "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=600&auto=format&fit=crop&q=60",
    },
    {
      name: "Le Chic Salon",
      area: "Sfax",
      type: "Hair Salon",
      code: "SFXHC9",
      rating: 4.9,
      image:
        "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&auto=format&fit=crop&q=60",
    },
    {
      name: "The Gentleman's Cut",
      area: "Tunis",
      type: "Barber",
      code: "TUNGC7",
      rating: 4.7,
      image:
        "https://plus.unsplash.com/premium_photo-1661766497086-11618033d1e9?w=600&auto=format&fit=crop&q=60",
    },
    {
      name: "Nailvana",
      area: "Monastir",
      type: "Nails",
      code: "MONN11",
      rating: 4.5,
      image:
        "https://images.unsplash.com/photo-1560869713-bf165a9cfac1?w=600&auto=format&fit=crop&q=60",
    },
  ];
  const ShimmerCard = () => (
    <div className="animate-pulse bg-white dark:bg-zinc-800 p-4 rounded-2xl border dark:border-zinc-700 flex gap-4 items-center">
      <div className="w-16 h-16 bg-zinc-300 dark:bg-zinc-700 rounded-xl"></div>
      <div className="flex-1 space-y-2">
        <div className="h-4 w-3/4 bg-zinc-300 dark:bg-zinc-700 rounded"></div>
        <div className="h-3 w-1/2 bg-zinc-300 dark:bg-zinc-700 rounded"></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900 text-black dark:text-white transition-colors duration-300 p-6 pt-12">
      <BottomNav />
      <div className="w-full max-w-5xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-bold text-center text-zinc-800 dark:text-white mb-8"
        >
          Hajemli
        </motion.h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Side */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="space-y-6"
          >
            <motion.form
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onSubmit={handleCodeSubmit}
              className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 p-6 rounded-2xl shadow-md space-y-4 transition-colors"
            >
              <h2 className="text-lg font-semibold text-zinc-700 dark:text-white flex items-center gap-2">
                <Key size={18} /> Enter Shop Code
              </h2>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="e.g. X2B9F"
                className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-700 text-black dark:text-white rounded-xl focus:ring-2 focus:ring-black dark:focus:ring-white"
                required
              />
              <button
                type="submit"
                className="w-full bg-black dark:bg-white text-white dark:text-black py-2 rounded-xl hover:opacity-90 transition"
              >
                Enter Shop
              </button>
            </motion.form>

            <motion.div
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 p-6 rounded-2xl shadow-md space-y-4 transition-colors"
            >
              <h2 className="text-lg font-semibold text-zinc-700 dark:text-white flex items-center gap-2">
                <Search size={18} /> Discover Shops
              </h2>

              <select
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-700 text-black dark:text-white rounded-xl"
              >
                <option value="">Select Area</option>
                <option value="Tunis">Tunis</option>
                <option value="Sousse">Sousse</option>
                <option value="Sfax">Sfax</option>
                <option value="Monastir">Monastir</option>
              </select>

              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-700 text-black dark:text-white rounded-xl"
              >
                <option value="">Select Type</option>
                <option value="Barber">Barber</option>
                <option value="Hair Salon">Hair Salon</option>
                <option value="Nails">Nails</option>
              </select>

              <button
                onClick={handleSearch}
                className="w-full bg-black dark:bg-white text-white dark:text-black py-2 rounded-xl hover:opacity-90 transition"
              >
                Search
              </button>
            </motion.div>
          </motion.div>

          {/* Right Side – Recommended Shops */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <h2 className="text-lg font-semibold text-zinc-700 dark:text-white mb-4">
              Recommended Shops
            </h2>
            <div className="space-y-3 pb-16">
              {loading ? (
                <>
                  <ShimmerCard />
                  <ShimmerCard />
                  <ShimmerCard />
                </>
              ) : (
                mockShops.map((shop, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ scale: 1.015 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ShopCard shop={shop} onView={() => navigate(`/shop/${shop.code}`)} />
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
