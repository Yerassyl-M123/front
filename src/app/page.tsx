"use client";

import { withAuth } from "@/utils/auth";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function HomePage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await axios.get("http://localhost:8080/check-auth", { withCredentials: true });
        setIsAuthenticated(true);
      } catch (error) {
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:8080/signout", {}, { withCredentials: true });
      setIsAuthenticated(false);
      router.push("/signin");
    } catch (error) {
      console.error("Ошибка при выходе", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Добро пожаловать!</h1>
      
      {isAuthenticated ? (
        <button
          onClick={handleLogout}
          className="px-6 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 transition"
        >
          Выйти
        </button>
      ) : (
        <p className="text-gray-700">Вы не авторизованы</p>
      )}
    </div>
  );
}
export default withAuth(HomePage);
