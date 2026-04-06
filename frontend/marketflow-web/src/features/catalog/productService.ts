import { api } from "../../api/api";

// Tüm ürünleri getirir
export async function getProducts() {
  const response = await api.get("/product");
  return response.data;
}

// Tek ürün detayını getirir
export async function getProductById(id: number) {
  const response = await api.get(`/product/${id}`);
  return response.data;
}
