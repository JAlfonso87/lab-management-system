import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../axios/api";

const UserProtectedRoutes = () => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try 
      {
        const response = await api.get("/auth/session");
        setAuthenticated(response.data ?? false);
      } 
      catch (error) { console.error("Error de autenticación:", error) } 
      finally { setLoading(false) }
    };

    checkAuth();
  }, []);

  if (loading) {
    return <p>Verificando sesión...</p>;
  }

  if (!authenticated) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default UserProtectedRoutes;