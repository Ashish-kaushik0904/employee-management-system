import axios from "axios";

const API = axios.create({
  baseURL: "https://employee-ms-backend-3dyy.onrender.com/api",
  withCredentials: true,
});

// Har request mein token automatically add karo
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;