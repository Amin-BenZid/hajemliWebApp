import { useLocation, useNavigate } from "react-router-dom";
import { Home, CalendarDays, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, role } = useAuth();

  const handleHomeClick = () => {
    if (role === "client" && user && user.shop_id) {
      navigate(`/shop/${user.shop_id}`);
    } else {
      navigate("/");
    }
  };

  const navItems = [
    { label: "Home", icon: <Home />, onClick: handleHomeClick },
    { label: "Appointments", icon: <CalendarDays />, path: "/appointments" },
    { label: "Profile", icon: <User />, path: "/profile" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-700 shadow-md z-50">
      <div className="flex justify-around py-3">
        {navItems.map((item) => {
          const isActive = item.path ? location.pathname === item.path : false;

          return (
            <button
              key={item.label}
              onClick={item.onClick ? item.onClick : () => navigate(item.path)}
              className={`flex flex-col items-center text-xs font-medium ${
                isActive
                  ? "text-black dark:text-white"
                  : "text-zinc-400 dark:text-zinc-500"
              }`}
            >
              <div className="w-6 h-6">{item.icon}</div>
              <span className="mt-1">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
