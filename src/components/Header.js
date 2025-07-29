import axios from "axios";
import { getGoods } from "../utils/getGoods.js";
import { router } from "../main.js";

function Header() {
  // ===== Header =====
  const header = document.createElement("header");
  const body = document.body;
  // ===== Logo =====
  const logo = document.createElement("a");
  logo.href = "/";
  const logoImg = document.createElement("img");
  logoImg.src = "/images/logo.svg";
  logoImg.alt = "Логотип";
  logoImg.style.width = "215px";
  logo.append(logoImg);

  // ===== Catalog =====
  const catalog = document.createElement("button");
  catalog.classList.add("catalog");
  catalog.textContent = "Каталог";

  const categoryBlock = document.createElement("div");
  categoryBlock.classList.add("category_block");

  const categoryDiv = document.createElement("div");
  categoryDiv.className = "categoryDiv";

  const categoryTitle = document.createElement("p");
  categoryTitle.className = "categoryTitle";
  categoryTitle.textContent = "Категории товаров";

  categoryDiv.append(categoryTitle);

  const TypesTranslate = {
    TV: "Телевизоры",
    PC: "Компьютеры",
    kitchen: "Кухонная техника",
    furniture: "Мебель",
    audio: "Аудио",
  };

  async function loadCategories() {
    try {
      let database = localStorage.getItem("cachedCategories");

      if (!database) {
        const db = await getGoods();
        localStorage.setItem("cachedCategories", JSON.stringify(db));
        database = JSON.stringify(db);
      }

      database = JSON.parse(database);

      if (!Array.isArray(database)) {
        if (Array.isArray(database.goods)) {
          database = database.goods;
        } else {
          database = Object.values(database);
        }
      }

      const goods = database;
      const allTypes = goods.map((item) => item.type);
      const types = [...new Set(allTypes)];

      types.forEach((type) => {
        const p = document.createElement("p");
        p.className = "categoryName";
        p.textContent = TypesTranslate[type] || type;
        p.dataset.type = type;

        p.addEventListener("click", () => {
          window.history.pushState({}, "", `/category#type=${type}`);
          router();
        });

        categoryDiv.append(p);
      });
    } catch (error) {
      console.error("Ошибка при загрузке категорий:", error);
    }
  }

  loadCategories();
  categoryBlock.append(categoryDiv);
  body.append(categoryBlock);

  catalog.addEventListener("click", () => {
    const isOpen = categoryBlock.classList.contains("show");

    if (isOpen) {
      categoryBlock.classList.remove("show");
      body.classList.remove("no-scroll");
      document.documentElement.classList.remove("no-scroll");
    } else {
      categoryBlock.classList.add("show");
      body.classList.add("no-scroll");
      document.documentElement.classList.add("no-scroll");
    }
  });

  categoryBlock.addEventListener("click", () => {
    categoryBlock.classList.remove("show");
    body.classList.remove("no-scroll");
  });

  // ===== Search =====
  const searchDiv = document.createElement("div");
  searchDiv.classList.add("searchDiv");

  const searchInput = document.createElement("input");
  searchInput.type = "search";
  searchInput.placeholder = "Искать товары";

  const searchIconDiv = document.createElement("div");
  searchIconDiv.classList.add("searchIconDiv");
  const searchIcon = document.createElement("img");
  searchIcon.src = "/icons/search.svg";
  searchIcon.alt = "Поиск";
  searchIcon.classList.add("searchIcon");
  searchIconDiv.append(searchIcon);

  const searchResultsBlock = document.createElement("div");
  searchResultsBlock.classList.add("search_results");

  searchInput.addEventListener("input", async () => {
    const query = searchInput.value.trim().toLowerCase();

    if (!query) {
      searchResultsBlock.classList.remove("show");
      body.classList.remove("no-scroll");
      searchResultsBlock.innerHTML = "";
      return;
    }

    const database = await getGoods();
    const filteredGoods = database.filter((item) =>
      item.title.toLowerCase().includes(query)
    );

    searchResultsBlock.innerHTML = "";

    if (filteredGoods.length === 0) {
      const noResult = document.createElement("div");
      noResult.classList.add("search_result_item");
      noResult.textContent = "Ничего не найдено";
      searchResultsBlock.append(noResult);
    } else {
      filteredGoods.forEach((item) => {
        const resultDiv = document.createElement("div");
        resultDiv.classList.add("search_result_item");
        resultDiv.textContent = item.title;
        resultDiv.addEventListener("click", () => {
          window.location.href = `/productInfo?id=${item.id}`;
        });
        searchResultsBlock.append(resultDiv);
      });
    }

    searchResultsBlock.classList.add("show");
    body.classList.add("no-scroll");
  });

  document.addEventListener("click", (e) => {
    if (!searchDiv.contains(e.target)) {
      searchResultsBlock.classList.remove("show");
      body.classList.remove("no-scroll");
    }
  });

  searchDiv.append(searchInput, searchIconDiv, searchResultsBlock);

  // ===== Menu =====
  const menu = document.createElement("nav");
  menu.classList.add("menu");

  const user = document.createElement("a");
  user.classList.add("menu_link");
  user.textContent = "Профиль";
  const userIcons = document.createElement("img");
  userIcons.src = "/icons/contact.svg";
  userIcons.alt = "Профиль";
  userIcons.style.width = "20px";
  user.prepend(userIcons);

  const favorite = document.createElement("a");
  favorite.classList.add("menu_link");
  favorite.href = "/favorite";
  favorite.textContent = "Избранное";
  const favoriteIcons = document.createElement("img");
  favoriteIcons.src = "/icons/heart2.svg";
  favoriteIcons.alt = "Избранное";
  favoriteIcons.style.width = "20px";
  favorite.prepend(favoriteIcons);

  const basket = document.createElement("a");
  basket.classList.add("menu_link");
  basket.href = "/basket";
  basket.textContent = "Корзина";
  const basketIcons = document.createElement("img");
  basketIcons.src = "/icons/backet2.svg";
  basketIcons.alt = "Корзина";
  basketIcons.style.width = "20px";

  const basketCounter = document.createElement("span");
  basketCounter.classList.add("basket_counter");
  basketCounter.textContent = "0";

  basket.prepend(basketIcons);
  basket.append(basketCounter);

  menu.append(user, favorite, basket);

  header.append(logo, catalog, searchDiv, menu);

  function updateBasketCounter() {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const totalCount = cart.reduce(
      (acc, item) => acc + (item.quantity || 1),
      0
    );
    basketCounter.textContent = totalCount.toString();
  }
  updateBasketCounter();

  return header;
}

export function renderHeader() {
  const container = document.querySelector(".main_container");
  if (container.querySelector("header")) return;
  const header = Header();
  container.prepend(header);
  // ===== For up button =====
  const for_up = document.createElement("button");
  for_up.className = "for_up";
  const for_up_image = document.createElement("img");
  for_up_image.setAttribute("src", "/icons/up.svg");
  for_up.append(for_up_image);
  container.append(for_up);
  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      for_up.style.display = "flex";
    } else {
      for_up.style.display = "none";
    }
  });
  for_up.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}
