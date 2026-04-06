import { api } from "../../api/api";

// Ürünü sepete ekler
export async function addToCart(productId: number, quantity = 1) {
  const response = await api.post(
    `/cart/add?productId=${productId}&quantity=${quantity}`,
  );
  return response.data;
}

// Sepeti getirir
export async function getCart() {
  const response = await api.get("/cart");
  return response.data;
}
