import { getGoods } from "../utils/getGoods.js";
import { router } from "../main.js";
import { createModal } from "../components/Modal.js";
import { getUsers } from "../utils/getUsers.js";

// ===== Общие функции =====
function attachCatalogToggle(button, categoryBlock, body) {
  button.addEventListener("click", () => {
    const isOpen = categoryBlock.classList.contains("show");
    categoryBlock.classList.toggle("show", !isOpen);
    body.classList.toggle("no-scroll", !isOpen);
    document.documentElement.classList.toggle("no-scroll", !isOpen);
  });
}

function attachProfileOpen(button) {
  button.addEventListener("click", () => {
    const phone = localStorage.getItem("currentUserPhone");
    if (phone) {
      window.location.href = "/profile";
    } else {
      if (!document.querySelector(".modal-wrapper")) {
        createModal();
      }
    }
  });
}

function Header(container) {
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

  attachCatalogToggle(catalog, categoryBlock, body);

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

  attachProfileOpen(user);

  let bottomHeaderInstance = null;
  function renderBottomHeader() {
    if (window.innerWidth <= 768) {
      if (!bottomHeaderInstance) {
        const bottomHeader = document.createElement("div");
        bottomHeader.className = "bottom_header";

        const nav = document.createElement("nav");
        nav.className = "bottom_menu";

        const linkHome = document.createElement("a");
        linkHome.className = "bottom_menu_link";
        linkHome.href = "/";
        linkHome.innerHTML = `<svg data-v-2747b27c="" width="28" height="28" viewBox="0 0 29 28" fill="none" xmlns="http://www.w3.org/2000/svg"
        class="ui-icon ">
        <g id="Icon">
          <g id="Icon_2">
            <path
            d="M14.5001 7.54553C14.1116 7.54553 13.7296 7.562 13.351 7.59492L13.3444 12.9357H15.6493V7.59492C15.2706 7.54553 14.8887 7.54553 14.5001 7.54553Z"
              fill="#8B8E99"></path>
              <path
              d="M19.0543 19.1165C20.2621 17.9087 20.9407 16.2705 20.9407 14.5623V10.7065C20.1054 10.4275 19.2516 10.2075 18.3855 10.048V14.5393C18.3855 17.7694 17.0158 19.4586 14.5001 19.4586C11.9845 19.4586 10.618 17.7694 10.618 14.5393V10.048C9.75095 10.2079 8.89607 10.4279 8.05957 10.7065V14.5623C8.05957 16.2705 8.73813 17.9087 9.94597 19.1165C11.1538 20.3243 12.792 21.0029 14.5001 21.0029C16.2083 21.0029 17.8465 20.3243 19.0543 19.1165Z"
              fill="#8B8E99"></path>
              <path
              d="M14.5 2C7.87258 2 2.5 7.37258 2.5 14C2.5 20.6274 7.87258 26 14.5 26C21.1274 26 26.5 20.6274 26.5 14C26.5 7.37258 21.1274 2 14.5 2ZM4 14C4 8.20101 8.70101 3.5 14.5 3.5C20.299 3.5 25 8.20101 25 14C25 19.799 20.299 24.5 14.5 24.5C8.70101 24.5 4 19.799 4 14Z"
              fill="#8B8E99"></path>
            </g>
          </g>
          </svg>
          Главная`;

        const catalogBottomHeader = document.createElement("a");
        catalogBottomHeader.className = "bottom_menu_link";
        attachCatalogToggle(catalogBottomHeader, categoryBlock, body);
        catalogBottomHeader.innerHTML = `<svg data-v-2747b27c="" width="28" height="28" viewBox="0 0 29 28" fill="none" xmlns="http://www.w3.org/2000/svg"
        class="ui-icon ">
        <g id="Icon">
          <g id="Icon_2">
            <path
              d="M1.5 12.5C1.5 7.25329 5.75329 3 11 3C16.2467 3 20.5 7.25329 20.5 12.5C20.5 14.853 19.6445 17.0062 18.2276 18.6656L24.2795 24.6993C24.5728 24.9917 24.5735 25.4666 24.2811 25.7599C23.9886 26.0532 23.5138 26.054 23.2204 25.7615L17.1671 19.7264C15.5075 21.144 13.3537 22 11 22C5.75329 22 1.5 17.7467 1.5 12.5ZM11 4.5C6.58172 4.5 3 8.08172 3 12.5C3 16.9183 6.58172 20.5 11 20.5C15.4183 20.5 19 16.9183 19 12.5C19 8.08172 15.4183 4.5 11 4.5Z"
              fill="#8B8E99"></path>
            <path
              d="M22.75 6.00003C22.3358 6.00003 22 6.33582 22 6.75003C22 7.16424 22.3358 7.50003 22.75 7.50003H26.75C27.1642 7.50003 27.5 7.16424 27.5 6.75003C27.5 6.33582 27.1642 6.00003 26.75 6.00003H22.75Z"
              fill="#8B8E99"></path>
            <path
              d="M22.75 11.75C22.3358 11.75 22 12.0858 22 12.5C22 12.9142 22.3358 13.25 22.75 13.25H26.75C27.1642 13.25 27.5 12.9142 27.5 12.5C27.5 12.0858 27.1642 11.75 26.75 11.75H22.75Z"
              fill="#8B8E99"></path>
            <path
              d="M22.75 17.5C22.3358 17.5 22 17.8358 22 18.25C22 18.6642 22.3358 19 22.75 19H26.75C27.1642 19 27.5 18.6642 27.5 18.25C27.5 17.8358 27.1642 17.5 26.75 17.5H22.75Z"
              fill="#8B8E99"></path>
          </g>
        </g>
        </svg>
        Каталог`;

        const basketBottomHeader = document.createElement("a");
        basketBottomHeader.className = "bottom_menu_link";
        basketBottomHeader.href = "/basket";
        basketBottomHeader.innerHTML = `<svg data-v-2747b27c="" width="28" height="28" viewBox="0 0 29 28" fill="none" xmlns="http://www.w3.org/2000/svg"
        class="ui-icon ">
        <g id="Icon">
          <path id="Icon_2"
            d="M9.5 7C9.5 4.5444 11.4295 2 14.5 2C17.5705 2 19.5 4.54439 19.5 7H24V22.25C24 24.3211 22.3211 26 20.25 26H8.75C6.67893 26 5 24.3211 5 22.25V7H9.5ZM11 7H18C18 5.25561 16.6295 3.5 14.5 3.5C12.3705 3.5 11 5.2556 11 7ZM9.5 8.5H6.5V22.25C6.5 23.4926 7.50736 24.5 8.75 24.5H20.25C21.4926 24.5 22.5 23.4926 22.5 22.25V8.5H19.5V11.5H18V8.5H11V11.5H9.5V8.5Z"
            fill="#8B8E99"></path>
        </g>
        </svg> 
        Корзина`;
        

        const favBottomHeader = document.createElement("a");
        favBottomHeader.className = "bottom_menu_link";
        favBottomHeader.href = "/favorite";
        favBottomHeader.innerHTML = `<svg data-v-2747b27c="" width="28" height="28" viewBox="0 0 29 28" fill="none" xmlns="http://www.w3.org/2000/svg"
        class="ui-icon ">
        <g id="Icon">
          <path id="Icon_2"
            d="M9.02703 4C5.38324 4 2.5 6.96273 2.5 10.5391C2.5 16 9.99615 21.5 14.0055 24.8139C14.2885 25.062 14.7115 25.062 14.9945 24.8139C19 21.5 26.5 16 26.5 10.5391C26.5 6.96281 23.6178 4 19.973 4C17.2008 4 15.3841 5.6987 14.5 6.79192C13.6159 5.6987 11.7992 4 9.02703 4ZM4 10.5391C4 7.7779 6.22487 5.5 9.02703 5.5C11.7441 5.5 13.3368 7.65762 13.7573 8.32095C14.1013 8.86359 14.8987 8.86359 15.2427 8.32095C15.6632 7.65762 17.2559 5.5 19.973 5.5C22.776 5.5 25 7.77781 25 10.5391C25 15.1 18 20.5 14.5 23.2667C11 20.5 4 15.1 4 10.5391Z"
            fill="#8B8E99"></path>
        </g>
        </svg>
        Избранные`;

        const profileBottmHeader = document.createElement("a");
        profileBottmHeader.className = "bottom_menu_link";
        attachProfileOpen(profileBottmHeader);
        profileBottmHeader.innerHTML = `<svg data-v-2747b27c="" width="28" height="28" viewBox="0 0 29 28" fill="none" xmlns="http://www.w3.org/2000/svg"
        class="ui-icon ">
        <g id="Icon">
          <g id="Icon_2">
            <path
              d="M14.5 3C11.4624 3 9 5.46243 9 8.5C9 11.5376 11.4624 14 14.5 14C17.5376 14 20 11.5376 20 8.5C20 5.46243 17.5376 3 14.5 3ZM10.5 8.5C10.5 6.29086 12.2909 4.5 14.5 4.5C16.7091 4.5 18.5 6.29086 18.5 8.5C18.5 10.7091 16.7091 12.5 14.5 12.5C12.2909 12.5 10.5 10.7091 10.5 8.5Z"
              fill="#8B8E99"></path>
            <path
              d="M14.5025 15C9.16883 15 4.5 19.0011 4.5 24C4.5 25.1046 5.39543 26 6.5 26H22.5C23.6046 26 24.5 25.1046 24.5 24C24.5 19.0057 19.8369 15 14.5025 15ZM6 24C6 19.9911 9.82583 16.5 14.5025 16.5C19.1783 16.5 23 19.9943 23 24C23 24.2761 22.7761 24.5 22.5 24.5H6.5C6.22386 24.5 6 24.2761 6 24Z"
              fill="#8B8E99"></path>
          </g>
          </g>
         </svg>
         Кабинет`;

        nav.append(
          linkHome,
          catalogBottomHeader,
          basketBottomHeader,
          favBottomHeader,
          profileBottmHeader
        );
        bottomHeader.append(nav);

        container.append(bottomHeader);
        bottomHeaderInstance = bottomHeader;
      }
    } else if (bottomHeaderInstance) {
      bottomHeaderInstance.remove();
      bottomHeaderInstance = null;
    }
  }

  // Вызовем 1 раз и повесим resize
  renderBottomHeader();
  window.addEventListener("resize", renderBottomHeader);

  return header;
}

export function renderHeader() {
  const container = document.querySelector(".main_container");
  if (container.querySelector("header")) return;

  // Передаём container в Header, чтобы нижняя шапка вставлялась внутрь него
  const header = Header(container);
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
