import { createProductCard } from "../components/Card.js";
import { getGoods } from "../utils/getGoods.js";

export default async function CategoryPage() {
  document.body.classList.remove("no-scroll");
  document.documentElement.classList.remove("no-scroll");

  const section = document.querySelector(".categoryPage");
  const container = document.querySelector(".product-container");
  const title = document.createElement("h1");
  const hash = window.location.hash;
  const query = new URLSearchParams(hash.slice(1));
  const type = query.get("type");

  const TypesTranslate = {
    TV: "Телевизоры",
    PC: "Компьютеры",
    kitchen: "Кухонная техника",
    furniture: "Мебель",
    audio: "Аудио",
  };

  title.className = "category-title";
  title.textContent = TypesTranslate[type] || type || "Категория не найдена";

  container.innerHTML = "";
  const oldTitle = section.querySelector(".category-title");
  if (oldTitle) oldTitle.remove();

  const oldEmpty = section.querySelector(".emptyText");
  if (oldEmpty) oldEmpty.remove();

  section.prepend(title);

  if (!type) return;

  try {
    const allGoods = await getGoods();
    const filtered = allGoods.filter((item) => item.type === type);

    if (filtered.length === 0) {
      const emptyText = document.createElement("h2");
      emptyText.className = "emptyText";
      emptyText.textContent = "Нет товаров в этой категории.";
      section.append(emptyText);
    } else {
      filtered.forEach((product) => {
        container.append(createProductCard(product));
      });
    }
  } catch (error) {
    console.error("Ошибка при загрузке товаров:", error);
  }
}
