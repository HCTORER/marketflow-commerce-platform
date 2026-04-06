import { api } from "../../api/api";

// Checkout isteği
export async function createOrder(addressId: number) {
  const response = await api.post("/order/checkout", {
    addressId,
  });

  return response.data;
}

// Payment başlatır
export async function startPayment(orderId: number) {
  const response = await api.post("/payment/start", {
    orderId,
  });

  return response.data;
}
