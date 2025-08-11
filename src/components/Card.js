import { getGoods } from "../utils/getGoods.js";
import { has, toggle } from "../utils/favorites.js";
import { updateBasketCounter } from "../components/Header.js";
import { addProductToBasket } from "../utils/basket.js";

export function createProductCard(product) {
  const card = document.createElement("div");
  const imageContainer = document.createElement("div");
  const img = document.createElement("img");
  const heartIcon = document.createElement("div");
  const title = document.createElement("p");
  const reviews = document.createElement("div");
  const reviewsStar = document.createElement("div");
  const rating = document.createElement("span");
  const priceContainer = document.createElement("div");
  const oldPrice = document.createElement("p");
  const price = document.createElement("p");
  const basketDiv = document.createElement("div");

  card.className = "product-card";
  card.dataset.id = product.id;
  imageContainer.className = "product-image";
  img.src = product.media[0];
  img.alt = product.title;
  img.loading = "lazy";
  heartIcon.className = "heart-icon";
  heartIcon.innerHTML = `
    <svg class="feather feather-heart" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06
        a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78
        1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  `;
  title.className = "product-title";
  title.textContent = product.title;
  reviews.className = "reviews";
  reviewsStar.innerHTML = `<svg data-v-96c69a2c="" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" data-test-id="icon__rating-star" class="ui-icon  rating-icon">
  <path d="M6.32279 0.887954C6.11862 0.790604 5.88141 0.790604 5.67723 0.887954C5.50072 0.972112 5.4034 1.11823 5.35433 1.19839C5.30359 1.28126 5.25151 1.38682 5.20075 1.48972L4.12288 3.67336L1.71185 4.02577C1.59836 4.04233 1.48191 4.05933 1.38745 4.08204C1.29607 4.10402 1.12711 4.15154 0.992657 4.29346C0.837112 4.45765 0.76396 4.68325 0.793571 4.90747C0.819166 5.10129 0.928088 5.23891 0.989188 5.31033C1.05235 5.38415 1.13667 5.46625 1.21885 5.54626L2.96275 7.24481L2.55127 9.64395C2.53184 9.75707 2.51192 9.87312 2.50424 9.97001C2.49682 10.0637 2.48965 10.2392 2.583 10.411C2.69098 10.6098 2.88292 10.7492 3.10535 10.7905C3.29766 10.8261 3.4623 10.7651 3.54912 10.729C3.63889 10.6918 3.7431 10.637 3.84468 10.5835L6.00001 9.45005L8.15535 10.5835C8.25693 10.637 8.36114 10.6918 8.45091 10.729C8.53773 10.7651 8.70237 10.8261 8.89467 10.7905C9.11711 10.7492 9.30904 10.6098 9.41702 10.411C9.51037 10.2392 9.5032 10.0637 9.49578 9.97001C9.48811 9.87312 9.46818 9.75708 9.44876 9.64397L9.03727 7.24481L10.7812 5.54624C10.8634 5.46623 10.9477 5.38414 11.0108 5.31033C11.0719 5.23891 11.1809 5.10129 11.2065 4.90747C11.2361 4.68325 11.1629 4.45765 11.0074 4.29346C10.8729 4.15154 10.704 4.10402 10.6126 4.08204C10.5181 4.05933 10.4017 4.04233 10.2882 4.02577L7.87714 3.67336L6.7993 1.48976C6.74853 1.38686 6.69644 1.28127 6.6457 1.19839C6.59662 1.11823 6.4993 0.972112 6.32279 0.887954Z" fill="#FFB54C"></path>
  </svg>`;
  let ratingValue = product.rating;
  if (Number.isInteger(ratingValue)) {
    ratingValue = ratingValue.toFixed(1);
  }
  rating.className = "rating";
  rating.textContent = `${ratingValue} (Нет отзывов)`; // пока отзыв захардкожен
  priceContainer.className = "price-container";
  oldPrice.className = "product-price-with-discount";
  oldPrice.textContent = `${product.price} сум`;
  price.className = "product-price";
  price.textContent = `${Math.round(
    product.price - (product.price * product.salePercentage) / 100
  )} сум`;
  basketDiv.className = "basket-div";
  basketDiv.innerHTML = `
    <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
      <g>
        <path d="M397.78,316H192.65A15,15,0,0,1,178,304.33L143.46,153.85
          a15,15,0,0,1,14.62-18.36H432.35A15,15,0,0,1,447,153.85L412.4,
          304.33A15,15,0,0,1,397.78,316ZM204.59,286H385.84l27.67-120.48H176.91Z"/>
        <path d="M222,450a57.48,57.48,0,1,1,57.48-57.48A57.54,57.54,0,0,1,222,
          450Zm0-84.95a27.48,27.48,0,1,0,27.48,27.47A27.5,27.5,0,0,0,222,365.05Z"/>
        <path d="M368.42,450a57.48,57.48,0,1,1,57.48-57.48A57.54,57.54,0,0,1,
          368.42,450Zm0-84.95a27.48,27.48,0,1,0,27.48,27.47A27.5,27.5,0,0,0,
          368.42,365.05Z"/>
        <path d="M158.08,165.49a15,15,0,0,1-14.23-10.26L118.14,78H70.7a15,
          15,0,1,1,0-30H129a15,15,0,0,1,14.23,10.26l29.13,87.49a15,15,0,0,1-14.23,19.74Z"/>
      </g>
    </svg>
  `;
  imageContainer.appendChild(img);
  imageContainer.appendChild(heartIcon);
  reviews.append(reviewsStar, rating);
  priceContainer.append(oldPrice, price);
  card.append(imageContainer, title, reviews, priceContainer, basketDiv);

  const path = heartIcon.querySelector("path");
  if (has(product.id)) path.classList.add("active");

  heartIcon.addEventListener("click", (e) => {
    e.stopPropagation();
    toggle(product.id);
    path.classList.toggle("active");
  });

  function handleAddToCard(product) {
    addProductToBasket(product).then(() => {
      updateBasketCounter();
    });
  }

  basketDiv.addEventListener("click", (e) => {
    e.stopPropagation();
    handleAddToCard(product); // передаем объект, а не id
  });

  card.addEventListener("click", () => {
    window.location.href = `/productInfo?id=${product.id}`;
  });

  return card;
}

export function renderProducts(products, targetContainer) {
  const productContainer = document.createElement("div");
  productContainer.className = "product-container";

  products.forEach((product) => {
    const card = createProductCard(product);
    productContainer.append(card);
  });

  targetContainer.append(productContainer);
}

export async function renderAllProducts() {
  const popular = document.createElement("h1");
  popular.textContent = "Популярное";
  popular.className = "popular";

  const data = await getGoods();
  const container = document.querySelector(".container");
  container.append(popular);
  renderProducts(data, container);
}
