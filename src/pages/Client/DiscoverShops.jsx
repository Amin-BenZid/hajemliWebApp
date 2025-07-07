// DiscoverShops.jsx
import { useState, useEffect } from "react";
import ShopCard from "../../components/ShopCard";
import BottomNav from "../../components/BottomNav";
import { useNavigate } from "react-router-dom";
import { Key, Search } from "lucide-react";
import { motion } from "framer-motion";
import { fetchShops, updateClientShop } from "../../services/api";

export default function DiscoverShops() {
  const [code, setCode] = useState("");
  const [area, setArea] = useState("");
  const [type, setType] = useState("");
  const [loading, setLoading] = useState(false);
  const [shops, setShops] = useState([]);
  const [error, setError] = useState(null);
  const [filteredShops, setFilteredShops] = useState([]);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const shopsPerPage = 4;
  const [enterShopError, setEnterShopError] = useState("");

  // Calculate paginated shops
  const indexOfLastShop = currentPage * shopsPerPage;
  const indexOfFirstShop = indexOfLastShop - shopsPerPage;
  const currentShops = filteredShops.slice(indexOfFirstShop, indexOfLastShop);
  const totalPages = Math.ceil(filteredShops.length / shopsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    setLoading(true);
    fetchShops()
      .then((data) => {
        setShops(data);
        setFilteredShops(data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load shops");
        setLoading(false);
      });
  }, []);

  const handleCodeSubmit = async (e) => {
    e.preventDefault();
    setEnterShopError("");
    const client = JSON.parse(localStorage.getItem("user"));
    if (!client?.client_id) {
      setEnterShopError("You must be logged in as a client to enter a shop.");
      return;
    }
    if (!code) {
      setEnterShopError("Please enter a shop code.");
      return;
    }
    try {
      await updateClientShop(client.client_id, code);
      navigate(`/shop/${code}`);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setEnterShopError("There is no shop with this code.");
      } else {
        setEnterShopError("Failed to enter shop. Please try again.");
      }
    }
  };

  const handleSearch = () => {
    setLoading(true);
    setTimeout(() => {
      let filtered = shops;
      if (area) {
        filtered = filtered.filter((shop) => shop.area === area);
      }
      if (type) {
        filtered = filtered.filter((shop) => shop.type === type);
      }
      setFilteredShops(filtered);
      setLoading(false);
    }, 300);
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
    <motion.div
      className="min-h-screen bg-white dark:bg-zinc-900 text-black dark:text-white transition-colors duration-300 p-6 pt-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <BottomNav />
      <div className="w-full max-w-5xl mx-auto">
        <motion.h1
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="text-3xl font-bold text-center text-zinc-800 dark:text-white mb-8"
        >
          Hajemli
        </motion.h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* LEFT SIDE */}
          <motion.div
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <motion.form
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onSubmit={handleCodeSubmit}
              className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 p-6 rounded-2xl shadow-md space-y-4"
            >
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Key size={18} /> Enter Shop Code
              </h2>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="e.g. X2B9F"
                className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-700 text-black dark:text-white rounded-xl focus:ring-2 focus:ring-black dark:focus:ring-white"
              />
              <button
                type="submit"
                className="w-full bg-black dark:bg-white text-white dark:text-black py-2 rounded-xl hover:opacity-90 transition"
              >
                Enter Shop
              </button>
              {enterShopError && (
                <div className="text-red-500 mt-2 text-sm">{enterShopError}</div>
              )}
            </motion.form>

            <motion.div
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 p-6 rounded-2xl shadow-md space-y-4"
            >
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Search size={18} /> Discover Shops
              </h2>

              <select
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="w-full px-4 py-2 border rounded-xl dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-700 text-black dark:text-white"
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
                className="w-full px-4 py-2 border rounded-xl dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-700 text-black dark:text-white"
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

          {/* RIGHT SIDE – SHOPS */}
          <motion.div
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <motion.h2
              animate={{
                textShadow: "0 0 6px rgba(255,255,255,0.5)",
              }}
              className="text-lg font-semibold text-zinc-700 dark:text-white mb-4"
            >
              Recommended Shops
            </motion.h2>
            <div className="space-y-3 pb-16">
              {loading ? (
                <>
                  <ShimmerCard />
                  <ShimmerCard />
                  <ShimmerCard />
                </>
              ) : error ? (
                <div className="text-red-500">{error}</div>
              ) : filteredShops.length === 0 ? (
                <div>No shops found.</div>
              ) : (
                <>
                  {currentShops.map((shop, idx) => (
                    <motion.div
                      key={shop._id || idx}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="transition-transform duration-200"
                    >
                      <ShopCard
                        shop={{
                          name: shop.shop_name,
                          area: shop.area,
                          type: shop.type,
                          code: shop.shop_id,
                          rating: shop.rating,
                          image: shop.profilePicture,
                        }}
                        onView={async () => {
                          const client = JSON.parse(localStorage.getItem("user"));
                          if (!client?.client_id) {
                            alert("You must be logged in as a client to select a shop.");
                            return;
                          }
                          try {
                            await updateClientShop(client.client_id, shop.shop_id);
                            navigate(`/shop/${shop.shop_id}`);
                          } catch (err) {
                            alert("Failed to update your selected shop. Please try again.");
                          }
                        }}
                      />
                    </motion.div>
                  ))}
                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div className="flex justify-center mt-4 gap-2">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-3 py-1 rounded-full border text-sm transition-colors ${
                            page === currentPage
                              ? "bg-black text-white dark:bg-white dark:text-black border-black dark:border-white"
                              : "bg-zinc-200 dark:bg-zinc-700 text-black dark:text-white border-zinc-300 dark:border-zinc-600 hover:bg-zinc-300 dark:hover:bg-zinc-600"
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
