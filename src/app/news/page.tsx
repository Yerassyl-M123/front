"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { withAuth } from "../../utils/auth";


interface News {
  id: number;
  title: string;
  date: string;
  content: string;
  image_url: string;
}

function NewsPage() {
  const [news, setNews] = useState<News[]>([]);
  const router = useRouter();

  useEffect(() => {
    axios
      .get("http://localhost:8080/news", { withCredentials: true })
      .then((response) => setNews(response.data))
      .catch((error) => console.error("Ошибка загрузки новостей:", error));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Новости</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {news.map((item) => (
          <div
            key={item.id}
            className="border rounded-lg shadow-lg overflow-hidden cursor-pointer"
            onClick={() => router.push(`/news/${item.id}`)}
          >
            <img src={item.image_url} alt={item.title} className="w-full h-48 object-cover" />
            <div className="p-4">
              <p className="text-gray-500">{item.date}</p>
              <h2 className="text-lg font-bold">{item.title}</h2>
              <p className="text-sm text-gray-700">{item.content.substring(0, 100)}...</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default withAuth(NewsPage);



