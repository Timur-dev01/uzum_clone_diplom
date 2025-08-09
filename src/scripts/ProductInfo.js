import { getGoods } from "../utils/getGoods.js";
import { renderProducts } from "../components/Card.js";
import { has, toggle } from "../utils/favorites.js";
import { updateBasketCounter } from "../components/Header.js";

export async function ProductInfo() {
  const section = document.getElementById("info-section");
  if (!section) {
    console.error("info-section не найден! Убедись, что HTML уже вставлен.");
    return;
  }
  section.innerHTML = "";

  const container = document.createElement("div");
  const imageContainer = document.createElement("div");
  const imageSlider = document.createElement("div");
  const imageBase = document.createElement("div");
  const baseImg = document.createElement("img");
  const prevBtn = document.createElement("button");
  const nextBtn = document.createElement("button");
  const info = document.createElement("div");
  const title = document.createElement("h2");
  const price = document.createElement("p");
  const oldPrice = document.createElement("span");
  const buttonAmount = document.createElement("div");
  const minus = document.createElement("span");
  const amount = document.createElement("span");
  const plus = document.createElement("span");
  const line = document.createElement("div");
  const description = document.createElement("div");
  const descP = document.createElement("p");
  const buttons = document.createElement("div");
  const btnBasket = document.createElement("button");
  const btnFav = document.createElement("button");
  const fullDescSection = document.createElement("div");
  const descDiv = document.createElement("div");
  const h4 = document.createElement("h4");
  const fullDesc = document.createElement("p");
  const similarHead = document.createElement("h2");

  container.id = "info_section";
  imageContainer.className = "image_container";
  imageSlider.className = "image_slider";
  imageBase.className = "image_base";
  prevBtn.className = "slider__btn slider__btn--prev";
  prevBtn.innerHTML = `<img src="/icons/bracket-left.png" alt="prev">`;
  nextBtn.className = "slider__btn slider__btn--next";
  nextBtn.innerHTML = `<img src="/icons/bracket-right.png" alt="next">`;
  info.className = "info";
  title.className = "title";
  price.className = "price";
  oldPrice.className = "oldPrice";
  buttonAmount.className = "button_amount";
  minus.className = "minus";
  minus.innerHTML = "&#8722;";
  amount.className = "amount";
  plus.className = "plus";
  plus.innerHTML = "&#43;";
  line.className = "line";
  description.className = "description";
  buttons.className = "buttons";
  btnBasket.className = "btn btn_basket";
  btnFav.className = "btn btn_favorites";
  fullDescSection.className = "full_description";
  descDiv.className = "desc_div";
  similarHead.className = "similarHead";

  description.appendChild(descP);
  buttons.append(btnBasket, btnFav);
  info.append(title, price, buttonAmount, line, description, buttons);
  imageBase.append(prevBtn, baseImg, nextBtn);
  imageContainer.append(imageSlider, imageBase);
  container.append(imageContainer, info);
  section.append(container);
  descDiv.append(h4, fullDesc);
  fullDescSection.appendChild(descDiv);
  section.appendChild(fullDescSection);


  const id =
    new URLSearchParams(window.location.search).get("id") ||
    new URLSearchParams(window.location.hash.split("?")[1]).get("id");

  const data = await getGoods();
  const product = data.find((item) => item.id == id);
  if (!product) return;

  document.title = product.title;
  baseImg.src = product.media[0];
  baseImg.alt = product.title;
  title.textContent = product.title;

  let currentIndex = 0;
  const discountedPrice = Math.ceil(
    product.price - (product.price * product.salePercentage) / 100
  );
  let count = 1;

  function updateButtons() {
    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex === product.media.length - 1;
  }

  function updatePriceDisplay() {
    price.textContent = `${discountedPrice * count} сум`;
    if (product.salePercentage > 0) {
      oldPrice.textContent = `${product.price * count} сум`;
      price.append(oldPrice);
    }
  }

  prevBtn.addEventListener("click", () => {
    if (currentIndex > 0) {
      currentIndex--;
      baseImg.src = product.media[currentIndex];
      updateButtons();
    }
  });

  nextBtn.addEventListener("click", () => {
    if (currentIndex < product.media.length - 1) {
      currentIndex++;
      baseImg.src = product.media[currentIndex];
      updateButtons();
    }
  });

  minus.addEventListener("click", () => {
    if (count > 1) {
      count--;
      amount.textContent = count;
      updatePriceDisplay();
    }
  });

  plus.addEventListener("click", () => {
    if (count < 10) {
      count++;
      amount.textContent = count;
      updatePriceDisplay();
    }
  });

  btnBasket.addEventListener("click", () => {
    const card = JSON.parse(localStorage.getItem("card")) || [];
    const existingItem = card.find((item) => item.id === product.id);
    if (existingItem) {
      existingItem.amount += count;
    } else {
      card.push({ id: product.id, amount: count });
    }
    localStorage.setItem("card", JSON.stringify(card));
    updateBasketCounter();
  });

  btnFav.addEventListener("click", () => {
    toggle(product.id);
    const nowActive = has(product.id);
    btnFav.classList.toggle("active", nowActive);
    btnFav.textContent = nowActive ? "В избранном" : "Добавить в избранные";
  });

  window.addEventListener("favorites:changed", () => {
    const nowActive = has(product.id);
    btnFav.classList.toggle("active", nowActive);
    btnFav.textContent = nowActive ? "В избранном" : "Добавить в избранные";
  });

  if (product.description) {
    descP.textContent = product.description;
    fullDesc.textContent = product.description;
  } else {
    descP.textContent = "Характеристики товара не указаны";
    fullDesc.textContent = "Данный товар не имеет подробного описания";
  }

  const similar = document.getElementById("similar-products-container");
  similar.innerHTML = "";
  similarHead.textContent = "Похожие товары";
  similar.append(similarHead);
  const filtered = data.filter(
    (item) => item.type === product.type && item.id !== product.id
  );
  renderProducts(filtered.slice(0, 5), similar);

  updateButtons();
  updatePriceDisplay();
}
