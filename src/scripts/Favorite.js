import { renderProducts } from "../components/Card.js";
import { getGoods } from "../utils/getGoods.js";
import { getFavorites } from "../utils/favorites.js";

function renderEmpty(container) {
  const favoriteDiv = document.createElement("div");
  const divImage = document.createElement("div");
  const img = document.createElement("img");
  const favorite_h1 = document.createElement("h1");
  const favorite_p = document.createElement("p");
  const linkInMainPage = document.createElement("a");

  favoriteDiv.className = "favorite-div";
  divImage.className = "for_image";
  img.src = "/images/favorites_img.png";
  img.alt = "Нет избранных товаров";
  favorite_h1.className = "favorite_div_h1";
  favorite_h1.textContent = "Добавьте то, что понравилось";
  favorite_p.className = "favorite_div_p";
  favorite_p.textContent = "Перейдите на главную страницу и нажмите на ♡ в товаре";
  linkInMainPage.className = "link_in_main_page";
  linkInMainPage.textContent = "На главную";
  linkInMainPage.href = "/";

  divImage.append(img);
  favoriteDiv.append(divImage, favorite_h1, favorite_p, linkInMainPage);
  container.append(favoriteDiv);
}

export async function FavoritePage() {
  const container = document.querySelector(".container");
  const title = document.createElement("h1");
  container.innerHTML = "";

  title.className = "favorite_h1";
  title.textContent = "Избранное";

  const [goods, favIds] = [await getGoods(), getFavorites()];
  const favSet = new Set(favIds);
  const favProducts = goods.filter(p => favSet.has(String(p.id)));

  if (favProducts.length === 0) {
    renderEmpty(container);
    return;
  }

  container.appendChild(title);
  renderProducts(favProducts, container);
}

if (!window.__favListenerAttached) {
  window.addEventListener("favorites:changed", () => {
    if (window.location.pathname === "/favorite") {
      FavoritePage();
    }
  });
  window.__favListenerAttached = true;
}

FavoritePage();
