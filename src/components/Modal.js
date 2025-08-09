import { getUsers } from "../utils/getUsers.js";
import { createUser } from "../utils/createUser.js";

export function createModal() {
  const modalWrapper = document.createElement("div");
  const modalDialog = document.createElement("div");
  const modalContent = document.createElement("div");
  const header = document.createElement("div");
  const logoDiv = document.createElement("div");
  const closeButton = document.createElement("button");
  const body = document.createElement("div");
  const phoneBlock = document.createElement("div");
  const form = document.createElement("form");
  const h2 = document.createElement("h2");
  const inputWrapper = document.createElement("div");
  const codeDiv = document.createElement("div");
  const input = document.createElement("input");
  const submitButton = document.createElement("button");

  modalWrapper.className = "modal-wrapper";
  modalDialog.className = "modal-dialog";
  modalContent.className = "modal_content";
  header.className = "sign-in_header";

  logoDiv.className = "for-logo";
  logoDiv.innerHTML = `<svg data-v-4d58c60b="" width="106" height="24" viewBox="0 0 106 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="ui-icon ">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M21.9905 18.6441C23.3061 16.6669 24.0032 14.345 23.9981 11.9698C23.9981 10.3956 23.6863 8.83664 23.083 7.38415C22.4797 5.92912 21.595 4.61098 20.4797 3.49816C19.3668 2.38535 18.0436 1.50574 16.5886 0.904971C15.1336 0.304202 13.5746 -0.00251931 12.0005 1.55844e-05C9.62526 1.55844e-05 7.3033 0.704715 5.32862 2.02539C3.35648 3.34354 1.8178 5.21935 0.91031 7.41457C0.00281964 9.60978 -0.232925 12.023 0.233495 14.3526C0.697379 16.6796 1.84315 18.819 3.52378 20.4946C5.20441 22.1727 7.3464 23.3134 9.67596 23.7722C12.0055 24.2336 14.4187 23.9902 16.6114 23.0777C18.8041 22.1651 20.6748 20.6213 21.9905 18.6441ZM11.9979 4.09893C12.4669 4.09893 12.9282 4.11414 13.3769 4.15723V10.5401H10.6265V4.15723C11.0778 4.11668 11.529 4.09893 11.9979 4.09893ZM16.6596 7.10531C17.6989 7.29036 18.723 7.54638 19.7268 7.87592V12.497C19.6609 14.4996 18.8193 16.4008 17.377 17.7949C15.9346 19.1891 14.0081 19.9699 12.003 19.9699C9.99789 19.9699 8.07137 19.1891 6.62902 17.7949C5.1892 16.4008 4.34509 14.5021 4.27918 12.497V7.87845C5.283 7.55145 6.30709 7.29289 7.3464 7.10785V12.4615C7.3464 16.3196 8.98647 18.3501 12.003 18.3501C15.0195 18.3501 16.6596 16.3196 16.6596 12.4615V7.10531Z" fill="#7000FF"></path>
          <path d="M90.4477 4.57803V17.0218H87.6365V4.57803H90.4477Z" fill="#7000FF"></path>
          <path fill-rule="evenodd" clip-rule="evenodd" d="M93.738 17.0218V4.57803H98.7799C100.803 4.57803 102.382 5.12557 103.518 6.21811C104.653 7.32078 105.219 8.84679 105.219 10.8012C105.219 12.7531 104.653 14.2816 103.528 15.3741C102.39 16.4768 100.81 17.0218 98.7799 17.0218H93.738ZM98.7799 14.5655C99.9079 14.5655 100.775 14.2182 101.383 13.5338C101.981 12.8494 102.286 11.9368 102.286 10.8012C102.286 9.66302 101.981 8.753 101.383 8.06858C100.775 7.38416 99.9079 7.03688 98.7799 7.03688H96.5416V14.568H98.7799V14.5655Z" fill="#7000FF"></path>
          <path d="M62.7844 12.3729C62.7844 13.9293 61.9048 14.6467 60.5968 14.6467C59.2888 14.6467 58.4422 13.942 58.4422 12.3729V7.23718H55.6208V12.4717C55.6208 15.8837 58.4751 17.2196 60.6196 17.2196C62.7642 17.2196 65.621 15.8837 65.621 12.4717V7.23718H62.7996L62.7844 12.3729Z" fill="#7000FF"></path>
          <path d="M53.233 7.23459V9.61992L47.5928 14.6542H53.5727V17.0395H43.8412V14.6542L49.4889 9.61992H44.0617V7.23459H53.233Z" fill="#7000FF"></path>
          <path d="M79.7479 7.04955C77.9583 7.04955 76.6123 7.77706 75.9456 8.88481C75.2662 7.77706 73.7859 7.04955 72.2523 7.04955C69.2357 7.04955 67.6666 8.97099 67.6666 11.3462V17.0395H70.488V11.7467C70.488 10.6111 71.0837 9.61232 72.4525 9.61232C72.7314 9.59458 73.0102 9.63767 73.2713 9.73906C73.5324 9.83792 73.7707 9.99255 73.9659 10.1903C74.1636 10.388 74.3157 10.6263 74.4145 10.8874C74.5134 11.1485 74.5539 11.4273 74.5362 11.7087V17.0421H77.3575V11.7061C77.3575 10.568 78.0267 9.60979 79.3829 9.60979C80.7365 9.60979 81.3905 10.6085 81.3905 11.7442V17.0345H84.2119V11.3513C84.2119 8.9786 82.7543 7.05462 79.7226 7.05462L79.7479 7.04955Z" fill="#7000FF"></path>
          <path d="M36.9844 14.6467C38.2848 14.6467 39.1618 13.9293 39.1618 12.3729L39.1669 7.23718H41.9882V12.4717C41.9882 15.8837 39.1517 17.2196 36.997 17.2196C34.8424 17.2196 31.9982 15.8837 31.9982 12.4717V7.23718H34.8196V12.3729C34.8196 13.942 35.6865 14.6467 36.9844 14.6467Z" fill="#7000FF"></path>
          </svg>`;

  closeButton.className = "btn_close-modal";
  closeButton.type = "button";
  closeButton.innerHTML = ` <svg data-v-6de7c6fa="" width="28" height="28" viewBox="0 0 24 24" fill="none"
                xmlns="http://www.w3.org/2000/svg" class="ui-icon ">
                <rect width="24" height="24" rx="12" fill="#DFE0E2"></rect>
                <path fill-rule="evenodd" clip-rule="evenodd"
                  d="M8.28033 7.21967C7.98744 6.92678 7.51256 6.92678 7.21967 7.21967C6.92678 7.51256 6.92678 7.98744 7.21967 8.28033L10.9393 12L7.21967 15.7197C6.92678 16.0126 6.92678 16.4874 7.21967 16.7803C7.51256 17.0732 7.98744 17.0732 8.28033 16.7803L12 13.0607L15.7197 16.7803C16.0126 17.0732 16.4874 17.0732 16.7803 16.7803C17.0732 16.4874 17.0732 16.0126 16.7803 15.7197L13.0607 12L16.7803 8.28033C17.0732 7.98744 17.0732 7.51256 16.7803 7.21967C16.4874 6.92678 16.0126 6.92678 15.7197 7.21967L12 10.9393L8.28033 7.21967Z"
                  fill="#4E5155"></path>
              </svg>`;

  body.className = "sign-in_body";
  phoneBlock.className = "sign-in_phone";
  form.method = "dialog";

  h2.className = "sign-in_title";
  h2.textContent = "Войти в Uzum Market";

  inputWrapper.className = "sign-in_input-phone";
  codeDiv.className = "country_code";
  codeDiv.textContent = "+998";

  input.type = "tel";
  input.name = "tel";
  input.id = "login-phone";
  input.placeholder = "00 000-00-00";
  input.required = true;

  submitButton.className = "btn sign-in_btn";
  submitButton.type = "submit";
  submitButton.textContent = "Войти";

  inputWrapper.append(codeDiv, input);
  form.append(h2, inputWrapper, submitButton);
  phoneBlock.append(form);
  body.append(phoneBlock);
  header.append(logoDiv, closeButton);
  modalContent.append(header, body);
  modalDialog.append(modalContent);
  modalWrapper.append(modalDialog);

  const container =
    document.querySelector(".popups-container") || document.body;
  container.appendChild(modalWrapper);

  function closeModal(wrapper, modal) {
    modal.classList.add("modal-dialog--hide");
    modal.addEventListener("animationend", () => wrapper.remove(), {
      once: true,
    });
  }

  modalWrapper.addEventListener("click", (e) => {
    if (e.target === modalWrapper) closeModal(modalWrapper, modalDialog);
  });

  closeButton.addEventListener("click", () => {
    closeModal(modalWrapper, modalDialog);
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const phone = input.value.trim();

    try {
      const users = await getUsers();
      let user = users.find((u) => u.phoneNumber === phone);
      const isNewUser = !user;
      if (!user) {
        user = await createUser(phone);
      }
      localStorage.setItem("currentUserPhone", user.phoneNumber);
      modalAlert(isNewUser);
      setTimeout(() => {
        window.location.href = "/profile";
      }, 1000);
    } catch (error) {
      console.error("Ошибка при авторизации:", error);
    }
  });
}

export function modalAlert(isNewUser) {
  const modal = document.createElement("div");
  modal.className = "modalAlert";
  modal.textContent = isNewUser
    ? "Вы успешно зарегистрировались"
    : "Вы успешно вошли в свой аккаунт";

  document.body.appendChild(modal);

  setTimeout(() => {
    modal.remove();
  }, 4000);
}

export function showAlert(message) {
  const alert = document.createElement("div");
  alert.className = "modalAlert";
  alert.textContent = message;

  document.body.appendChild(alert);

  setTimeout(() => {
    alert.remove();
  }, 5000);
}
