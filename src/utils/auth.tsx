"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function withAuth(Component: React.FC) {
  return function AuthenticatedComponent(props: any) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
      const checkAuth = async () => {
        try {
          await axios.get("http://localhost:8080/check-auth", { withCredentials: true });
          setIsAuthenticated(true);
        } catch (error) {
          router.push("/signin");
        } finally {
          setIsLoading(false);
        }
      };

      checkAuth();
    }, []);

    if (isLoading) {
      return <div className="min-h-screen flex items-center justify-center">Загрузка...</div>;
    }

    return isAuthenticated ? <Component {...props} /> : null;
  };
}

