import axios from "axios";
import { showAlert } from "../components/Modal.js";
import { getUsers } from "../utils/getUsers.js";

const form = document.querySelector(".profile-form");
const btnSave = form.querySelector(".btn-save");
const btnExit = form.querySelector(".btn-exit");
const genderButtons = form.querySelectorAll(".gender-button");
const phoneInput = document.getElementById("user-tel");

let selectedGender = null;
let user = null;

// Получаем номер телефона из localStorage
const currentPhone = localStorage.getItem("currentUserPhone");

genderButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    genderButtons.forEach((b) => b.classList.remove("active-gender"));
    btn.classList.add("active-gender");
    selectedGender = btn.dataset.gender;
  });
});

function fillFormWithUserData(userData) {
  form.elements["surname"].value = userData.surname || "";
  form.elements["name"].value = userData.name || "";
  form.elements["middlename"].value = userData.middlename || "";
  form.elements["datetime"].value = userData.datetime || "";
  form.elements["email"].value = userData.email || "";
  phoneInput.value = userData.phoneNumber || "";

  if (userData.gender) {
    selectedGender = userData.gender;
    genderButtons.forEach((btn) => {
      if (btn.dataset.gender === selectedGender) {
        btn.classList.add("selected");
      }
    });
  }
}
async function fetchUser() {
  try {
    const users = await getUsers();
    user = users.find((u) => u.phoneNumber === currentPhone);
    if (!user) return;
    fillFormWithUserData(user);
  } catch (err) {
    console.error("Ошибка при получении данных:", err);
    showAlert("Не удалось загрузить данные");
  }
}

async function saveUserData() {
  if (!user) return;

  const updatedUser = {
    surname: form.elements["surname"].value.trim(),
    name: form.elements["name"].value.trim(),
    middlename: form.elements["middlename"].value.trim(),
    datetime: form.elements["datetime"].value.trim(),
    email: form.elements["email"].value.trim(),
    gender: selectedGender,
    phoneNumber: phoneInput.value.trim(),
  };

  try {
    await axios.patch(`http://localhost:3001/users/${user.id}`, updatedUser);
    showAlert("Данные успешно сохранены");
  } catch (err) {
    console.error("Ошибка при сохранении:", err);
    showAlert("Ошибка при сохранении");
  }
}

function logoutUser() {
  localStorage.removeItem("currentUserPhone");
  showAlert("Вы вышли из системы");
  setTimeout(() => {
    window.location.href = "/";
  }, 1000);
}

btnSave.addEventListener("click", saveUserData);
btnExit.addEventListener("click", logoutUser);
fetchUser();
