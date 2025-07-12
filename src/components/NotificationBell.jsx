import { useEffect, useState, useRef } from "react";
import { Bell, CheckCircle, Circle } from "lucide-react";
import { fetchNotifications, fetchShopByOwnerId } from "../services/api";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

export default function NotificationBell() {
  const { user, role } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [shopId, setShopId] = useState(null);
  const dropdownRef = useRef(null);

  // Fetch shopId for owner
  useEffect(() => {
    async function getShopId() {
      if (role === "owner" && user?.owner_id) {
        const shop = await fetchShopByOwnerId(user.owner_id);
        setShopId(shop.shop_id);
      }
    }
    getShopId();
  }, [user, role]);

  // Poll notifications every 10 seconds
  useEffect(() => {
    let interval;
    async function loadNotifications() {
      setLoading(true);
      try {
        const data = await fetchNotifications();
        // Filter by role
        let filtered = [];
        if (role === "client") {
          filtered = data.filter(n => n.client_id === user?.client_id || n.client_id === user?._id);
        } else if (role === "worker") {
          filtered = data.filter(n => n.barber_id === user?.barber_id || n.barber_id === user?._id);
        } else if (role === "owner") {
          if (shopId) {
            filtered = data.filter(n => n.shop_id === shopId && n.isOwner === true);
          }
        }
        setNotifications(filtered);
      } catch {}
      setLoading(false);
    }
    loadNotifications();
    interval = setInterval(loadNotifications, 10000);
    return () => clearInterval(interval);
  }, [user, role, shopId]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const unreadCount = notifications.filter(n => !n.read).length;
  const displayCount = unreadCount > 9 ? "9+" : unreadCount;

  async function handleSetRead(id, read) {
    try {
      await api.patch(`/notifications/${id}/set-read`, { read });
      setNotifications((prev) => prev.map(n => n._id === id ? { ...n, read } : n));
    } catch (e) {
      alert("Failed to update notification status.");
    }
  }

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        className="relative"
        onClick={() => setOpen((v) => !v)}
        aria-label="Show notifications"
      >
        <Bell size={24} className="text-zinc-700 dark:text-white" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
            {displayCount}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-lg z-50 p-2">
          <h3 className="font-bold text-lg mb-2 px-2">Notifications</h3>
          {loading ? (
            <div className="text-center text-zinc-500 py-6">Loading...</div>
          ) : notifications.length === 0 ? (
            <div className="text-center text-zinc-500 py-6">No notifications.</div>
          ) : (
            <ul className="space-y-2">
              {notifications.map((n) => (
                <li
                  key={n._id}
                  className={`p-3 rounded-lg cursor-pointer transition border dark:border-zinc-700 ${n.read ? "bg-zinc-100 dark:bg-zinc-800" : "bg-blue-50 dark:bg-blue-900 border-blue-200 dark:border-blue-700"}`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold">{n.title}</div>
                      <div className="text-xs text-zinc-500 dark:text-zinc-400">{n.text}</div>
                      <div className="text-[10px] text-zinc-400 mt-1">{new Date(n.date).toLocaleString()}</div>
                    </div>
                    <button
                      className={`ml-2 flex items-center gap-1 text-xs px-2 py-1 rounded ${n.read ? "bg-green-100 text-green-700" : "bg-zinc-200 text-zinc-700"}`}
                      onClick={() => handleSetRead(n._id, !n.read)}
                      title={n.read ? "Mark as unread" : "Mark as read"}
                    >
                      {n.read ? <CheckCircle size={16} /> : <Circle size={16} />} {n.read ? "Read" : "Unread"}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
