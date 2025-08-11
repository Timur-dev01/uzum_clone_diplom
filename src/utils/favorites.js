import axios from "axios";
import { getUsers } from "./getUsers.js";
import { getGoods } from "./getGoods.js";

const KEY = "favorites";
const API_BASE = "http://localhost:3001/users";

const toStr = (id) => String(id);
const emit = (ids) =>
  window.dispatchEvent(
    new CustomEvent("favorites:changed", { detail: { ids } })
  );

export function getFavorites() {
  const raw = localStorage.getItem(KEY);
  try {
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr.map(String) : [];
  } catch {
    return [];
  }
}

export function has(id) {
  return getFavorites().includes(toStr(id));
}

function saveLocal(ids) {
  localStorage.setItem(KEY, JSON.stringify(ids));
  emit(ids);
}

async function findCurrentUser() {
  const phone = localStorage.getItem("currentUserPhone");
  if (!phone) return null;
  try {
    const users = await getUsers();
    return users.find((u) => u.phoneNumber === phone) || null;
  } catch (err) {
    console.error("favorites.findCurrentUser error:", err);
    return null;
  }
}

async function buildProductObjectsFromIds(ids) {
  try {
    const goods = await getGoods();
    return ids
      .map((i) => goods.find((g) => String(g.id) === String(i)))
      .filter(Boolean);
  } catch (err) {
    console.error("favorites.buildProductObjectsFromIds error:", err);
    return [];
  }
}

async function syncFavoritesToServer(ids) {
  const user = await findCurrentUser();
  if (!user) return;
  try {
    const favObjects = await buildProductObjectsFromIds(ids);
    await axios.patch(`${API_BASE}/${user.id}`, { favorites: favObjects });
  } catch (err) {
    console.error("favorites.syncFavoritesToServer error:", err);
  }
}

(async function initFromServer() {
  try {
    const user = await findCurrentUser();
    if (!user) return;

    const serverFavs = user.favorites || [];
    const serverIds = serverFavs.map((f) =>
      typeof f === "object" && f !== null ? String(f.id) : String(f)
    );

    const localIds = getFavorites();

    if (JSON.stringify(serverIds) !== JSON.stringify(localIds)) {
      saveLocal(serverIds);
    }
  } catch (err) {
    console.error("favorites.initFromServer error:", err);
  }
})();

export function add(id) {
  const s = toStr(id);
  const ids = getFavorites();
  if (!ids.includes(s)) {
    ids.push(s);
    saveLocal(ids);
    syncFavoritesToServer(ids);
  }
}

export function remove(id) {
  const s = toStr(id);
  const ids = getFavorites().filter((x) => x !== s);
  saveLocal(ids);
  syncFavoritesToServer(ids);
}

export function toggle(id) {
  has(id) ? remove(id) : add(id);
}
