import axios from "axios";

const api = axios.create({
  //baseURL: "https://campus-connect-bn54.vercel.app",
  baseURL: "https://campus-connect-bn54.vercel.app",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
