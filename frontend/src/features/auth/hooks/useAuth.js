import { useContext } from "react";
import { AuthContext } from "../AuthContext";
import toast from "react-hot-toast";
import {
  getme,
  login,
  logout,
  register,
} from "../services/AuthApi";
import { useEffect } from "react";

export const useAuth = () => {
  const context = useContext(AuthContext);
  const { user, setUser, loading, setLoading } = context;

  const handleLogin = async ({ email, password }) => {
    setLoading(true);
    try {
      const data = await login({ email, password });
      setUser(data?.user);
      toast.success("Login successful");
      return true;
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || "Login failed";
      toast.error(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async ({ username, email, password }) => {
    setLoading(true);
    try {
      const data = await register({ username, email, password });
      setUser(data?.user);
      toast.success("Registration successful");
      return true;
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || "Registration failed";
      toast.error(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
      setUser(null);
      toast.success("Logout successful");
      return true;
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || "Logout failed";
      toast.error(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

 useEffect(() => {
    const initUser = async () => {
      try {
        const data = await getme();
        setUser(data?.user);
      } catch (error) {
        console.error("Failed to init user:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    initUser();
  }, []);

  return {
    user,
    loading,
    handleLogin,
    handleLogout,
    handleRegister,

  };
};
