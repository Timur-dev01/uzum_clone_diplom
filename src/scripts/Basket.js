import { getGoods } from "../utils/getGoods.js";
import { updateBasketCounter } from "../components/Header.js";

const container = document.querySelector(".container");

function defaultBasketDiv() {
  const basketDiv = document.createElement("div");
  const basketDivForImg = document.createElement("div");
  const img = document.createElement("img");
  const basket_h1 = document.createElement("h1");
  const basket_p = document.createElement("p");
  const linkInMainPage = document.createElement("a");

  basketDiv.className = "basket_div";
  basketDivForImg.className = "basket_div_for_img";
  img.src = "/images/basket_img.png";
  img.alt = "Пустая корзина";
  basket_h1.className = "basket_h1";
  basket_h1.textContent = "В корзине пока нет товаров";
  basket_p.className = "basket_p";
  basket_p.textContent =
    "Начните с подборок на главной странице или найдите нужный товар через поиск";
  linkInMainPage.className = "link_in_main_page";
  linkInMainPage.textContent = "На главную";
  linkInMainPage.href = "/";

  basketDivForImg.append(img);
  basketDiv.append(basketDivForImg, basket_h1, basket_p, linkInMainPage);

  return basketDiv;
}

function getProductsFromCard() {
  return JSON.parse(localStorage.getItem("card")) || [];
}

function saveProductsToCard(data) {
  localStorage.setItem("card", JSON.stringify(data));
}

async function addBasketProducts() {
  container.innerHTML = "";

  const card = getProductsFromCard();
  const data = await getGoods();

  if (!card.length) {
    container.append(defaultBasketDiv());
    return;
  }

  const section = document.createElement("div");
  const title = document.createElement("h1");
  const wrapper = document.createElement("div");
  const productsContainer = document.createElement("div");
  const priceBlock = document.createElement("div");
  const totalPrice = document.createElement("h2");
  const totalItems = document.createElement("p");
  const discounts = document.createElement("p");
  const checkout = document.createElement("button");

  section.className = "basket_products_section";
  title.className = "basket_products_h1";
  title.textContent = "Корзина товаров";
  wrapper.className = "basket_products_div";
  productsContainer.className = "basket_products";
  priceBlock.className = "basket_products_price";
  totalPrice.className = "general_price";
  totalItems.className = "total_items";
  discounts.className = "total_discounts";
  checkout.className = "checkout_button";
  checkout.textContent = "Оформить";

  priceBlock.append(totalPrice, totalItems, discounts, checkout);
  wrapper.append(productsContainer, priceBlock);
  section.append(title, wrapper);
  container.append(section);

  checkout.addEventListener("click", () => {
    localStorage.removeItem("card");
    updateBasketCounter();
    container.innerHTML = "";
    container.append(defaultBasketDiv());
    alert("Заказ оформлен");
  });

  card.forEach((item) => {
    const product = data.find((p) => p.id === item.id);
    if (!product) return;

    const productPrice = Math.ceil(
      product.price - (product.price * product.salePercentage) / 100
    );
    const discount = Math.ceil(
      (product.price * product.salePercentage) / 100
    );

    const productEl = document.createElement("div");
    const imgBox = document.createElement("div");
    const img = document.createElement("img");
    const info = document.createElement("div");
    const titleEl = document.createElement("h4");
    const priceEl = document.createElement("p");
    const counterBlock = document.createElement("div");
    const minus = document.createElement("span");
    const amount = document.createElement("span");
    const plus = document.createElement("span");
    const delBtn = document.createElement("button");


    productEl.className = "basket_product";
    productEl.dataset.id = item.id;
    imgBox.className = "basket_products_img";
    img.src = product.media[0];
    img.alt = product.title;
    info.className = "basket_products_info";
    titleEl.className = "productTitle";
    titleEl.textContent = product.title;
    priceEl.className = "productPrice";
    priceEl.textContent = `${productPrice} сум`;
    counterBlock.className = "button_amount";
    minus.className = "minus";
    minus.innerHTML = "&#8722";
    amount.className = "amount";
    amount.textContent = item.amount;
    plus.className = "plus";
    plus.innerHTML = "&#43";
    delBtn.className = "buttonDelete";
    delBtn.textContent = "Удалить";

 
    imgBox.append(img);
    counterBlock.append(minus, amount, plus);
    info.append(titleEl, priceEl, counterBlock, delBtn);
    productEl.append(imgBox, info);
    productsContainer.append(productEl);


    titleEl.addEventListener("click", () => {
      window.location.href = `/productInfo?id=${product.id}`;
    });

    minus.addEventListener("click", () =>
      handleQuantityChange(item.id, -1, productPrice)
    );

    plus.addEventListener("click", () =>
      handleQuantityChange(item.id, 1, productPrice)
    );

    delBtn.addEventListener("click", () => {
      const updated = getProductsFromCard().filter((el) => el.id !== item.id);
      saveProductsToCard(updated);
      productEl.remove();
      updateBasketCounter();
      updateSummary();
      if (!updated.length) container.replaceChildren(defaultBasketDiv());
    });
  });

  updateSummary();
}

function handleQuantityChange(productId, delta, pricePerUnit) {
  const card = getProductsFromCard();
  const product = card.find((item) => item.id === productId);
  if (!product) return;

  product.amount += delta;

  if (product.amount < 1) {
    const updated = card.filter((el) => el.id !== productId);
    saveProductsToCard(updated);
    document.querySelector(`[data-id="${productId}"]`)?.remove();
    if (!updated.length) {
      container.innerHTML = "";
      container.append(defaultBasketDiv());
    }
  } else if (product.amount <= 10) {
    saveProductsToCard(card);
    const amountSpan = document.querySelector(
      `[data-id="${productId}"] .amount`
    );
    if (amountSpan) amountSpan.textContent = product.amount;
  }

  updateBasketCounter();
  updateSummary();
}

function updateSummary() {
  const card = getProductsFromCard();
  getGoods().then((data) => {
    let sum = 0,
      count = 0,
      discountSum = 0;

    card.forEach((item) => {
      const product = data.find((p) => p.id === item.id);
      if (!product) return;

      const productPrice = Math.ceil(
        product.price - (product.price * product.salePercentage) / 100
      );
      const discount = Math.ceil(
        (product.price * product.salePercentage) / 100
      );

      sum += productPrice * item.amount;
      count += item.amount;
      discountSum += discount * item.amount;
    });

    document.querySelector(".general_price").textContent = `${sum} сум`;
    document.querySelector(".total_items").textContent = `Итого товаров: ${count}`;
    document.querySelector(".total_discounts").textContent = `Итого скидки: ${discountSum} сум`;
  });
}

addBasketProducts();
