export type FavoriteItem = {
  id: string;
  code: string;
  title?: string;
  price: number;
  fake_price?: number;
  images: string[];
  is_white?: boolean;
};

const FAVORITES_KEY = "tachioni_favorites";

export function getFavorites(): FavoriteItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error("Failed to read favorites from localStorage", e);
    return [];
  }
}

export function isItemFavorite(id: string): boolean {
  if (typeof window === "undefined") return false;
  const list = getFavorites();
  return list.some((item) => String(item.id) === String(id) || String(item.code) === String(id));
}

export function toggleFavoriteItem(item: FavoriteItem): boolean {
  if (typeof window === "undefined") return false;
  try {
    const list = getFavorites();
    const existingIndex = list.findIndex(
      (f) => String(f.id) === String(item.id) || (f.code && f.code === item.code)
    );

    let isAdded = false;
    let nextList: FavoriteItem[] = [];

    if (existingIndex >= 0) {
      // Đã có -> Bỏ yêu thích
      nextList = list.filter((_, idx) => idx !== existingIndex);
      isAdded = false;
    } else {
      // Chưa có -> Thêm vào đầu danh sách
      nextList = [item, ...list];
      isAdded = true;
    }

    localStorage.setItem(FAVORITES_KEY, JSON.stringify(nextList));

    // Phát custom event để đồng bộ tức thì trên toàn trang
    window.dispatchEvent(
      new CustomEvent("favorites-updated", {
        detail: { item, isAdded, count: nextList.length },
      })
    );

    return isAdded;
  } catch (e) {
    console.error("Failed to update favorites in localStorage", e);
    return false;
  }
}
