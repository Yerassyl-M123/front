"use client";

import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { withAuth } from "../../utils/auth";

interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  image_url: string;
}

function EventsListPage() {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    axios
      .get("http://localhost:8080/events", { withCredentials: true })
      .then((response) => setEvents(response.data))
      .catch((error) => console.error("Ошибка загрузки мероприятий:", error));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Ближайшие мероприятия</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {events.map((event) => (
          <Link key={event.id} href={`/events/${event.id}`} className="block">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <img src={event.image_url} alt={event.title} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h2 className="text-xl font-bold">{event.title}</h2>
                <p className="text-gray-500">
                  {event.date} • {event.time} • {event.location}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default withAuth(EventsListPage);