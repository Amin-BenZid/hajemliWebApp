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
