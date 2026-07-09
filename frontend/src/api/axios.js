import axios from "axios";

const API = axios.create({
  baseURL: "https://employee-ms-backend-3dyy.onrender.com/api",
  withCredentials: true,
});

export default API;