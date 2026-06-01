import axios from "axios";

const API = "http://localhost:8000/api";

export const loginUser = async (data) => {
  const response = await axios.post(`${API}/login`, data);
  return response.data;
};