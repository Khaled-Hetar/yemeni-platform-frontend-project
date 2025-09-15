import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import apiClient from "../api/axiosConfig";
import PropTypes from "prop-types";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const effectRan = useRef(false);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    delete apiClient.defaults.headers.common["Authorization"];
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const login = useCallback((userData, token) => {
    localStorage.setItem("token", token);
    apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    setUser(userData);
    setIsAuthenticated(true);
  }, []);

  const checkUserStatus = useCallback(async () => {
    console.log("1. بدء التحقق من حالة المستخدم...");
    const token = localStorage.getItem("token");

    if (token) {
      console.log("2. تم العثور على توكن في localStorage.");
      try {
        console.log("3. داخل بلوك try... قبل طلب /auth/me");
        apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        const response = await apiClient.get("/auth/me");
        console.log("4. تم استلام رد ناجح من /auth/me:", response.data);
        setUser(response.data);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("5. حدث خطأ فادح أثناء التحقق:", error);
        logout(); // <-- الدالة logout الآن ثابتة بفضل useCallback
      }
    } else {
      console.log("6. لم يتم العثور على توكن.");
    }

    console.log("7. انتهاء التحقق، سيتم إيقاف التحميل.");
    setLoading(false);
  }, [logout]);

  useEffect(() => {
    if (effectRan.current === true) {
      checkUserStatus();
    }
    return () => {
      effectRan.current = true;
    };
  }, [checkUserStatus]);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated,
      loading,
      login,
      logout,
    }),
    [user, isAuthenticated, loading, login, logout]
  );

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
