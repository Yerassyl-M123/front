"use client";

import axios from "axios";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { withAuth } from "../../../utils/auth";

interface News {
  id: number;
  title: string;
  date: string;
  content: string;
  image_url: string;
}

function NewsDetailPage() {
  const { id } = useParams();
  const [newsItem, setNewsItem] = useState<News | null>(null);

  useEffect(() => { 
      axios
      .get(`http://localhost:8080/news/${id}`, { withCredentials: true }) 
      .then((response) => setNewsItem(response.data))
      .catch((error) => console.error("Ошибка загрузки новости:", error));
  }, [id]);

  if (!newsItem) return <p>Загрузка...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">{newsItem.title}</h1>
      <p className="text-gray-500">{newsItem.date}</p>
      <img src={newsItem.image_url} alt={newsItem.title} className="w-full h-64 object-cover my-4" />
      <p className="text-lg">{newsItem.content}</p>
    </div>
  );
}

export default withAuth(NewsDetailPage);
