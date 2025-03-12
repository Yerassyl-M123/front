"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignIn() {
  const [error, setError] = useState<string | null>(null);
  const [showResetModal, setShowResetModal] = useState(false);
  const [email, setEmail] = useState("");
  const [resetStep, setResetStep] = useState(1); 
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [serverError, setServerError] = useState("");

  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const user = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    try {
      await axios.post("http://localhost:8080/signin", user, { withCredentials: true });
      router.push("/");
    } catch (err: any) {
      setError(err.response?.data?.error || "Ошибка входа");
    }
  };

  const handleResetPassword = async () => {
    try {
      await axios.post("http://localhost:8080/reset-password", { email });
      setResetStep(2); 
    } catch (err: any) {
      setServerError(err.response?.data?.error || "Ошибка при восстановлении пароля");
    }
  };

  const handleVerifyCode = async () => {
    try {
      await axios.post("http://localhost:8080/verify-code", { email, code });
      setResetStep(3); 
    } catch (err: any) {
      setServerError(err.response?.data?.error || "Неверный код");
    }
  };

  const handleUpdatePassword = async () => {
    try {
      await axios.post("http://localhost:8080/update-password", { email, newPassword });
      alert("Пароль успешно изменен!");
      setShowResetModal(false);
    } catch (err: any) {
      setServerError(err.response?.data?.error || "Ошибка обновления пароля");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold text-center mb-6">Вход</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="email" name="email" placeholder="Email" required className="w-full p-2 border rounded" />
          <input type="password" name="password" placeholder="Пароль" required className="w-full p-2 border rounded" />
          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">Войти</button>
        </form>
        <button onClick={() => setShowResetModal(true)} className="mt-4 w-full text-blue-600 underline">
          Забыли пароль?
        </button>
      </div>

      {showResetModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Восстановление пароля</h2>

            {resetStep === 1 && (
              <>
                <p className="mb-2">Введите ваш email</p>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 border rounded mb-2"
                />
                {serverError && <p className="text-red-500">{serverError}</p>}
                <button onClick={handleResetPassword} className="w-full bg-blue-500 text-white p-2 rounded">
                  Отправить код
                </button>
              </>
            )}

            {resetStep === 2 && (
              <>
                <p className="mb-2">Введите код из email</p>
                <input
                  type="text"
                  placeholder="6-значный код"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full p-2 border rounded mb-2"
                />
                {serverError && <p className="text-red-500">{serverError}</p>}
                <button onClick={handleVerifyCode} className="w-full bg-green-500 text-white p-2 rounded">
                  Подтвердить код
                </button>
              </>
            )}

            {resetStep === 3 && (
              <>
                <p className="mb-2">Введите новый пароль</p>
                <input
                  type="password"
                  placeholder="Новый пароль"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full p-2 border rounded mb-2"
                />
                {serverError && <p className="text-red-500">{serverError}</p>}
                <button onClick={handleUpdatePassword} className="w-full bg-blue-500 text-white p-2 rounded">
                  Обновить пароль
                </button>
              </>
            )}

            <button onClick={() => setShowResetModal(false)} className="mt-2 w-full text-gray-600 underline">
              Отмена
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

