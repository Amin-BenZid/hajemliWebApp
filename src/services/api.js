import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:3000"; // fallback

const api = axios.create({
  baseURL: API_BASE_URL,
});

export { API_BASE_URL };
export default api;

// Try login for all roles
export async function loginAllRoles(mail, password) {
  const urls = [
    "/clients/login",
    "/barbers/login",
    "/shop-owners/login",
  ];
  for (const url of urls) {
    try {
      const response = await api.post(url, { mail, password });
      if (response.status === 201) {
        if (url.includes("clients")) {
          return { role: "client", token: response.data.token, user: response.data.client };
        } else if (url.includes("barbers")) {
          return { role: "worker", token: response.data.token, user: response.data.barber };
        } else if (url.includes("shop-owners")) {
          return { role: "owner", token: response.data.token, user: response.data.shopOwner };
        }
      }
    } catch (e) {
      // ignore and try next
    }
  }
  throw new Error("Invalid email or password");
}

// Fetch all shops
export async function fetchShops() {
  const response = await api.get("/shops");
  return response.data;
}

// Update client's shop
export async function updateClientShop(client_id, shop_id) {
  const response = await api.put(`/clients/${client_id}/shop`, { shop_id });
  return response.data;
}

// Fetch barber by ID (if not already present)
export async function fetchBarberById(barberId) {
  const response = await api.get(`/barbers/${barberId}`);
  return response.data;
}

// Fetch reviews for a barber by barber_id
export async function fetchBarberReviews(barberId) {
  const response = await api.get(`/reviews/barber/${barberId}`);
  return response.data;
}

// Fetch service by ID (if not already present)
export async function fetchServiceById(serviceId) {
  const response = await api.get(`/services/${serviceId}`);
  return response.data;
}

// Fetch days off for a barber by barberId
export async function fetchBarberDaysOff(barberId) {
  const response = await api.get(`/shops/barber/${barberId}/daysoff`);
  return response.data.daysOff;
}

// Fetch work hours for a barber by barberId
export async function fetchBarberWorkHours(barberId) {
  const response = await api.get(`/shops/barber/${barberId}/workhours`);
  return response.data.workHours;
}

// Fetch booked appointment times for a barber by barberId
export async function fetchBarberBookedTimes(barberId) {
  const response = await api.get(`/appointments/${barberId}/times`);
  return response.data;
}

// Create a new appointment
export async function createAppointment(appointmentData) {
  const response = await api.post('/appointments', appointmentData);
  return response.data;
}

// Fetch client by ID
export async function fetchClientById(clientId) {
  const response = await api.get(`/clients/${clientId}`);
  return response.data;
}

// Update client details
export async function updateClientDetails(clientId, updateData) {
  const response = await api.put(`/clients/${clientId}/updateuser`, updateData);
  return response.data;
}

// Upload client profile picture
export async function uploadClientProfilePicture(clientId, file) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('client_id', clientId);
  const response = await api.post('/clients/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
}

// Fetch appointments for a client
export async function fetchClientAppointments(clientId) {
  const response = await api.get(`/appointments/client/${clientId}`);
  return response.data;
}

// Fetch shop by ID (if not already present)
export async function fetchShopById(shopId) {
  const response = await api.get(`/shops/${shopId}`);
  return response.data;
}

// Update appointment state
export async function updateAppointmentState(appointmentId, newState) {
  const response = await api.put(`/appointments/${appointmentId}/state`, { newState });
  return response.data;
}

// Register a new client
export async function registerClient(clientData) {
  const response = await api.post('/clients', clientData);
  return response.data;
}

// Fetch all appointments for a barber by barberId
export async function fetchBarberAppointments(barberId) {
  const response = await api.get(`/appointments/all/${barberId}`);
  return response.data;
}

// Fetch shop details for a barber by barberId
export async function fetchShopDetailsByBarberId(barberId) {
  const response = await api.get(`/barbers/${barberId}/shop/details`);
  return response.data;
}

// Fetch yearly income for a barber
export async function fetchBarberYearlyIncome(barberId) {
  const response = await api.get(`/appointments/barber/${barberId}/income/year`);
  return response.data;
}

// Fetch monthly income for a barber
export async function fetchBarberMonthlyIncome(barberId) {
  const response = await api.get(`/appointments/barber/${barberId}/income/month`);
  return response.data;
}

// Fetch pending appointments for a barber
export async function fetchBarberPendingAppointments(barberId) {
  const response = await api.get(`/appointments/pending/${barberId}`);
  return response.data;
}

// Fetch revenue per service summary for a barber
export async function fetchBarberServiceRevenueSummary(barberId) {
  const response = await api.get(`/appointments/barber/${barberId}/service-revenue-summary`);
  return response.data;
}

// Fetch average service durations for a barber
export async function fetchBarberServiceDurations(barberId) {
  const response = await api.get(`/barbers/${barberId}/service-durations`);
  return response.data;
}

// Fetch weekly income for a barber
export async function fetchBarberWeeklyIncome(barberId) {
  const response = await api.get(`/appointments/barber/${barberId}/weekly-income`);
  return response.data;
}

