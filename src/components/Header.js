import { getGoods } from "../utils/getGoods.js";
import { router } from "../main.js";
import { createModal } from "../components/Modal.js";
import { getUsers } from "../utils/getUsers.js";

function Header() {
  const body = document.body;
  const header = document.createElement("header");
  const logo = document.createElement("a");
  const logoImg = document.createElement("img");
  const catalog = document.createElement("button");
  const categoryBlock = document.createElement("div");
  const categoryDiv = document.createElement("div");
  const categoryTitle = document.createElement("p");
  const searchDiv = document.createElement("div");
  const searchInput = document.createElement("input");
  const searchIconDiv = document.createElement("div");
  const searchIcon = document.createElement("img");
  const searchResultsBlock = document.createElement("div");
  const menu = document.createElement("nav");
  const user = document.createElement("a");
  const userLinkText = document.createElement("a");
  const userIcons = document.createElement("img");
  const favorite = document.createElement("a");
  const favoriteLinkText = document.createElement("a");
  const favoriteIcons = document.createElement("img");
  const basket = document.createElement("a");
  const basketLinkText = document.createElement("a");
  const basketIcons = document.createElement("img");
  const basketCounter = document.createElement("span");

  header.className = "header";
  logo.href = "/";
  logo.className = "logo";
  logoImg.src = "/images/logo.svg";
  logoImg.alt = "Логотип";
  logoImg.style.width = "215px";
  catalog.classList.add("catalog");
  catalog.textContent = "Каталог";
  categoryBlock.classList.add("category_block");
  categoryDiv.className = "categoryDiv";
  categoryTitle.className = "categoryTitle";
  categoryTitle.textContent = "Категории товаров";
  searchDiv.classList.add("searchDiv");
  searchInput.type = "search";
  searchInput.placeholder = "Искать товары";
  searchIconDiv.classList.add("searchIconDiv");
  searchIcon.src = "/icons/search.svg";
  searchIcon.alt = "Поиск";
  searchIcon.classList.add("searchIcon");
  searchResultsBlock.classList.add("search_results");
  menu.classList.add("menu");
  user.classList.add("menu_link");
  userLinkText.className = "menu_link_text";
  userLinkText.textContent = "Профиль";
  userIcons.src = "/icons/contact.svg";
  userIcons.alt = "Профиль";
  userIcons.style.width = "20px";
  favorite.classList.add("menu_link");
  favorite.href = "/favorite";
  favoriteLinkText.className = "menu_link_text";
  favoriteLinkText.textContent = "Избранное";
  favoriteIcons.src = "/icons/heart2.svg";
  favoriteIcons.alt = "Избранное";
  favoriteIcons.style.width = "20px";
  basket.className = "menu_link basket_link";
  basket.href = "/basket";
  basketLinkText.className = "menu_link_text";
  basketLinkText.textContent = "Корзина";
  basketIcons.src = "/icons/backet2.svg";
  basketIcons.alt = "Корзина";
  basketIcons.style.width = "20px";
  basketCounter.className = "basket_counter";
  basketCounter.textContent = "0";

  logo.append(logoImg);
  categoryDiv.append(categoryTitle);
  categoryBlock.append(categoryDiv);
  searchIconDiv.append(searchIcon);
  searchDiv.append(searchInput, searchIconDiv, searchResultsBlock);
  user.prepend(userIcons, userLinkText);
  favorite.prepend(favoriteIcons, favoriteLinkText);
  basket.prepend(basketIcons, basketLinkText);
  basket.append(basketCounter);
  menu.append(user, favorite, basket);
  header.append(logo, catalog, searchDiv, menu);
  body.append(categoryBlock);

  const TypesTranslate = {
    TV: "Телевизоры",
    PC: "Компьютеры",
    kitchen: "Кухонная техника",
    furniture: "Мебель",
    audio: "Аудио",
  };

  async function loadCategories() {
    try {
      const goods = await getGoods();
      localStorage.setItem("cachedCategories", JSON.stringify(goods));

      const allTypes = goods.map((item) => item.type);
      const types = [...new Set(allTypes)];

      categoryDiv.innerHTML = "";
      const categoryTitle = document.createElement("p");
      categoryTitle.className = "categoryTitle";
      categoryTitle.textContent = "Категории товаров";
      categoryDiv.append(categoryTitle);

      types.forEach((type) => {
        const count = goods.filter((item) => item.type === type).length;
        const p = document.createElement("p");
        p.className = "categoryName";
        p.textContent = TypesTranslate[type] || type;
        p.dataset.type = type;
        const categoryCount = document.createElement("span");
        categoryCount.className = "categoryCount";
        categoryCount.textContent = `Кол.товара: ${count}`;
        p.append(categoryCount);
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

  user.addEventListener("click", () => {
    const phone = localStorage.getItem("currentUserPhone");
    if (phone) {
      window.location.href = "/profile";
    } else {
      createModal();
    }
  });

  return header;
}

export function renderHeader() {
  const container = document.querySelector(".main_container");
  if (container.querySelector("header")) return;

  const header = Header();
  container.prepend(header);
  updateBasketCounter();

  const for_up = document.createElement("button");
  const for_up_image = document.createElement("img");

  for_up.className = "for_up";
  for_up_image.setAttribute("src", "/icons/up.svg");

  for_up.append(for_up_image);
  container.append(for_up);

  let scrollHandler = null;
  function enableForUp() {
    for_up.style.display = "none";
    if (!scrollHandler) {
      scrollHandler = () => {
        if (window.scrollY > 300) {
          for_up.style.display = "flex";
        } else {
          for_up.style.display = "none";
        }
      };
      window.addEventListener("scroll", scrollHandler);
    }
  }
  function disableForUp() {
    for_up.style.display = "none";
    if (scrollHandler) {
      window.removeEventListener("scroll", scrollHandler);
      scrollHandler = null;
    }
  }
  function checkForUpVisibility() {
    if (window.innerWidth < 768) {
      disableForUp();
    } else {
      enableForUp();
    }
  }
  checkForUpVisibility();
  window.addEventListener("resize", checkForUpVisibility);
  for_up.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

export const updateBasketCounter = () => {
  const basketCounter = document.querySelector(".basket_counter");
  const cards = JSON.parse(localStorage.getItem("card")) || [];
  const totalCount = cards.reduce((acc, item) => acc + item.amount, 0);

  if (basketCounter) {
    basketCounter.textContent = totalCount > 50 ? "50+" : totalCount;
    basketCounter.style.display = totalCount === 0 ? "none" : "flex";
  }
};
