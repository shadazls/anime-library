import { useState, useEffect } from "react";

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/me", {
          headers: {
            Authorization: `Bearer ${document.cookie
              .split("; ")
              .find((row) => row.startsWith("token="))
              ?.split("=")[1]}`,
          },
        });

        if (res.ok) {
          const userData = await res.json();
          setIsAuthenticated(true);
          setUser(userData);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Failed to check authentication:", error);
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  return { isAuthenticated, user };
}
