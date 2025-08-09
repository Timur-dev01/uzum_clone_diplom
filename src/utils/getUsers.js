import axios from "axios";

export async function getUsers() {
  try {
    const { data: users } = await axios.get("http://localhost:3001/users");
    return users; 
  } catch (err) {
    console.error("Ошибка при получении пользователей:", err);
    return [];
  }
}
