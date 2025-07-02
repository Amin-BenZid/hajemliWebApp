import { Home, CalendarDays, Briefcase, Building2, ChartBarBig } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

export default function BarberBottomNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <nav className="fixed  bottom-0 left-0 right-0 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-700 flex justify-around items-center py-2 z-50">
      {/* Profile */}
      <NavItem
        label="Profile"
        icon={<Home size={20} />}
        path="/barber/profile"
        active={pathname === "/barber/profile"}
        onClick={() => navigate("/barber/profile")}
      />

      {/* Services */}
      <NavItem
        label="Dashboard"
        icon={<ChartBarBig size={20} />}
        path="/barber/dashboard"
        active={pathname === "/barber/dashboard"}
        onClick={() => navigate("/barber/dashboard")}
      />

      {/* Center - Appointments */}
      <button
        onClick={() => navigate("/barber/appointments")}
        className={`bg-black dark:bg-white text-white dark:text-black p-4 rounded-full shadow-md -mt-8 border-4 border-white dark:border-zinc-900`}
      >
        <CalendarDays size={24} />
      </button>

      {/* Shop */}
      <NavItem
        label="Shop"
        icon={<Building2 size={20} />}
        path="/barber/shop"
        active={pathname === "/barber/shop"}
        onClick={() => navigate("/barber/shop")}
      />

      {/* Find Job */}
      <NavItem
        label="Find Job"
        icon={<Briefcase size={20} />}
        path="/barber/jobs"
        active={pathname === "/barber/jobs"}
        onClick={() => navigate("/barber/jobs")}
      />
    </nav>
  );
}

function NavItem({ label, icon, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center text-xs ${
        active
          ? "text-black dark:text-white font-semibold"
          : "text-zinc-400 dark:text-zinc-500"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
