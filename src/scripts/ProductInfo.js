import { getGoods } from "../utils/getGoods.js";
import { renderProducts } from "../components/Card.js";

export async function ProductInfo() {
  const section = document.getElementById("info-section");
  if (!section) {
    console.error("info-section не найден! Убедись, что HTML уже вставлен.");
    return;
  }
  section.innerHTML = "";
  const id =
    new URLSearchParams(window.location.search).get("id") ||
    new URLSearchParams(window.location.hash.split("?")[1]).get("id");

  const data = await getGoods();
  const product = data.find((item) => item.id == id);

  if (!product) return;

  const container = document.createElement("div");
  container.id = "info_section";

  const imageContainer = document.createElement("div");
  imageContainer.className = "image_container";

  const imageSlider = document.createElement("div");
  imageSlider.className = "image_slider";

  if (product.media.length > 0) {
    product.media.forEach((src) => {
      const imageDiv = document.createElement("div");
      imageDiv.className = "image_div";

      const img = document.createElement("img");
      img.src = src;
      img.alt = product.title;

      imageDiv.addEventListener("click", () => {
        const allDivs = imageSlider.querySelectorAll(".image_div");
        allDivs.forEach((div) => div.classList.remove("active"));
        imageDiv.classList.add("active");
        baseImg.src = src;
        currentIndex = product.media.indexOf(src);
        updateButtons();
      });

      imageDiv.append(img);
      imageSlider.append(imageDiv);
    });
  }

  const imageBase = document.createElement("div");
  imageBase.className = "image_base";

  const baseImg = document.createElement("img");
  baseImg.src = product.media[0];
  baseImg.alt = product.title;

  let currentIndex = 0;

  const prevBtn = document.createElement("button");
  prevBtn.className = "slider__btn slider__btn--prev";
  prevBtn.innerHTML = `<img src="/icons/bracket-left.png" alt="prev">`;
  prevBtn.addEventListener("click", () => {
    if (currentIndex > 0) {
      currentIndex--;
      baseImg.src = product.media[currentIndex];
      updateButtons();
    }
  });

  const nextBtn = document.createElement("button");
  nextBtn.className = "slider__btn slider__btn--next";
  nextBtn.innerHTML = `<img src="/icons/bracket-right.png" alt="next">`;
  nextBtn.addEventListener("click", () => {
    if (currentIndex < product.media.length - 1) {
      currentIndex++;
      baseImg.src = product.media[currentIndex];
      updateButtons();
    }
  });

  function updateButtons() {
    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex === product.media.length - 1;
  }

  updateButtons();

  imageBase.append(prevBtn, baseImg, nextBtn);
  imageContainer.append(imageSlider, imageBase);
  container.appendChild(imageContainer);

  // Info block
  const info = document.createElement("div");
  info.className = "info";

  const title = document.createElement("h2");
  title.className = "title";
  title.textContent = product.title;

  const price = document.createElement("p");
  price.className = "price";
  price.textContent = `${Math.round(
    product.price - (product.price * product.salePercentage) / 100
  )} сум`;

  const oldPrice = document.createElement("span");
  oldPrice.className = "oldPrice";
  oldPrice.textContent = `${product.price} сум`;
  price.appendChild(oldPrice);

  const amount = document.createElement("div");
  amount.className = "button_amount";
  amount.innerHTML = `
    <span class="minus">-</span>
    <span class="amount">1</span>
    <span class="plus">+</span>
  `;

  const line = document.createElement("div");
  line.className = "line";

  const description = document.createElement("div");
  description.className = "description";
  const descP = document.createElement("p");
  if (product.description) {
    descP.textContent = product.description;
  } else {
    descP.textContent = "Характеристики товара не указаны";
  }
  description.appendChild(descP);

  const buttons = document.createElement("div");
  buttons.className = "buttons";

  const btnBasket = document.createElement("button");
  btnBasket.className = "btn_info btn_basket";
  btnBasket.textContent = "Добавить в корзину";

  const btnFav = document.createElement("button");
  btnFav.className = "btn_info btn_favorites";
  btnFav.textContent = "Добавить в избранные";

  buttons.append(btnBasket, btnFav);

  info.append(title, price, amount, line, description, buttons);
  container.append(info);
  section.append(container);

  const fullDescSection = document.createElement("div");
  fullDescSection.className = "full_description";

  const descDiv = document.createElement("div");
  descDiv.className = "desc_div";

  const h4 = document.createElement("h4");
  h4.textContent = "Описание";

  const fullDesc = document.createElement("p");
  if (product.description) {
    fullDesc.textContent = product.description;
  } else {
    fullDesc.textContent = "Данный товар не имеет подробного описания";
  }

  descDiv.append(h4, fullDesc);
  fullDescSection.appendChild(descDiv);
  section.appendChild(fullDescSection);

  const similar = document.getElementById("similar-products-container");
  similar.innerHTML = "";
  const similarHead = document.createElement("h2");
  similarHead.className = "similarHead";
  similarHead.textContent = "Похожие товары";
  similar.append(similarHead);
  const filtered = data.filter(
    (item) => item.type === product.type && item.id !== product.id
  );
  const limited = filtered.slice(0, 5);
  renderProducts(limited, similar);

}
