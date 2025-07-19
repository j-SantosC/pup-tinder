import { useState, useCallback } from "react";

export const useAuthAPI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const verifyUser = useCallback(async () => {
    const token = sessionStorage.getItem("auth0_token");

    if (!token) {
      setError("No hay token disponible");
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:3001/api/user", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error en la verificación");
      }

      return data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { verifyUser, loading, error };
};
