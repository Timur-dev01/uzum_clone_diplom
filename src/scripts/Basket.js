import { getGoods } from "../utils/getGoods.js";
import { updateBasketCounter } from "../components/Header.js";
import {
  getProductsFromCard,
  removeProductFromCard,
  clearCard,
  updateBasketQuantity,
  handleCheckout,
} from "../utils/basket.js";

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

  checkout.addEventListener("click", async (e) => {
    e.preventDefault();

    await handleCheckout();

    updateBasketCounter();
    container.innerHTML = "";
    container.append(defaultBasketDiv());
  });

  card.forEach((item) => {
    const product = data.find((p) => String(p.id) === String(item.id));
    if (!product) return;

    const productPrice = Math.ceil(
      product.price - (product.price * product.salePercentage) / 100
    );
    const discount = Math.ceil((product.price * product.salePercentage) / 100);

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
    img.src = product.media && product.media[0] ? product.media[0] : "";
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
    delBtn.type = "button";

    imgBox.append(img);
    counterBlock.append(minus, amount, plus);
    info.append(titleEl, priceEl, counterBlock, delBtn);
    productEl.append(imgBox, info);
    productsContainer.append(productEl);

    titleEl.addEventListener("click", () => {
      window.location.href = `/productInfo?id=${product.id}`;
    });

    minus.addEventListener("click", async (e) => {
      e.preventDefault();
      e.stopPropagation();
      await handleQuantityChange(item.id, -1);
    });

    plus.addEventListener("click", async (e) => {
      e.preventDefault();
      e.stopPropagation();
      await handleQuantityChange(item.id, 1);
    });

    delBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      e.stopPropagation();
      await removeProductFromCard(item.id);
      updateBasketCounter();
      await addBasketProducts();
      updateSummary();
    });
  });

  updateSummary();
}

async function handleQuantityChange(productId, delta) {
  await updateBasketQuantity(productId, delta);
  updateBasketCounter();
  await addBasketProducts();
  updateSummary();
}

async function removeProduct(productId) {
  removeProductFromCard(productId);
  updateBasketCounter();
  await addBasketProducts();
  updateSummary();
}

function updateSummary() {
  const card = getProductsFromCard();
  getGoods().then((data) => {
    let sum = 0,
      count = 0,
      discountSum = 0;

    card.forEach((item) => {
      const product = data.find((p) => String(p.id) === String(item.id));
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

    const priceEl = document.querySelector(".general_price");
    const totalItemsEl = document.querySelector(".total_items");
    const discountsEl = document.querySelector(".total_discounts");

    if (priceEl) priceEl.textContent = `${sum} сум`;
    if (totalItemsEl) totalItemsEl.textContent = `Итого товаров: ${count}`;
    if (discountsEl)
      discountsEl.textContent = `Итого скидки: ${discountSum} сум`;
  });
}

addBasketProducts();
