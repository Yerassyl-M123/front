"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function withAdminAuth(Component: React.ComponentType) {
  return function AdminProtected(props: any) {
    const [isLoading, setIsLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const router = useRouter();

    useEffect(() => {
      const checkAdmin = async () => {
        try {
          const res = await axios.get("http://localhost:8080/check-role", {
            withCredentials: true, 
          });

          if (res.data.role === "admin") {
            setIsAdmin(true);
          } else {
            router.push("/");
          }
        } catch (error) {
          router.push("/signin");
        } finally {
          setIsLoading(false);
        }
      };

      checkAdmin();
    }, [router]);

    if (isLoading) {
      return <div className="text-center mt-10">Загрузка...</div>;
    }

    return isAdmin ? <Component {...props} /> : null;
  };
}
