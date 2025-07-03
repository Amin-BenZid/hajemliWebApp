import {
  BarChart2,
  Home,
  Users,
  CalendarDays,
  Settings,
  Store,
  LayoutDashboard,
  User,
  Briefcase,
  LineChart,
  Settings2,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function OwnerBottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const [openDropdown, setOpenDropdown] = useState(null);
  const dropdownRef = useRef();

  const isActive = (path) => location.pathname === path;
  const isSubActive = (path) => location.pathname.startsWith(path);

  const handleDropdownClick = (key) => {
    setOpenDropdown((prev) => (prev === key ? null : key));
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-zinc-900 shadow-xl border-t border-zinc-200 dark:border-zinc-800">
      <div
        className="flex justify-between items-center px-6 py-3 relative"
        ref={dropdownRef}
      >
        {/* Home Dropdown */}
        <div className="relative">
          <button
            onClick={() => handleDropdownClick("home")}
            className={`flex flex-col items-center gap-1 text-xs ${
              isSubActive("/owner/dashboard")
                ? "text-black dark:text-white font-semibold"
                : "text-zinc-400"
            }`}
          >
            <Home size={22} />
            <span>Home</span>
          </button>
          <AnimatePresence>
            {openDropdown === "home" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute bottom-14 left-[-10%] -translate-x-1/2 bg-white dark:bg-zinc-800 rounded-lg shadow-md p-2 space-y-1 z-50"
              >
                <DropdownItem
                  label="Shop"
                  icon={Store}
                  onClick={() => navigate("/owner/shop")}
                  active={isActive("/owner/shop")}
                />
                <DropdownItem
                  label="Dashboard"
                  icon={LayoutDashboard}
                  onClick={() => navigate("/owner/dashboard")}
                  active={isActive("/owner/dashboard")}
                />
                <DropdownItem
                  label="Profile"
                  icon={User}
                  onClick={() => navigate("/owner/profile")}
                  active={isActive("/owner/profile")}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Team Dropdown */}
        <div className="relative">
          <button
            onClick={() => handleDropdownClick("team")}
            className={`flex flex-col items-center gap-1 text-xs ${
              isSubActive("/owner/team") || isSubActive("/owner/joboffers")
                ? "text-black dark:text-white font-semibold"
                : "text-zinc-400"
            }`}
          >
            <Users size={22} />
            <span>Team</span>
          </button>
          <AnimatePresence>
            {openDropdown === "team" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute bottom-14 left-1/2 -translate-x-1/2 bg-white dark:bg-zinc-800 rounded-lg shadow-md p-2 space-y-1 z-50"
              >
                <DropdownItem
                  label="Team"
                  icon={Users}
                  onClick={() => navigate("/owner/team")}
                  active={isActive("/owner/team")}
                />
                <DropdownItem
                  label="Job Offers"
                  icon={Briefcase}
                  onClick={() => navigate("/owner/joboffers")}
                  active={isActive("/owner/joboffers")}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Center Calendar Button */}
        <button
          onClick={() => navigate("/owner/appointments")}
          className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-black dark:bg-white text-white dark:text-black w-14 h-14 rounded-full flex items-center justify-center shadow-md border-4 border-white dark:border-zinc-900"
        >
          <CalendarDays size={26} />
        </button>

        {/* Analytics Dropdown */}
        <div className="relative">
          <button
            onClick={() => handleDropdownClick("analytics")}
            className={`flex flex-col items-center gap-1 text-xs ${
              isSubActive("/owner/analytics")
                ? "text-black dark:text-white font-semibold"
                : "text-zinc-400"
            }`}
          >
            <BarChart2 size={22} />
            <span>Analytics</span>
          </button>
          <AnimatePresence>
            {openDropdown === "analytics" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute bottom-14 left-1/2 -translate-x-1/2 bg-white dark:bg-zinc-800 rounded-lg shadow-md p-2 space-y-1 z-50"
              >
                <DropdownItem
                  label="Shop Analytics"
                  icon={BarChart2}
                  onClick={() => navigate("/owner/shopanalytics")}
                  active={isActive("/owner/shopanalytics")}
                />
                <DropdownItem
                  label="My Analytics"
                  icon={LineChart}
                  onClick={() => navigate("/owner/analytics")}
                  active={isActive("/owner/analytics")}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Settings Dropdown */}
        <div className="relative">
          <button
            onClick={() => handleDropdownClick("settings")}
            className={`flex flex-col items-center gap-1 text-xs ${
              isSubActive("/owner/settings")
                ? "text-black dark:text-white font-semibold"
                : "text-zinc-400"
            }`}
          >
            <Settings size={22} />
            <span>Settings</span>
          </button>
          <AnimatePresence>
            {openDropdown === "settings" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute bottom-14 left-[-140%] -translate-x-1/2 bg-white dark:bg-zinc-800 rounded-lg shadow-md p-2 space-y-1 z-50"
              >
                <DropdownItem
                  label="Shop Settings"
                  icon={Settings}
                  onClick={() => navigate("/owner/shopsettings")}
                  active={isActive("/owner/shopsettings")}
                />
                <DropdownItem
                  label="My Settings"
                  icon={Settings2}
                  onClick={() => navigate("/owner/settings")}
                  active={isActive("/owner/settings")}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  );
}

function DropdownItem({ label, icon: Icon, onClick, active }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded hover:bg-zinc-100 dark:hover:bg-zinc-700 ${
        active ? "bg-zinc-100 dark:bg-zinc-700 font-medium" : ""
      }`}
    >
      <Icon size={16} />
      {label}
    </button>
  );
}