// Fetch past accepted appointments for a barber
export async function fetchBarberPastAcceptedAppointments(barberId) {
  const response = await api.get(`/appointments/barber/${barberId}/past-accepted`);
  return response.data;
}

// Fetch most popular (busiest) day for a barber
export async function fetchBarberMostPopularDay(barberId) {
  const response = await api.get(`/appointments/barber/${barberId}/most-popular-day`);
  return response.data;
}

// Fetch most reviewed (used) service for a barber
export async function fetchBarberMostUsedService(barberId) {
  const response = await api.get(`/appointments/barber/${barberId}/most-used-service`);
  return response.data;
}

// Fetch shop by owner ID
export async function fetchShopByOwnerId(ownerId) {
  try {
    const response = await api.get(`/shops/owner/${ownerId}`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return { notFound: true, ...error.response.data };
    }
    throw error;
  }
}

// Create a new shop
export async function createShop(shopData) {
  const response = await api.post('/shops', shopData);
  return response.data;
}

// Upload shop profile picture
export async function uploadShopProfilePicture(shopId, file) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('shop_id', shopId);
  const response = await api.post('/shops/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
}

// Upload shop cover picture
export async function uploadShopCoverPicture(shopId, file) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('shop_id', shopId);
  const response = await api.post('/shops/uploadcover', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
}

// Create a new shop with images (profile and cover)
export async function createShopWithImages(shopData, profileFile, coverFile) {
  const formData = new FormData();
  Object.entries(shopData).forEach(([key, value]) => {
    formData.append(key, value);
  });
  if (profileFile) formData.append('images', profileFile);
  if (coverFile) formData.append('images', coverFile);
  const response = await api.post('/shops/create-with-images', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
}

// Update shop details
export async function updateShop(shopId, shopData) {
  const response = await api.put(`/shops/${shopId}`, shopData);
  return response.data;
}

// Fetch reviews for a shop by shop_id
export async function fetchShopReviews(shopId) {
  const response = await api.get(`/reviews/shop/${shopId}`);
  return response.data;
}

// Fetch client by user_id
export async function fetchClientByUserId(userId) {
  const response = await api.get(`/clients/${userId}`);
  return response.data;
}

// Fetch barbers summary for a shop by shopId
export async function fetchBarbersSummaryByShopId(shopId) {
  const response = await api.get(`/shops/${shopId}/barbers-summary`);
  return response.data;
}

// Add a barber to a shop by barberId
export async function addBarberToShop(shopId, barberId) {
  const response = await api.post(`/shops/${shopId}/add-barber/${barberId}`);
  return response.data;
}

// Remove a barber from a shop by barberId
export async function removeBarberFromShop(shopId, barberId) {
  const response = await api.delete(`/shops/${shopId}/remove-barber/${barberId}`);
  return response.data;
}

// Fetch shop statistics by shopId
export async function fetchShopStatistics(shopId) {
  const response = await api.get(`/shops/${shopId}/statistics`);
  return response.data;
}

// Fetch barber performance stats for a shop
export async function fetchBarberStatsByShopId(shopId) {
  const response = await api.get(`/shops/${shopId}/barber-stats`);
  return response.data;
}

// Fetch top services for a shop
export async function fetchTopServicesByShopId(shopId) {
  const response = await api.get(`/shops/${shopId}/top-services`);
  return response.data;
}

// Fetch income trend for a shop for a given year and month
export async function fetchShopIncomeTrend(shopId, year, month) {
  const response = await api.get(`/shops/${shopId}/income-trend`, {
    params: { year, month }
  });
  return response.data;
}

// Fetch satisfaction data for a shop
export async function fetchShopSatisfaction(shopId) {
  const response = await api.get(`/reviews/shop/${shopId}/satisfaction`);
  return response.data;
}

// Fetch income stats for a shop (week, month, year)
export async function fetchShopIncomeStats(shopId) {
  const response = await api.get(`/shops/${shopId}/income-stats`);
  return response.data;
}

// Fetch weekly appointments status for a shop
export async function fetchShopWeeklyAppointmentsStatus(shopId) {
  const response = await api.get(`/shops/${shopId}/weekly-appointments-status`);
  return response.data;
}

// Fetch star counts (satisfaction) for a shop
export async function fetchShopStarCounts(shopId) {
  const response = await api.get(`/reviews/shop/${shopId}/star-counts`);
  return response.data;
}

// Fetch barber productivity (appointment counts) for a shop
export async function fetchShopBarberCounts(shopId) {
  const response = await api.get(`/appointments/shop/${shopId}/barber-counts`);
  return response.data;
}

// Fetch monthly barber stats for a shop
export async function fetchShopMonthlyBarberStats(shopId) {
  const response = await api.get(`/appointments/shop/${shopId}/monthly-barber-stats`);
  return response.data;
}

// Fetch detailed appointments for a shop
export async function fetchShopDetailedAppointments(shopId) {
  const response = await api.get(`/appointments/shop/${shopId}/detailed-list`);
  return response.data;
}
