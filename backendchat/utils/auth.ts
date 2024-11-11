import axios from "axios";

export async function authenticateUser(token: string) {
  try {
    const response = await axios.get("http://localhost:4001/api/verify-token", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data; // данные пользователя при успешной валидации
  } catch (error) {
    console.error("Ошибка аутентификации:", error);
    return null;
  }
}
