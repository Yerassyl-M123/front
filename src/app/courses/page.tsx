"use client";

import axios from "axios";
import { parseCookies } from "nookies";
import { useEffect, useState } from "react";
import { withAuth } from "../../utils/auth";

interface Course {
  id: number;
  title: string;
  duration: number;
  slots: number;
  price: number;
  level: string;
  image_url?: string;
  details: string;
}

interface CourseDetails {
  methodology: string;
  format: string;
  language: string;
  start_date: string;
  total_hours: number;
  schedule: string;
  qualification: string;
  special_conditions: string;
  about_course: string;
}

function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  useEffect(() => {
    axios
      .get("http://localhost:8080/courses", { withCredentials: true }) 
      .then((res) => setCourses(res.data))
      .catch((err) => console.error("Ошибка загрузки курсов:", err));
  }, []);

  const enrollCourse = async (id: number, event?: React.MouseEvent) => {
    if (event) event.stopPropagation();

    try {
      const cookies = parseCookies();
      if (!cookies.session) {
        alert("Вы должны войти в систему для записи на курс.");
        return;
      }

      const response = await axios.post(
        `http://localhost:8080/courses/${id}/enroll`,
        {},
        {
          withCredentials: true, 
        }
      );

      alert(response.data.message || response.data.error);
    } catch (error: any) {
      console.error("Ошибка записи на курс:", error.response?.data || error);
      alert(error.response?.data?.error || "Ошибка при записи на курс.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-[#070D59] mb-4">Доступные курсы</h1>

      {selectedCourse ? (
        <div className="border p-6 rounded shadow-lg bg-white">
          <button
            onClick={() => setSelectedCourse(null)}
            className="text-blue-500 underline mb-4"
          >
            Назад
          </button>

          <h2 className="text-2xl font-bold text-[#070D59]">{selectedCourse.title}</h2>
          <p className="text-lg font-semibold">{selectedCourse.price} Tг</p>
          <p>Уровень: {selectedCourse.level}</p>
          <p>Длительность: {selectedCourse.duration} недель</p>

          {selectedCourse.details && (() => {
            try {
              const parsedDetails: CourseDetails = JSON.parse(selectedCourse.details);
              return (
                <div className="mt-4 p-4 border rounded bg-gray-100">
                  <h3 className="text-lg font-bold mb-2">Детали курса:</h3>
                  <p><strong>Методика:</strong> {parsedDetails.methodology}</p>
                  <p><strong>Формат:</strong> {parsedDetails.format}</p>
                  <p><strong>Язык:</strong> {parsedDetails.language}</p>
                  <p><strong>Начало:</strong> {parsedDetails.start_date}</p>
                  <p><strong>Академические часы:</strong> {parsedDetails.total_hours}</p>
                  <p><strong>Дни занятий:</strong> {parsedDetails.schedule}</p>
                  <p><strong>Квалификация:</strong> {parsedDetails.qualification}</p>
                  <p><strong>Особые условия:</strong> {parsedDetails.special_conditions}</p>
                  <p><strong>О курсе:</strong> {parsedDetails.about_course}</p>
                </div>
              );
            } catch (error) {
              console.error("Ошибка парсинга details:", error);
              return <p className="text-red-500">Ошибка загрузки деталей курса</p>;
            }
          })()}

          <button
            onClick={(e) => enrollCourse(selectedCourse.id, e)}
            className="mt-4 px-6 py-2 bg-blue-500 text-white rounded"
          >
            Записаться
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course.id}
              className="border p-6 rounded shadow-lg bg-white cursor-pointer hover:bg-gray-100 transition"
              onClick={() => setSelectedCourse(course)}
            >
              <h2 className="text-lg font-bold">{course.title}</h2>
              <p>{course.level}</p>
              <p>{course.duration} недель</p>
              <p>Свободные места: {course.slots}</p>
              <p className="text-lg text-[#070D59] font-semibold">{course.price} Тг</p>
              <button
                onClick={(e) => enrollCourse(course.id, e)}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
              >
                Записаться
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default withAuth(CoursesPage);
