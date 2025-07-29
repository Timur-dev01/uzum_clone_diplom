import axios from "axios";
import { renderHeader } from "./components/Header.js";
import { ProductInfo } from "./scripts/ProductInfo.js";

const pages = [
  {
    path: "/",
    loadHtml: async (app) => {
      const response = await axios.get("/src/pages/main.html");

      app.innerHTML = response.data;
    },
    loadScripts: async () => {
      await import("/src/scripts/main.js");
    },
  },
  {
    path: "/basket",
    loadHtml: async (app) => {
      const response = await axios.get("/src/pages/Basket.html");

      app.innerHTML = response.data;
    },
    loadStyles: async () => {
      await import("../src/styles/Basket.css");
    },
    loadScripts: async () => {
      await import("../src/scripts/Basket.js");
    },
  },
  {
    path: "/favorite",
    loadHtml: async (app) => {
      const response = await axios.get("/src/pages/Favorite.html");

      app.innerHTML = response.data;
    },
    loadStyles: async () => {
      await import("../src/styles/Favorite.css");
    },
    loadScripts: async () => {
      await import("../src/scripts/Favorite.js");
    },
  },
  {
    path: "/productInfo",
    loadHtml: async (app) => {
      const response = await axios.get("/src/pages/ProductInfo.html");

      app.innerHTML = response.data;
    },
    loadStyles: async () => {
      await import("../src/styles/ProductInfo.css");
    },
    loadScripts: async () => {
      const module = await import("../src/scripts/ProductInfo.js");
      module.ProductInfo();
    },
  },
  {
    path: "/profile",
    loadHtml: async (app) => {
      const response = await axios.get("/src/pages/Profile.html");

      app.innerHTML = response.data;
    },
    loadStyles: async () => {
      await import("../src/styles/Profile.css");
    },
    loadScripts: async () => {
      await import("../src/scripts/Profile.js");
    },
  },
  {
    path: "/category",
    loadHtml: async (app) => {
      const response = await axios.get("/src/pages/Category.html");
      app.innerHTML = response.data;
    },
    loadScripts: async () => {
      const module = await import("../src/scripts/Category.js");
      module.default();
    },
    loadStyles: async () => {
      await import("../src/styles/Category.css");
    },
  },
];
function getPath() {
  return window.location.pathname;
}

window.addEventListener("popstate", router);

export async function router() {
  const path = getPath();
  const app = document.getElementById("app");
  const page = pages.find((elem) => elem.path === path);
  if (!page) return await loadNotFoundPage(app);
  if (page.loadStyles) await page.loadStyles();
  app.innerHTML = "";
  await page.loadHtml(app);
  renderHeader();
  await page.loadScripts();
}

router();
