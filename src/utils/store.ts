"use client";

export interface CartItem {
  id: string;
  size: string;
  qty: number;
}

export function getWishlist(): string[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem("ghubor-wishlist");
  return stored ? JSON.parse(stored) : [];
}

export function toggleWishlist(id: string): boolean {
  if (typeof window === "undefined") return false;
  let list = getWishlist();
  const index = list.indexOf(id);
  let added = false;
  if (index > -1) {
    list.splice(index, 1);
  } else {
    list.push(id);
    added = true;
  }
  localStorage.setItem("ghubor-wishlist", JSON.stringify(list));
  window.dispatchEvent(new Event("wishlist-updated"));
  return added;
}

export function isInWishlist(id: string): boolean {
  return getWishlist().includes(id);
}

export function getCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem("ghubor-cart");
  return stored ? JSON.parse(stored) : [];
}

export function addToCart(id: string, size: string, qty: number = 1) {
  if (typeof window === "undefined") return;
  let list = getCart();
  const index = list.findIndex((item) => item.id === id && item.size === size);
  if (index > -1) {
    list[index].qty += qty;
  } else {
    list.push({ id, size, qty });
  }
  localStorage.setItem("ghubor-cart", JSON.stringify(list));
  window.dispatchEvent(new Event("cart-updated"));
}

export function removeFromCart(id: string, size: string) {
  if (typeof window === "undefined") return;
  let list = getCart();
  list = list.filter((item) => !(item.id === id && item.size === size));
  localStorage.setItem("ghubor-cart", JSON.stringify(list));
  window.dispatchEvent(new Event("cart-updated"));
}

export function updateCartQty(id: string, size: string, qty: number) {
  if (typeof window === "undefined") return;
  let list = getCart();
  const index = list.findIndex((item) => item.id === id && item.size === size);
  if (index > -1) {
    list[index].qty = Math.max(1, qty);
    localStorage.setItem("ghubor-cart", JSON.stringify(list));
    window.dispatchEvent(new Event("cart-updated"));
  }
}

export function clearCart() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("ghubor-cart");
  window.dispatchEvent(new Event("cart-updated"));
}
