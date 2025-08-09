import axios from 'axios';

export async function createUser(phoneNumber) {
  const newUser = {
    phoneNumber,
    favorites: [],
    basketProducts: []
  };

  try {
    const { data } = await axios.post('http://localhost:3001/users', newUser);
    return data;
  } catch (error) {
    console.error('Ошибка при создании пользователя:', error);
    throw error;
  }
}
