import axios from "axios";

const API = "https://homefit-backend-rjab.onrender.com/api";

export const loginUser = async (data) => {
  const response = await axios.post(`${API}/login`, data);
  return response.data;
};