import { useEffect, useState } from "react";
import { Bell, Star, Briefcase, CalendarCheck, Store, ArrowRight } from "lucide-react";
import ShopOwnerBottomNav from "../../components/ShopOwnerBottomNav";
import { fetchNotifications, fetchShopByOwnerId } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

export default function OwnerNotificationsPage() {
  const { user, role } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [shopId, setShopId] = useState(null);

  useEffect(() => {
    async function getShopId() {
      if (role === "owner" && user?.owner_id) {
        const shop = await fetchShopByOwnerId(user.owner_id);
        setShopId(shop.shop_id);
      }
    }
    getShopId();
  }, [user, role]);

  useEffect(() => {
    if (!shopId) return;
    let interval;
    async function loadNotifications() {
      try {
        const data = await fetchNotifications();
        // Only show notifications where shop_id matches and isOwner is true
        const filtered = data.filter(n => n.shop_id === shopId && n.isOwner === true);
        setNotifications(filtered);
      } catch (e) {
        console.error('Error loading notifications:', e);
      }
    }
    loadNotifications();
    interval = setInterval(loadNotifications, 10000);
    return () => clearInterval(interval);
  }, [shopId]);

  const getIcon = (n) => {
    if (n.title?.toLowerCase().includes("job")) return <Briefcase size={20} className="text-blue-500" />;
    if (n.title?.toLowerCase().includes("appointment")) return <CalendarCheck size={20} className="text-green-500" />;
    if (n.title?.toLowerCase().includes("review")) return <Star size={20} className="text-yellow-500" />;
    if (n.title?.toLowerCase().includes("shop")) return <Store size={20} className="text-purple-500" />;
    return <Bell size={20} />;
  };

  

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900 text-black dark:text-white px-6 pt-10 pb-24">
      <ShopOwnerBottomNav />
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Bell size={24} /> Notifications
      </h1>
      {notifications.length === 0 ? (
        <p className="text-sm text-center text-zinc-500 mt-10">
          No notifications right now.
        </p>
      ) : (
        <div className="space-y-4">
          {notifications.map((n) => (
            <div
              key={n._id}
              className={`p-4 rounded-xl border shadow flex items-start justify-between gap-4 transition ${n.read ? "bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700" : "bg-blue-50 dark:bg-blue-900 border-blue-200 dark:border-blue-700"}`}
            >
              <div className="flex gap-3">
                <div>{getIcon(n)}</div>
                <div>
                  <p className="font-medium">{n.title}</p>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">{n.text}</p>
                  <p className="text-xs text-zinc-400 mt-1">
                    {new Date(n.date).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                {n.title?.toLowerCase().includes("job") && n.shop_id && (
                  <a
                    href={`/shop/${n.shop_id}`}
                    className="text-sm text-blue-600 hover:underline flex items-center"
                  >
                    View Offer <ArrowRight size={14} className="ml-1" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 