"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { withAdminAuth } from "../../utils/withAdminAuth";

interface Course {
  id: number;
  title: string;
  duration: number;
  slots: number;
  price: number;
  level: string;
  image_url: string;
  details: string;
}

interface News {
  id: number;
  title: string;
  date: string;
  content: string;
  image_url: string;
}

interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  image_url: string;
}

function AdminPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [modalType, setModalType] = useState<string | null>(null);
  const [news, setNews] = useState<News[]>([]);
  const [message, setMessage] = useState("");
  const [newsMessage, setNewsMessage] = useState("");
  const [events, setEvents] = useState<Event[]>([]);
  const [eventMessage, setEventMessage] = useState("");
  const [form, setForm] = useState<Omit<Course, "id" | "details"> & { details: { methodology: string; format: string; language: string; start_date: string; total_hours: number; schedule: string; qualification: string; special_conditions: string; about_course: string } }>({
    title: "",
    duration: 0,
    slots: 0,
    price: 0,
    level: "",
    image_url: "",
    details: {
      methodology: "",
      format: "",
      language: "",
      start_date: "",
      total_hours: 0,
      schedule: "",
      qualification: "",
      special_conditions: "",
      about_course: "",
    },
  });

  const [newsForm, setNewsForm] = useState<Omit<News, "id">>({
    title: "",
    date: "",
    content: "",
    image_url: "",
  });

  const [eventForm, setEventForm] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
    description: "",
    image_url: "",
  });

  useEffect(() => {
    fetchCourses();
    fetchNews();
    fetchEvents();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await axios.get("http://localhost:8080/courses", { withCredentials: true });
      setCourses(res.data);
    } catch (err) {
      console.error("Ошибка загрузки курсов:", err);
    }
  };

  const openModal = (item: any, type: string) => {
    let parsedItem = { ...item };
  
    if (type === "courses" && typeof item.details === "string") {
      try {
        parsedItem.details = JSON.parse(item.details);
      } catch (error) {
        console.error("Ошибка парсинга details:", error);
        parsedItem.details = {};
      }
    }
  
    setSelectedItem(parsedItem);
    setModalType(type);
  };

  const closeModal = () => {
    setSelectedItem(null);
    setModalType(null);
  };

  const handleUpdate = async () => {
    if (!selectedItem || !modalType) return;

    try {
      const updatedData = {
        ...selectedItem,
        details: JSON.stringify(selectedItem.details), 
      };

      await axios.put(`http://localhost:8080/${modalType}/${selectedItem.id}`, updatedData, { withCredentials: true });

      if (modalType === "courses") fetchCourses();
      if (modalType === "news") fetchNews();
      if (modalType === "events") fetchEvents();

      closeModal();
    } catch (err) {
      console.error("Ошибка обновления:", err);
    }
  };

  const fetchNews = async () => {
    try {
      const res = await axios.get("http://localhost:8080/news", { withCredentials: true });
      setNews(res.data);
    } catch (err) {
      console.error("Ошибка загрузки новостей:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/createcourses", { ...form, details: JSON.stringify(form.details) }, { withCredentials: true });
      fetchCourses();
      setForm({
        title: "",
        duration: 0,
        slots: 0,
        price: 0,
        level: "",
        image_url: "",
        details: {
          methodology: "",
          format: "",
          language: "",
          start_date: "",
          total_hours: 0,
          schedule: "",
          qualification: "",
          special_conditions: "",
          about_course: "",
        },
      });
    } catch (err) {
      console.error("Ошибка добавления курса:", err);
    }
  };

  const handleCourseSubmit = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name in form.details) {
      setForm((prevForm) => ({
        ...prevForm,
        details: {
          ...prevForm.details,
          [name]: value,
        },
      }));
    } else {
      setForm((prevForm) => ({
        ...prevForm,
        [name]: name === "duration" || name === "slots" || name === "price" ? parseFloat(value) || 0 : value,
      }));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!selectedItem) return;
  
    const { name, value } = e.target;
  
    setSelectedItem((prev: any) => {
      const numericFields = ["duration", "slots", "price", "total_hours"];
      const newValue = numericFields.includes(name) ? parseInt(value) || 0 : value;

      if (prev.details && name in prev.details) {
        return {
          ...prev,
          details: {
            ...prev.details,
            [name]: newValue, 
          },
        };
      } else {
        return {
          ...prev,
          [name]: newValue, 
        };
      }
    });
  };
  

  const handleNewsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/addnews", newsForm, { withCredentials: true });
      fetchNews();
      setNewsForm({ title: "", date: "", content: "", image_url: "" });
    } catch (err) {
      console.error("Ошибка добавления новости:", err);
    }
  };

  const handleNewsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewsForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleDeleteCourse = async (id: number) => {
    try {
      await axios.delete(`http://localhost:8080/courses/${id}`, { withCredentials: true });
      setCourses(courses.filter((course) => course.id !== id));
    } catch (err) {
      console.error("Ошибка удаления курса:", err);
    }
  };

  const handleDeleteNews = async (id: number) => {
    try {
      await axios.delete(`http://localhost:8080/news/${id}`, { withCredentials: true });
      setNews(news.filter((newsItem) => newsItem.id !== id));
    } catch (err) {
      console.error("Ошибка удаления новости:", err);
    }
  };

  const fetchEvents = async () => {
    try {
      const res = await axios.get("http://localhost:8080/events", { withCredentials: true });
      setEvents(res.data);
    } catch (err) {
      console.error("Ошибка загрузки событий:", err);
    }
  };

  const handleEventChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEventForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleEventSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/events", eventForm, { withCredentials: true });
      fetchEvents();
      setEventForm({
                title: "", date: "", time: "", location: "", description: "", image_url: "",
                });
    } catch (err) {
      console.error("Ошибка добавления новости:", err);
    }
  };

  const handleDeleteEvent = async (id: number) => {
    try {
      await axios.delete(`http://localhost:8080/events/${id}`, { withCredentials: true });
      fetchEvents();
    } catch (err) {
      console.error("Ошибка удаления события:", err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
    <h2 className="text-2xl font-bold mb-4">Добавить новый курс</h2>
    {message && <p className="mb-4 text-center text-green-600">{message}</p>}
    <form onSubmit={handleSubmit} className="space-y-4">
      <input type="text" name="title" placeholder="Название курса" value={form.title} onChange={handleCourseSubmit} className="w-full p-2 border rounded" required />
      <input type="number" name="duration" placeholder="Продолжительность (недели)"  onChange={handleCourseSubmit} className="w-full p-2 border rounded" required />
      <input type="number" name="slots" placeholder="Свободные места"  onChange={handleCourseSubmit} className="w-full p-2 border rounded" required />
      <input type="number" name="price" placeholder="Цена (тенге)"  onChange={handleCourseSubmit} className="w-full p-2 border rounded" required />
      <input type="text" name="level" placeholder="Уровень (Начинающий, Средний)" value={form.level} onChange={handleCourseSubmit} className="w-full p-2 border rounded" required />
      <input type="text" name="image_url" placeholder="Ссылка на изображение" value={form.image_url} onChange={handleCourseSubmit} className="w-full p-2 border rounded" />
      <h3 className="text-lg font-bold mt-4">Дополнительные детали курса</h3>
      <input type="text" name="methodology" placeholder="Методика" value={form.details.methodology} onChange={handleCourseSubmit} className="w-full p-2 border rounded" required />
      <input type="text" name="format" placeholder="Формат (Онлайн / Офлайн)" value={form.details.format} onChange={handleCourseSubmit} className="w-full p-2 border rounded" required />       
      <input type="text" name="language" placeholder="Язык" value={form.details.language} onChange={handleCourseSubmit} className="w-full p-2 border rounded" required />
      <input type="date" name="start_date" placeholder="Дата начала" value={form.details.start_date} onChange={handleCourseSubmit} className="w-full p-2 border rounded" required />       
      <input type="number" name="total_hours" placeholder="Количество часов" onChange={handleCourseSubmit} className="w-full p-2 border rounded" required />
      <input type="text" name="schedule" placeholder="Расписание (например, Пн-Сб)" value={form.details.schedule} onChange={handleCourseSubmit} className="w-full p-2 border rounded" required />
      <input type="text" name="qualification" placeholder="Выдаваемая квалификация" value={form.details.qualification} onChange={handleCourseSubmit} className="w-full p-2 border rounded" required />       
      <textarea name="special_conditions" placeholder="Особые условия" value={form.details.special_conditions} onChange={handleCourseSubmit} className="w-full p-2 border rounded" required />       
      <textarea name="about_course" placeholder="О курсе" value={form.details.about_course} onChange={handleCourseSubmit} className="w-full p-2 border rounded" required />
      <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">Добавить курс</button>
    </form>

      <h2 className="text-2xl font-bold mb-4">Управление курсами</h2>
      {courses.map((course) => (
        <div key={course.id} className="border p-4 rounded shadow-md mb-4">
          <h3 className="text-lg font-bold">{course.title}</h3>
          <div className="flex gap-2 mt-2">
            <button onClick={() => openModal(course, "courses")} className="px-4 py-2 bg-yellow-500 text-white rounded">Обновить</button>
            <button onClick={() => handleDeleteCourse(course.id)} className="px-4 py-2 bg-red-500 text-white rounded">Удалить</button>
          </div>
        </div>
      ))}

<h2 className="text-2xl font-bold mt-10 mb-4">Добавить новость</h2>
      {newsMessage && <p className="mb-4 text-center text-green-600">{newsMessage}</p>}
      <form onSubmit={handleNewsSubmit} className="space-y-4">
        <input type="text" name="title" placeholder="Заголовок" value={newsForm.title} onChange={handleNewsChange} className="w-full p-2 border rounded" required />
        <input type="date" name="date" placeholder="Дата" value={newsForm.date} onChange={handleNewsChange} className="w-full p-2 border rounded" required />
        <textarea name="content" placeholder="Текст новости" value={newsForm.content} onChange={handleNewsChange} className="w-full p-2 border rounded" required />
        <input type="text" name="image_url" placeholder="Ссылка на изображение" value={newsForm.image_url} onChange={handleNewsChange} className="w-full p-2 border rounded" required />
        <button type="submit" className="w-full bg-green-500 text-white py-2 rounded">Добавить новость</button>
      </form>

      <h2 className="text-2xl font-bold mt-10 mb-4">Управление новостями</h2>
      {news.map((newsItem) => (
        <div key={newsItem.id} className="border p-4 rounded shadow-md mb-4">
          <h3 className="text-lg font-bold">{newsItem.title}</h3>
          <div className="flex gap-2 mt-2">
            <button onClick={() => openModal(newsItem, "news")} className="px-4 py-2 bg-yellow-500 text-white rounded">Обновить</button>
            <button onClick={() => handleDeleteNews(newsItem.id)} className="px-4 py-2 bg-red-500 text-white rounded">Удалить</button>
          </div>
        </div>
      ))}

      <h2 className="text-2xl font-bold mb-4">Добавить новое событие</h2>
      {eventMessage && <p className="mb-4 text-center text-green-600">{eventMessage}</p>}
      <form onSubmit={handleEventSubmit} className="space-y-4">
        <input type="text" name="title" placeholder="Название события" value={eventForm.title} onChange={handleEventChange} className="w-full p-2 border rounded" required />
        <input type="date" name="date" value={eventForm.date} onChange={handleEventChange} className="w-full p-2 border rounded" required />
        <input type="text" name="time" placeholder="Время" value={eventForm.time} onChange={handleEventChange} className="w-full p-2 border rounded" required />
        <input type="text" name="location" placeholder="Место" value={eventForm.location} onChange={handleEventChange} className="w-full p-2 border rounded" required />
        <textarea name="description" placeholder="Описание" value={eventForm.description} onChange={handleEventChange} className="w-full p-2 border rounded" required />
        <input type="text" name="image_url" placeholder="Ссылка на изображение" value={eventForm.image_url} onChange={handleEventChange} className="w-full p-2 border rounded" />
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">Добавить событие</button>
      </form>

      <h2 className="text-2xl font-bold mt-10">Список событий</h2>
      {events.map((event) => (
        <div key={event.id} className="border p-4 rounded shadow-md mb-4">
          <h3 className="text-lg font-bold">{event.title}</h3>
          <div className="flex gap-2 mt-2">
            <button onClick={() => openModal(event, "events")} className="px-4 py-2 bg-yellow-500 text-white rounded">Обновить</button>
            <button onClick={() => handleDeleteEvent(event.id)} className="px-4 py-2 bg-red-500 text-white rounded">Удалить</button>
          </div>
        </div>
      ))}

      {selectedItem && modalType && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-[600px] max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Редактировать</h2>
            <input type="text" name="title" value={selectedItem.title} onChange={handleChange} className="w-full p-2 border rounded mb-2" placeholder="Название" />
            {modalType === "courses" && selectedItem.details &&(
              <>
                <input type="number" name="duration" placeholder="Продолжительность (недели)" value={selectedItem.duration} onChange={handleChange} className="w-full p-2 border rounded mb-2" />
                <input type="number" name="slots" placeholder="Свободные места" value={selectedItem.slots} onChange={handleChange} className="w-full p-2 border rounded mb-2"  />
                <input type="number" name="price" placeholder="Цена (тенге)" value={selectedItem.price} onChange={handleChange} className="w-full p-2 border rounded mb-2"  />
                <input type="text" name="level" placeholder="Уровень (Начинающий, Средний)" value={selectedItem.level} onChange={handleChange} className="w-full p-2 border rounded mb-2"  />
                <input type="text" name="image_url" placeholder="Ссылка на изображение" value={selectedItem.image_url} onChange={handleChange} className="w-full p-2 border rounded mb-2" />
                <h3 className="text-lg font-bold mt-4">Дополнительные детали курса</h3>
                <input type="text" name="methodology" placeholder="Методика" value={selectedItem.details.methodology} onChange={handleChange} className="w-full p-2 border rounded mb-2"  />
                <input type="text" name="format" placeholder="Формат (Онлайн / Офлайн)" value={selectedItem.details.format} onChange={handleChange} className="w-full p-2 border rounded mb-2"  />       
                <input type="text" name="language" placeholder="Язык" value={selectedItem.details.language} onChange={handleChange} className="w-full p-2 border rounded mb-2"  />
                <input type="date" name="start_date" placeholder="Дата начала" value={selectedItem.details.start_date} onChange={handleChange} className="w-full p-2 border rounded mb-2"  />       
                <input type="number" name="total_hours" placeholder="Количество часов" value={selectedItem.details.total_hours} onChange={handleChange} className="w-full p-2 border rounded mb-2"  />
                <input type="text" name="schedule" placeholder="Расписание (например, Пн-Сб)" value={selectedItem.details.schedule} onChange={handleChange} className="w-full p-2 border rounded mb-2"  />
                <input type="text" name="qualification" placeholder="Выдаваемая квалификация" value={selectedItem.details.qualification} onChange={handleChange} className="w-full p-2 border rounded mb-2"  />       
                <textarea name="special_conditions" placeholder="Особые условия" value={selectedItem.details.special_conditions} onChange={handleChange} className="w-full p-2 border rounded mb-2"  />       
                <textarea name="about_course" placeholder="О курсе" value={selectedItem.details.about_course} onChange={handleChange} className="w-full p-2 border rounded mb-2"  />
              </>
            )}
            {modalType === "news" && (
              <>
              {/* <textarea name="content" value={selectedItem.content} onChange={handleChange} className="w-full p-2 border rounded mb-2" placeholder="Содержание" /> */}
              <input type="date" name="date" placeholder="Дата" value={selectedItem.date} onChange={handleChange} className="w-full p-2 border rounded mb-2"/>
              <textarea name="content" placeholder="Текст новости" value={selectedItem.content} onChange={handleChange} className="w-full p-2 border rounded mb-2"/>
              <input type="text" name="image_url" placeholder="Ссылка на изображение" value={selectedItem.image_url} onChange={handleChange} className="w-full p-2 border rounded mb-2"/>
              </>
            )}
            {modalType === "events" && (
              <>
                <input type="text" name="date" value={selectedItem.date} onChange={handleChange} className="w-full p-2 border rounded mb-2" placeholder="Дата" />
                <textarea name="description" value={selectedItem.description} onChange={handleChange} className="w-full p-2 border rounded mb-2" placeholder="Описание" />
              </>
            )}
            <div className="flex justify-end gap-2">
              <button onClick={handleUpdate} className="px-4 py-2 bg-blue-500 text-white rounded">Сохранить</button>
              <button onClick={closeModal} className="px-4 py-2 bg-gray-500 text-white rounded">Отмена</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default withAdminAuth(AdminPage);

