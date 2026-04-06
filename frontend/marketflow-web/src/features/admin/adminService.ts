import { api } from "../../api/api";

// Admin order item tipi
export type AdminOrderItem = {
  productId: number;
  productName: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
};

// Admin order tipi
export type AdminOrder = {
  id: number;
  customerName: string;
  customerEmail: string;
  totalPrice: number;
  status: string;
  address: {
    title: string;
    fullName: string;
    city: string;
    district: string;
    fullAddress: string;
    postalCode: string;
  };
  items: AdminOrderItem[];
  createdAt: string;
};

// Admin payment tipi
export type AdminPayment = {
  id: number;
  orderId: number;
  customerName: string;
  customerEmail: string;
  provider: string;
  status: string;
  amount: number;
  conversationId: string;
  paymentId: string | null;
  createdAt: string;
};

// Tüm siparişleri getirir
export async function getAdminOrders(): Promise<AdminOrder[]> {
  const response = await api.get("/admin/orders");
  return response.data;
}

// Tüm ödeme kayıtlarını getirir
export async function getAdminPayments(): Promise<AdminPayment[]> {
  const response = await api.get("/admin/payments");
  return response.data;
}
