import { getGoods } from "../utils/getGoods.js";
import { has, toggle } from "../utils/favorites.js";
import { updateBasketCounter } from "../components/Header.js";

export function createProductCard(product) {
  const card = document.createElement("div");
  const imageContainer = document.createElement("div");
  const img = document.createElement("img");
  const heartIcon = document.createElement("div");
  const title = document.createElement("p");
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
  priceContainer.append(oldPrice, price);
  card.append(imageContainer, title, priceContainer, basketDiv);

  const path = heartIcon.querySelector("path");
  if (has(product.id)) path.classList.add("active");

  heartIcon.addEventListener("click", (e) => {
    e.stopPropagation();
    toggle(product.id);
    path.classList.toggle("active");
  });

  function handleAddToCard(productId) {
    const cardItems = JSON.parse(localStorage.getItem("card")) || [];
    const existingItem = cardItems.find((item) => item.id === productId);

    if (existingItem) {
      existingItem.amount += 1;
    } else {
      cardItems.push({ id: productId, amount: 1 });
    }

    localStorage.setItem("card", JSON.stringify(cardItems));
    updateBasketCounter();
  }

  basketDiv.addEventListener("click", (e) => {
    e.stopPropagation();
    handleAddToCard(product.id);
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
