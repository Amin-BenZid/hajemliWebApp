// import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";

// // Pages
// import ClientAuthPage from "./pages/ClientAuth";
// import DiscoverShops from "./pages/DiscoverShops";
// import ShopDetails from "./pages/ShopDetails";
// import ChooseService from "./pages/ChooseService";
// import CalendarSlot from "./pages/CalendarSlot";
// import Confirmation from "./pages/Confirmation";
// import ClientShopPage from "./pages/ClientShopPage";
// import Appointments from "./pages/Appointments";
// import Profile from "./pages/Profile";

// // Components
// import BottomNav from "./components/BottomNav";
// import ThemeToggle from "./components/ThemeToggle";
// import FloatingBookButton from "./components/FloatingBookButton";

// const AppRoutes = () => {
//   const client = JSON.parse(localStorage.getItem("client"));
//   const location = useLocation();
//   const hasShop = client?.shop_id;

//   const showNav =
//     !!client &&
//     ["/", "/appointments", "/discover", "/profile"].includes(location.pathname);

//   const showFAB = !!client && location.pathname !== "/confirmation";

//   const fabDestination = hasShop ? "/discover" : "/discover";

//   return (
//     <>
//       <ThemeToggle />

//       <Routes>
//         {!client ? (
//           <>
//             <Route path="/" element={<ClientAuthPage />} />
//             <Route path="*" element={<Navigate to="/" />} />
//           </>
//         ) : hasShop ? (
//           <>
//             <Route path="/" element={<ClientShopPage />} />
//             <Route path="/appointments" element={<Appointments />} />
//             <Route path="/discover" element={<DiscoverShops />} />
//             <Route path="/profile" element={<Profile />} />
//             <Route path="/shop/:id" element={<ShopDetails />} />
//             <Route path="/choose-service/:barberId" element={<ChooseService />} />
//             <Route path="/book/:barberId" element={<ChooseService />} />
//             <Route path="/book/:barberId/calendar" element={<CalendarSlot />} />
//             <Route path="/confirmation" element={<Confirmation />} />
//             <Route path="/appointments" element={<Appointments />} />
//             <Route path="*" element={<Navigate to="/" />} />
//           </>
//         ) : (
//           <>
//             <Route path="/" element={<DiscoverShops />} />
//             <Route path="/shop/:id" element={<ShopDetails />} />
//             <Route path="/book/:barberId" element={<ChooseService />} />
//             <Route path="/book/:barberId/calendar" element={<CalendarSlot />} />
//             <Route path="/confirmation" element={<Confirmation />} />
//             <Route path="/profile" element={<Profile />} />
//             <Route path="/appointments" element={<Appointments />} />
//             <Route path="*" element={<Navigate to="/" />} />
//           </>
//         )}
//       </Routes>

//       {showNav && <BottomNav />}
//       {showFAB && <FloatingBookButton to={fabDestination} />}
//     </>
//   );
// };

// export default function App() {
//   return (
//     <BrowserRouter>
//       <AppRoutes />
//     </BrowserRouter>
//   );
// }
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import ClientAuthPage from "./pages/ClientAuth";
import DiscoverShops from "./pages/DiscoverShops";
import ShopDetails from "./pages/ShopDetails";
import ChooseService from "./pages/ChooseService";
import CalendarSlot from "./pages/CalendarSlot";
import Confirmation from "./pages/Confirmation";
import ClientShopPage from "./pages/ClientShopPage";
import Appointments from "./pages/Appointments";
import Profile from "./pages/Profile";
import ClientBarberProfile from "./pages/ClientBarberProfile";
import BarberProfile from "./pages/BarberProfile";

// Components
import ThemeToggle from "./components/ThemeToggle";
import BarberAppointments from "./pages/BarberAppointments";
import FindJobsPage from "./pages/FindJobsPage";
import BarberDashboard from "./pages/BarberDashboard";
import BarberShopPage from "./pages/BarberShopPage";
import BarberNotificationsPage from "./pages/BarberNotificationsPage";
import BarberSettings from "./pages/BarberSettings";
import NotificationBell from "./components/NotificationBell";

const AppRoutes = () => {
  return (
    <>
      <div className="flex items-center gap-4">
        <div className="fixed w-10 h-10 top-3 right-16 z-50 p-2 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-white shadow-md hover:scale-105 transition-all duration-300">
          <NotificationBell count={4} />
        </div>
        <ThemeToggle />
      </div>
      <Routes>
        <Route path="/login" element={<ClientAuthPage />} />
        <Route path="/" element={<DiscoverShops />} />
        <Route path="/shop/:id" element={<ShopDetails />} />
        <Route path="/book/:barberId" element={<ChooseService />} />
        <Route path="/book/:barberId/calendar" element={<CalendarSlot />} />
        <Route path="/confirmation" element={<Confirmation />} />
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/home" element={<ClientShopPage />} />
        <Route path="*" element={<DiscoverShops />} />
        <Route path="/barber/:barberId" element={<ClientBarberProfile />} />
        <Route path="/barber/appointments" element={<BarberAppointments />} />
        <Route path="/barber/profile" element={<BarberProfile />} />
        <Route path="/barber/jobs" element={<FindJobsPage />} />
        <Route path="/barber/dashboard" element={<BarberDashboard />} />
        <Route path="/barber/shop" element={<BarberShopPage />} />
        <Route path="/barber/notifications" element={<BarberNotificationsPage />} />
        <Route path="/barber/settings" element={<BarberSettings />} />
      </Routes>
    </>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
