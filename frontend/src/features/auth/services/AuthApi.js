import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});

export const register = async ({ username, email, password }) => {
  try {
    const response = await api.post("/api/auth/register", {
      username,
      email,
      password,
    });
    return response.data;
  } catch (error) {
    console.error("Registration error:", error?.response?.data || error)

  }
};

export const login = async ({ email, password }) => {
  try {
    const response = await api.post("/api/auth/login", { email, password });
    return response.data;
  } catch (error) {
    console.error("Login error:", error);
  }
};

export const logout = async () => {
  try {
    const response = await api.post("/api/auth/logout");
    return response.data;
  } catch (error) {
    console.error("Logout error:", error);
  }
};

export const getme = async () => {
  try {
    const response = await api.get("/api/auth/getme");
    return response.data;
  } catch (error) {
    console.error("Get current user error:", error);
  }
};
