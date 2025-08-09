const KEY = 'favorites';

// — helpers —
const toStr = (id) => String(id);
const emit = (ids) => window.dispatchEvent(new CustomEvent('favorites:changed', { detail: { ids } }));

export function getFavorites() {
  const raw = localStorage.getItem(KEY);
  try {
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr.map(String) : [];
  } catch {
    return [];
  }
}

function save(ids) {
  localStorage.setItem(KEY, JSON.stringify(ids));
  emit(ids);
}

export function has(id) {
  return getFavorites().includes(toStr(id));
}

export function add(id) {
  const ids = getFavorites();
  const s = toStr(id);
  if (!ids.includes(s)) {
    ids.push(s);
    save(ids);
  }
}

export function remove(id) {
  const s = toStr(id);
  save(getFavorites().filter(x => x !== s));
}

export function toggle(id) {
  has(id) ? remove(id) : add(id);
}
