import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  CalendarDays,
  DollarSign,
  User,
  TrendingUp,
  TrendingDown,
  Scissors,
  BarChart3,
  Star,
} from "lucide-react";
import OwnerBottomNav from "../../components/ShopOwnerBottomNav";
import { useAuth } from "../../context/AuthContext";
import { fetchShopByOwnerId, fetchShopIncomeStats, fetchShopWeeklyAppointmentsStatus, fetchTopServicesByShopId, fetchShopStarCounts, fetchShopBarberCounts, fetchShopMonthlyBarberStats } from "../../services/api";

// barbersData will be fetched from API
const satisfactionData = [
  { rating: "5★", count: 42 },
  { rating: "4★", count: 18 },
  { rating: "3★", count: 6 },
  { rating: "2★", count: 3 },
  { rating: "1★", count: 1 },
];

// individualBarbers will be fetched from API
const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#a855f7"];

export default function OwnerAnalytics() {
  const [individualBarbers, setIndividualBarbers] = useState({});
  const barberNames = Object.keys(individualBarbers);
  const [selectedBarber, setSelectedBarber] = useState(barberNames[0] || "");
  const [range, setRange] = useState("week");
  const { user } = useAuth();
  const [incomeStats, setIncomeStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [appointmentsData, setAppointmentsData] = useState([]);
  const [servicesData, setServicesData] = useState([]);
  const [satisfactionData, setSatisfactionData] = useState([]);
  const [barbersData, setBarbersData] = useState([]);
  const [shopName, setShopName] = useState("");

  useEffect(() => {
    async function loadIncomeStats() {
      setLoading(true);
      setError(null);
      try {
        // Get shop by owner id
        const shop = await fetchShopByOwnerId(user.owner_id || user._id);
        setShopName(shop.shop_name || "");
        const stats = await fetchShopIncomeStats(shop.shop_id);
        setIncomeStats(stats);
      } catch (err) {
        setError("Failed to load income stats");
      } finally {
        setLoading(false);
      }
    }
    if (user) loadIncomeStats();
  }, [user]);

  useEffect(() => {
    async function loadAppointmentsData() {
      try {
        const shop = await fetchShopByOwnerId(user.owner_id || user._id);
        const data = await fetchShopWeeklyAppointmentsStatus(shop.shop_id);
        setAppointmentsData(data);
      } catch {
        setAppointmentsData([]);
      }
    }
    if (user) loadAppointmentsData();
  }, [user]);

  useEffect(() => {
    async function loadServicesData() {
      try {
        const shop = await fetchShopByOwnerId(user.owner_id || user._id);
        const data = await fetchTopServicesByShopId(shop.shop_id);
        // API returns { name, count } but recharts expects { name, value }
        setServicesData(data.map(s => ({ name: s.name, value: s.count })));
      } catch {
        setServicesData([]);
      }
    }
    if (user) loadServicesData();
  }, [user]);

  useEffect(() => {
    async function loadSatisfactionData() {
      try {
        const shop = await fetchShopByOwnerId(user.owner_id || user._id);
        const data = await fetchShopStarCounts(shop.shop_id);
        setSatisfactionData(data);
      } catch {
        setSatisfactionData([]);
      }
    }
    if (user) loadSatisfactionData();
  }, [user]);

  useEffect(() => {
    async function loadBarbersData() {
      try {
        const shop = await fetchShopByOwnerId(user.owner_id || user._id);
        const data = await fetchShopBarberCounts(shop.shop_id);
        setBarbersData(data);
      } catch {
        setBarbersData([]);
      }
    }
    if (user) loadBarbersData();
  }, [user]);

  useEffect(() => {
    async function loadIndividualBarbers() {
      try {
        const shop = await fetchShopByOwnerId(user.owner_id || user._id);
        const data = await fetchShopMonthlyBarberStats(shop.shop_id);
        setIndividualBarbers(data);
      } catch {
        setIndividualBarbers({});
      }
    }
    if (user) loadIndividualBarbers();
  }, [user]);

  let incomeData = [];
  let currentTotal = 0;
  let previousTotal = 0;
  let growth = 0;
  let growthIcon = null;
  let growthColor = "";
  if (incomeStats && incomeStats[range]) {
    incomeData = incomeStats[range].data;
    currentTotal = incomeStats[range].total;
    previousTotal = incomeStats[range].previous;
    growth = previousTotal === 0 ? 0 : ((currentTotal - previousTotal) / previousTotal) * 100;
    growthIcon =
      growth >= 0 ? (
        <TrendingUp className="w-4 h-4" />
      ) : (
        <TrendingDown className="w-4 h-4" />
      );
    growthColor = growth >= 0 ? "text-green-500" : "text-red-500";
  }
  const currentBarber = individualBarbers[selectedBarber] || { income: 0, appts: 0, trend: [] };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white transition-colors duration-300 p-4 pb-24 pt-16 space-y-8">
      <div className="flex items-center justify-between">
        <OwnerBottomNav />
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2 text-black dark:text-white">
            <BarChart3 className="w-6 h-6" /> Shop Analytics
          </h1>
          {shopName && (
            <div className="text-lg font-semibold text-zinc-700 dark:text-zinc-300 mt-1">{shopName}</div>
          )}
        </div>
        <select
          value={range}
          onChange={(e) => setRange(e.target.value)}
          className="text-sm border rounded-md p-1 bg-zinc-100 dark:bg-zinc-800 dark:text-white"
        >
          <option value="week">Week</option>
          <option value="month">Month</option>
          <option value="year">Year</option>
        </select>
      </div>

      {/* Income Chart */}
      <div className="bg-white dark:bg-zinc-800 p-4 rounded-xl shadow-sm">
        <div className="flex justify-between items-center mb-2">
          <h2 className="font-semibold flex items-center gap-2">
            <DollarSign className="w-5 h-5" /> Income ({range})
          </h2>
          
        </div>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={incomeData}>
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Appointments Chart */}
      <div className="bg-white dark:bg-zinc-800 p-4 rounded-xl shadow-sm">
        <h2 className="font-semibold flex items-center gap-2 mb-2">
          <CalendarDays className="w-5 h-5" /> Appointments vs Cancellations
        </h2>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={appointmentsData}>
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="appts" fill="#10b981" barSize={18} name="Appointments" />
              <Bar dataKey="canceled" fill="#ef4444" barSize={18} name="Canceled" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Services Pie Chart */}
      <div className="bg-white dark:bg-zinc-800 p-4 rounded-xl shadow-sm">
        <h2 className="font-semibold flex items-center gap-2 mb-4">
          <Scissors className="w-5 h-5" /> Top Services
        </h2>
        <div className="h-60">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={servicesData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {servicesData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Satisfaction Ratings */}
      <div className="bg-white dark:bg-zinc-800 p-4 rounded-xl shadow-sm">
        <h2 className="font-semibold flex items-center gap-2 mb-4">
          <Star className="w-5 h-5" /> Client Satisfaction
        </h2>
        <div className="h-60">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={satisfactionData} layout="vertical">
              <XAxis type="number" />
              <YAxis type="category" dataKey="rating" />
              <Tooltip />
              <Bar dataKey="count" fill="#6366f1" barSize={18} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Barber Productivity */}
      <div className="bg-white dark:bg-zinc-800 p-4 rounded-xl shadow-sm">
        <h2 className="font-semibold flex items-center gap-2 mb-2">
          <User className="w-5 h-5" /> Barber Productivity
        </h2>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barbersData} layout="vertical">
              <XAxis type="number" />
              <YAxis type="category" dataKey="name" />
              <Tooltip />
              <Bar dataKey="value" fill="#f59e0b" barSize={18} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Individual Barber Details */}
      <div className="bg-white dark:bg-zinc-800 p-4 rounded-xl shadow-sm">
        <div className="flex justify-between items-center mb-2">
          <h2 className="font-semibold flex items-center gap-2">
            <User className="w-5 h-5" /> Barber Details
          </h2>
          <select
            value={selectedBarber}
            onChange={(e) => setSelectedBarber(e.target.value)}
            className="text-sm border rounded-md p-1 bg-zinc-100 dark:bg-zinc-800 dark:text-white"
          >
            {barberNames.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>
        <p className="text-sm mb-2">
          Total Income: <strong>${currentBarber.income}</strong>
          <br />
          Appointments: <strong>{currentBarber.appts}</strong>
        </p>
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={currentBarber.trend}>
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
