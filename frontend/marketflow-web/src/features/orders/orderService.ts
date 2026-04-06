import { api } from "../../api/api";

// Sipariş içindeki ürün tipi
export type OrderItem = {
  productId: number;
  productName: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
};

// Sipariş tipi
export type Order = {
  id: number;
  totalPrice: number;
  status: string;
  items: OrderItem[];
};

// Kullanıcının siparişlerini backend'den çeker
export const getMyOrders = async (): Promise<Order[]> => {
  const response = await api.get("/order/my");
  return response.data;
};
