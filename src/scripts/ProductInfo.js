import { getGoods } from "../utils/getGoods.js";
import { renderProducts } from "../components/Card.js";
import { has, toggle } from "../utils/favorites.js";
import { updateBasketCounter } from "../components/Header.js";
import { addProductToBasket } from "../utils/basket.js";

export async function ProductInfo() {
  const section = document.getElementById("info-section");
  section.innerHTML = "";
  const id =
    new URLSearchParams(window.location.search).get("id") ||
    new URLSearchParams(window.location.hash.split("?")[1]).get("id");

  const data = await getGoods();
  const product = data.find((item) => item.id == id);

  if (!product) return;
  document.title = product.title;

  const container = document.createElement("div");
  const imageContainer = document.createElement("div");
  const imageSlider = document.createElement("div");
  const imageDivElements = [];

  if (product.media && product.media.length > 0) {
    product.media.forEach((src) => {
      const imageDiv = document.createElement("div");
      const img = document.createElement("img");
      imageDivElements.push({ imageDiv, img, src });
    });
  }

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

  const heartIcon = document.createElement("div");

  const priceDiv = document.createElement("div");
  priceDiv.className = "price_div";

  const oldPriceMobile = document.createElement("p");
  oldPriceMobile.className = "oldPriceMobile";

  const reviews = document.createElement("div");
  const reviewsStar = document.createElement("div");
  const rating = document.createElement("p");
  const ratingReviews = document.createElement("p");

  const bottomDiv = document.createElement("div");
  bottomDiv.className = "bottomDiv";

  const deskButton = document.createElement("button");
  deskButton.type = "button";
  deskButton.textContent = "Полное описание";
  deskButton.className = "deskButton";

  container.id = "info_section";

  reviews.className = "reviews_info";
  reviewsStar.innerHTML = `<svg data-v-96c69a2c="" width="22" height="22" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" data-test-id="icon__rating-star" class="ui-icon  rating-icon">
  <path d="M6.32279 0.887954C6.11862 0.790604 5.88141 0.790604 5.67723 0.887954C5.50072 0.972112 5.4034 1.11823 5.35433 1.19839C5.30359 1.28126 5.25151 1.38682 5.20075 1.48972L4.12288 3.67336L1.71185 4.02577C1.59836 4.04233 1.48191 4.05933 1.38745 4.08204C1.29607 4.10402 1.12711 4.15154 0.992657 4.29346C0.837112 4.45765 0.76396 4.68325 0.793571 4.90747C0.819166 5.10129 0.928088 5.23891 0.989188 5.31033C1.05235 5.38415 1.13667 5.46625 1.21885 5.54626L2.96275 7.24481L2.55127 9.64395C2.53184 9.75707 2.51192 9.87312 2.50424 9.97001C2.49682 10.0637 2.48965 10.2392 2.583 10.411C2.69098 10.6098 2.88292 10.7492 3.10535 10.7905C3.29766 10.8261 3.4623 10.7651 3.54912 10.729C3.63889 10.6918 3.7431 10.637 3.84468 10.5835L6.00001 9.45005L8.15535 10.5835C8.25693 10.637 8.36114 10.6918 8.45091 10.729C8.53773 10.7651 8.70237 10.8261 8.89467 10.7905C9.11711 10.7492 9.30904 10.6098 9.41702 10.411C9.51037 10.2392 9.5032 10.0637 9.49578 9.97001C9.48811 9.87312 9.46818 9.75708 9.44876 9.64397L9.03727 7.24481L10.7812 5.54624C10.8634 5.46623 10.9477 5.38414 11.0108 5.31033C11.0719 5.23891 11.1809 5.10129 11.2065 4.90747C11.2361 4.68325 11.1629 4.45765 11.0074 4.29346C10.8729 4.15154 10.704 4.10402 10.6126 4.08204C10.5181 4.05933 10.4017 4.04233 10.2882 4.02577L7.87714 3.67336L6.7993 1.48976C6.74853 1.38686 6.69644 1.28127 6.6457 1.19839C6.59662 1.11823 6.4993 0.972112 6.32279 0.887954Z" fill="#FFB54C"></path>
  </svg>`;
  let ratingValue = product.rating;
  if (Number.isInteger(ratingValue)) {
    ratingValue = ratingValue.toFixed(1);
  }
  rating.className = "rating_info";
  rating.textContent = `${ratingValue}`;
  ratingReviews.className = "rating_reviews";
  ratingReviews.textContent = "(Нет отзывов)";

  heartIcon.className = "heart-icon heart_info";
  heartIcon.innerHTML = `
    <svg class="feather feather-heart" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06
        a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78
        1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  `;

  const path = heartIcon.querySelector("path");
  if (has(product.id)) path.classList.add("active");

  heartIcon.addEventListener("click", (e) => {
    e.stopPropagation();
    toggle(product.id);
    path.classList.toggle("active");
  });

  imageContainer.className = "image_container";
  imageSlider.className = "image_slider";

  imageDivElements.forEach(({ imageDiv, img, src }) => {
    imageDiv.className = "image_div";
    img.src = src;
    img.alt = product.title;
  });

  imageBase.className = "image_base";
  baseImg.src = product.media && product.media[0] ? product.media[0] : "";
  baseImg.alt = product.title;

  prevBtn.className = "slider__btn slider__btn--prev";
  prevBtn.innerHTML = `<img src="/icons/bracket-left.png" alt="prev">`;

  nextBtn.className = "slider__btn slider__btn--next";
  nextBtn.innerHTML = `<img src="/icons/bracket-right.png" alt="next">`;

  info.className = "info";
  title.className = "title";
  title.textContent = product.title;

  price.className = "price";
  oldPrice.className = "oldPrice";

  const discountedPrice = Math.ceil(
    product.price - (product.price * product.salePercentage) / 100
  );

  buttonAmount.className = "button_amount";
  minus.className = "minus";
  minus.innerHTML = "&#8722;";
  amount.className = "amount";
  amount.textContent = "1";
  plus.className = "plus";
  plus.innerHTML = "&#43;";

  line.className = "line";

  description.className = "description";
  descP.textContent = product.description
    ? product.description
    : "Характеристики товара не указаны";

  buttons.className = "buttons";
  btnBasket.className = "btn btn_basket";
  btnBasket.textContent = "Добавить в корзину";

  btnFav.className = "btn btn_favorites";
  const active = has(product.id);
  if (active) btnFav.classList.add("active");
  btnFav.textContent = active ? "В избранном" : "Добавить в избранные";

  fullDescSection.className = "full_description";
  descDiv.className = "desc_div";
  h4.textContent = "Описание";
  fullDesc.textContent = product.description
    ? product.description
    : "Данный товар не имеет подробного описания";

  let currentIndex = 0;
  let count = 1;

  imageDivElements.forEach(({ imageDiv, img }) => {
    imageDiv.append(img);
    imageSlider.append(imageDiv);
  });

  // base image area
  imageBase.append(prevBtn, baseImg, nextBtn);
  imageContainer.append(imageSlider, imageBase);
  container.append(imageContainer);

  // info block
  buttonAmount.append(minus, amount, plus);
  description.appendChild(descP);
  buttons.append(btnBasket, btnFav);
  if (window.innerWidth < 992) {
    section.append(title);
  } else {
    info.append(title);
  }

  info.append(price, buttonAmount, line, description, buttons);
  container.append(info);
  section.append(container);
  const body = document.querySelector("body");

  if (window.innerWidth < 768) {
    imageBase.append(heartIcon);
    priceDiv.append(price, oldPriceMobile);
    reviewsStar.prepend(rating);
    reviews.append(reviewsStar, ratingReviews);
    info.append(reviews, priceDiv);
    bottomDiv.append(buttonAmount, btnBasket);
    section.append(bottomDiv);
  }

  if (window.innerWidth < 576) {
    info.prepend(title);
    info.append(deskButton);
    body.append(bottomDiv);

    fullDescSection.classList.remove("show");

    deskButton.addEventListener("click", () => {
      const isHidden = !fullDescSection.classList.contains("show");

      fullDescSection.classList.toggle("show", isHidden);
      deskButton.textContent = isHidden ? "Скрыть описание" : "Полное описание";
    });
  }
  // full description
  descDiv.append(h4, fullDesc);
  fullDescSection.appendChild(descDiv);
  section.appendChild(fullDescSection);

  function hasDiscount(product) {
    return !!product.salePercentage && product.salePercentage > 0;
  }

  function updateButtons() {
    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled =
      currentIndex === (product.media ? product.media.length - 1 : 0);
    imageDivElements.forEach(({ imageDiv }, idx) => {
      imageDiv.classList.toggle("active", idx === currentIndex);
    });
  }

  function updatePriceDisplay() {
    price.textContent = `${discountedPrice * count} сум`;
    if (hasDiscount(product)) {
      oldPrice.textContent = `${product.price * count} сум`;
      oldPriceMobile.textContent = `${product.price * count} сум`;
      if (!price.contains(oldPrice)) price.appendChild(oldPrice);
    } else {
      if (price.contains(oldPrice)) oldPrice.remove();
    }
  }

  if (imageDivElements.length > 0) {
    imageDivElements[0].imageDiv.classList.add("active");
  }

  prevBtn.addEventListener("click", () => {
    if (currentIndex > 0) {
      currentIndex--;
      baseImg.src = product.media[currentIndex];
      updateButtons();
    }
  });

  nextBtn.addEventListener("click", () => {
    if (currentIndex < (product.media ? product.media.length - 1 : 0)) {
      currentIndex++;
      baseImg.src = product.media[currentIndex];
      updateButtons();
    }
  });

  imageDivElements.forEach(({ imageDiv, src }) => {
    imageDiv.addEventListener("click", () => {
      imageDivElements.forEach(({ imageDiv: d }) =>
        d.classList.remove("active")
      );
      imageDiv.classList.add("active");
      baseImg.src = src;
      currentIndex = product.media.indexOf(src);
      updateButtons();
    });
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

  btnBasket.addEventListener("click", async () => {
    const productWithAmount = { ...product, amount: count };
    await addProductToBasket(productWithAmount); // ждем завершения
    updateBasketCounter();
  });

  // favorites button
  btnFav.addEventListener("click", (e) => {
    e.preventDefault();
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

  function renderSimilarProducts(dataList, currentProduct) {
    const similar = document.getElementById("similar-products-container");
    if (!similar) return;
    similar.innerHTML = "";

    const similarHead = document.createElement("h2");
    similarHead.className = "similarHead";
    similarHead.textContent = "Похожие товары";
    similar.append(similarHead);

    const filtered = dataList.filter(
      (item) =>
        item.type === currentProduct.type && item.id !== currentProduct.id
    );

    let limit;
    if (window.innerWidth < 768) {
      limit = 4;
    } else if (window.innerWidth < 992) {
      limit = 3;
    } else if (window.innerWidth < 1200) {
      limit = 4;
    } else {
      limit = 5;
    }

    const limited = filtered.slice(0, limit);
    renderProducts(limited, similar);
  }

  updateButtons();
  updatePriceDisplay();
  renderSimilarProducts(data, product);

  window.addEventListener("resize", () => {
    renderSimilarProducts(data, product);
  });
}
