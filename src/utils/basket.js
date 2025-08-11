import axios from "axios";
import { showAlert } from "../components/Modal.js";

const API_URL = "http://localhost:3001";

async function getUserByPhone(phone) {
  try {
    const response = await axios.get(`${API_URL}/users?phoneNumber=${phone}`);
    if (response.data.length > 0) {
      return response.data[0];
    } else {
      return null;
    }
  } catch (error) {
    console.error("Ошибка получения пользователя по телефону:", error);
    return null;
  }
}

function sanitizeAmount(amount) {
  const num = Number(amount);
  return num > 0 ? num : 1;
}

export async function addProductToBasket(product) {
  const currentUserPhone = localStorage.getItem("currentUserPhone");
  const card = JSON.parse(localStorage.getItem("card")) || [];

  const productAmount = sanitizeAmount(product.amount);

  const existingItem = card.find((item) => item.id === product.id);

  if (existingItem) {
    existingItem.amount = sanitizeAmount(existingItem.amount) + productAmount;
  } else {
    card.push({ ...product, amount: productAmount });
  }

  localStorage.setItem("card", JSON.stringify(card));

  if (currentUserPhone) {
    const user = await getUserByPhone(currentUserPhone);

    if (!user) {
      console.error("Пользователь не найден по телефону", currentUserPhone);
      return;
    }

    const updatedBasket = [...(user.basketProducts || [])];
    const index = updatedBasket.findIndex((item) => item.id === product.id);

    if (index >= 0) {
      updatedBasket[index].amount =
        sanitizeAmount(updatedBasket[index].amount) + productAmount;
    } else {
      updatedBasket.push({ ...product, amount: productAmount });
    }

    try {
      await axios.patch(`${API_URL}/users/${user.id}`, {
        basketProducts: updatedBasket,
      });
    } catch (error) {
      console.error("Ошибка при обновлении корзины на сервере:", error);
    }
  }
}

export async function updateBasketQuantity(productId, delta) {
  const card = JSON.parse(localStorage.getItem("card")) || [];
  const product = card.find((item) => item.id === productId);
  if (!product) return;

  const deltaNum = Number(delta) || 0;
  const currentAmount = sanitizeAmount(product.amount);
  product.amount = currentAmount + deltaNum;

  if (product.amount < 1) {
    const updated = card.filter((item) => item.id !== productId);
    localStorage.setItem("card", JSON.stringify(updated));
  } else {
    localStorage.setItem("card", JSON.stringify(card));
  }

  const currentUserPhone = localStorage.getItem("currentUserPhone");
  if (currentUserPhone) {
    try {
      const { data: userData } = await axios.get(
        `${API_URL}/users?phoneNumber=${currentUserPhone}`
      );
      const user = userData.length > 0 ? userData[0] : null;
      if (!user) return;

      let basket = user.basketProducts || [];

      basket = basket
        .map((item) =>
          item.id === productId ? { ...item, amount: product.amount } : item
        )
        .filter((item) => item.amount > 0);

      await axios.patch(`${API_URL}/users/${user.id}`, {
        basketProducts: basket,
      });
    } catch (err) {
      console.error("Ошибка при обновлении корзины на сервере:", err);
    }
  }
}

export function getProductsFromCard() {
  const card = JSON.parse(localStorage.getItem("card")) || [];
  return card.map((item) => ({
    ...item,
    amount: sanitizeAmount(item.amount),
  }));
}

export function saveProductsToCard(data) {
  localStorage.setItem("card", JSON.stringify(data));
}

// Сделал async, синхронизирует и localStorage, и backend
export async function removeProductFromCard(productId) {
  // Локальное удаление
  const card = getProductsFromCard();
  const updated = card.filter((item) => item.id !== productId);
  saveProductsToCard(updated);

  // Удаление с сервера
  const currentUserPhone = localStorage.getItem("currentUserPhone");
  if (currentUserPhone) {
    try {
      const { data: userData } = await axios.get(
        `${API_URL}/users?phoneNumber=${currentUserPhone}`
      );
      const user = userData.length > 0 ? userData[0] : null;
      if (!user) return;

      const updatedBasket = (user.basketProducts || []).filter(
        (item) => item.id !== productId
      );

      await axios.patch(`${API_URL}/users/${user.id}`, {
        basketProducts: updatedBasket,
      });
    } catch (error) {
      console.error("Ошибка при удалении товара из корзины на сервере:", error);
    }
  }
}

export function clearCard() {
  localStorage.removeItem("card");
}

export async function handleCheckout() {
  const currentUserPhone = localStorage.getItem("currentUserPhone");
  if (!currentUserPhone) {
    clearCard();
    showAlert("Пожалуйста, войдите в аккаунт для оформления заказа.");
    return;
  }

  const user = await getUserByPhone(currentUserPhone);
  if (!user) {
    clearCard();
    showAlert("Пользователь не найден.");
    return;
  }

  const basketProducts = user.basketProducts || [];

  if (basketProducts.length === 0) {
    showAlert("Корзина пуста.");
    return;
  }

  const newOrder = {
    id: Date.now(),
    products: basketProducts,
    date: new Date().toISOString(),
    status: "new",
  };

  const updatedOrders = user.orders ? [...user.orders, newOrder] : [newOrder];

  try {
    await axios.patch(`${API_URL}/users/${user.id}`, {
      basketProducts: [],
      orders: updatedOrders,
    });

    clearCard();

    showAlert("Заказ успешно оформлен!");
  } catch (error) {
    console.error("Ошибка оформления заказа:", error);
    showAlert("Произошла ошибка при оформлении заказа.");
  }
}
