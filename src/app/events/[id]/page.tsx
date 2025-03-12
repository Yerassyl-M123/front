"use client";

import axios from "axios";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { withAuth } from "../../../utils/auth";

interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  image_url: string;
}

function EventDetailPage() {
  const { id } = useParams();
  const [event, setEvent] = useState<Event | null>(null);

  useEffect(() => {
    axios
      .get(`http://localhost:8080/events/${id}`, { withCredentials: true }) 
      .then((response) => setEvent(response.data))
      .catch((error) => console.error("Ошибка загрузки мероприятия:", error));
  }, [id]);

  if (!event) return <p>Загрузка...</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
      <p className="text-gray-500">{event.date} • {event.time} • {event.location}</p>
      <img src={event.image_url} alt={event.title} className="w-full h-64 object-cover my-4" />
      <p className="text-lg">{event.description}</p>
    </div>
  );
}

export default withAuth(EventDetailPage);