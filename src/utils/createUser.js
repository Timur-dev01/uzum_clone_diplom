import axios from 'axios';

export async function createUser(phoneNumber, password) {
  // Получаем данные из LocalStorage
  const favoritesFromLocal = JSON.parse(localStorage.getItem('favorites')) || [];
  const basketFromLocal = JSON.parse(localStorage.getItem('basketCard')) || [];

  const newUser = {
    phoneNumber,
    password,
    favorites: favoritesFromLocal,
    basketProducts: basketFromLocal
  };

  try {
    const { data } = await axios.post('http://localhost:3001/users', newUser);

    // После сохранения очищаем localStorage
    localStorage.removeItem('favorites');
    localStorage.removeItem('basketCard');

    return data;
  } catch (error) {
    console.error('Ошибка при создании пользователя:', error);
    throw error;
  }
}
