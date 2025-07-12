import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "./context/AuthContext";

// Import all pages
import ClientAuthPage from "./pages/ClientAuth";
import ProtectedLogin from "./pages/ProtectedLogin";
import DiscoverShops from "./pages/Client/DiscoverShops";
import ShopDetails from "./pages/Client/ShopDetails";
import ChooseService from "./pages/Client/ChooseService";
import CalendarSlot from "./pages/Client/CalendarSlot";
import Confirmation from "./pages/Client/Confirmation";
import ClientShopPage from "./pages/Client/ClientShopPage";
import Appointments from "./pages/Worker/Appointments";
import Profile from "./pages/Client/Profile";
import ClientBarberProfile from "./pages/Client/ClientBarberProfile";
import BarberProfile from "./pages/Worker/BarberProfile";
import CreateShop from "./pages/Owner/CreateShop";
import ShopOwnerView from "./pages/Owner/ShopOwnerView";
import ShopDetailsBarber from "./pages/Worker/ShopDetailsBarberView";
import OwnerDashboard from "./pages/Owner/OwnerDashboard";
import OwnerAnalytics from "./pages/Owner/OwnerAnalytics";
import BarbersManagement from "./pages/Worker/BarbersManagement";
import OwnerCalendar from "./pages/Owner/OwnerCalendar";
import BarberShopView from "./pages/Worker/BarberShopView";
import OwnerProfilePage from "./pages/Owner/OwnerProfilePage";
import OwnerAnalyticsPage from "./pages/Owner/OwnerAnalyticsPage";
import OwnerSettings from "./pages/Owner/OwnerSettings";
import OwnerJobOffers from "./pages/Owner/OwnerJobOffers";
import BarberAppointments from "./pages/Worker/BarberAppointments";
import FindJobsPage from "./pages/Worker/FindJobsPage";
import BarberDashboard from "./pages/Worker/BarberDashboard";
import BarberShopPage from "./pages/Worker/BarberShopPage";
import BarberNotificationsPage from "./pages/Worker/BarberNotificationsPage";
import BarberSettings from "./pages/Worker/BarberSettings";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ConfirmResetPassword from "./pages/ConfirmResetPassword";
import ClientNotificationsPage from "./pages/Client/ClientNotificationsPage";
import OwnerNotificationsPage from "./pages/Owner/OwnerNotificationsPage";

// Components
import ThemeToggle from "./components/ThemeToggle";
import NotificationBell from "./components/NotificationBell";

function AppRoutes() {
  const { user, role, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (
      role === "client" &&
      user &&
      user.shop_id &&
      location.pathname === "/"
    ) {
      navigate(`/shop/${user.shop_id}`, { replace: true });
    }
  }, [role, user, location, navigate]);

  if (loading) {
    // You can replace this with a spinner if you want
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <>
      <div className="flex items-center gap-4">
        <div className="fixed w-10 h-10 top-3 right-16 z-50 p-2 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-white shadow-md hover:scale-105 transition-all duration-300">
          <NotificationBell />
        </div>
        <ThemeToggle />
      </div>

      <Routes>
        <Route path="/login" element={<ProtectedLogin />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/confirm-reset" element={<ConfirmResetPassword />} />

        {!user ? (
          <Route path="*" element={<Navigate to="/login" />} />
        ) : role === "client" ? (
          <>
            <Route path="/" element={<DiscoverShops />} />
            <Route path="/shop/:id" element={<ShopDetails />} />
            <Route path="/book/:barberId" element={<ChooseService />} />
            <Route path="/book/:barberId/calendar" element={<CalendarSlot />} />
            <Route path="/confirmation" element={<Confirmation />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/home" element={<ClientShopPage />} />
            <Route path="/barber/:barberId" element={<ClientBarberProfile />} />
            <Route path="/notifications" element={<ClientNotificationsPage />} />
            <Route path="*" element={<DiscoverShops />} />
          </>
        ) : role === "worker" ? (
          <>
            <Route path="/barber/appointments" element={<BarberAppointments />} />
            <Route path="/barber/profile" element={<BarberProfile />} />
            <Route path="/barber/jobs" element={<FindJobsPage />} />
            <Route path="/barber/dashboard" element={<BarberDashboard />} />
            <Route path="/barber/myshop" element={<BarberShopPage />} />
            <Route path="/barber/shop" element={<ShopDetailsBarber />} />
            <Route path="/barber/notifications" element={<BarberNotificationsPage />} />
            <Route path="/barber/settings" element={<BarberSettings />} />
            <Route path="*" element={<Navigate to="/barber/dashboard" />} />
          </>
        ) : role === "owner" ? (
          <>
            <Route path="/owner/createshop" element={<CreateShop />} />
            <Route path="/owner/shopsettings" element={<ShopOwnerView />} />
            <Route path="/owner/dashboard" element={<OwnerDashboard />} />
            <Route path="/owner/shopanalytics" element={<OwnerAnalytics />} />
            <Route path="/owner/team" element={<BarbersManagement />} />
            <Route path="/owner/appointments" element={<OwnerCalendar />} />
            <Route path="/owner/shop" element={<BarberShopView />} />
            <Route path="/owner/profile" element={<OwnerProfilePage />} />
            <Route path="/owner/analytics" element={<OwnerAnalyticsPage />} />
            <Route path="/owner/settings" element={<OwnerSettings />} />
            <Route path="/owner/joboffers" element={<OwnerJobOffers />} />
            <Route path="/owner/notifications" element={<OwnerNotificationsPage />} />
            <Route path="*" element={<Navigate to="/owner/dashboard" />} />
          </>
        ) : (
          <Route path="*" element={<Navigate to="/login" />} />
        )}
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
