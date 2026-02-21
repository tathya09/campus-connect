import axios from "axios";

const api = axios.create({
  //baseURL: "http://localhost:3000",
  baseURL: "https://campus-connect-bn54.vercel.app",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
