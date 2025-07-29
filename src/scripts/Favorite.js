import { renderProducts } from "../components/Card.js";
import { getGoods } from "../utils/getGoods.js";
import { getFavorites } from "../utils/favorites.js";

export async function FavoritePage() {
  const data = await getGoods();
  const goods = Array.isArray(data) ? data : data.goods;

  const favorites = getFavorites();

  const favProducts = data.filter((product) => favorites.includes(product.id));
  const container = document.querySelector(".container");
  container.innerHTML = "";

  if (favorites.length === 0) {
    console.warn("Нет избранных товаров");
    const empty = document.createElement("div");
    empty.className = "favorite-div";

    empty.innerHTML = `
    <div class="for_image">
      <img src="/images/favorites_img.png" alt="Нет избранных товаров" />
    </div>
    <h1 class="favorite_div_h1">Добавьте то, что понравилось</h1>
    <p class="favorite_div_p">Перейдите на главную страницу и нажмите на ♡ в товаре</p>
    <a class="favorite_div_link" href="/">На главную</a>
  `;

    container.appendChild(empty);
    return;
  }

  const title = document.createElement("h1");
  title.className = "favorite_h1";
  title.textContent = "Избранное";

  container.appendChild(title);
  renderProducts(favProducts, container);
}

FavoritePage();

console.log(getFavorites());
