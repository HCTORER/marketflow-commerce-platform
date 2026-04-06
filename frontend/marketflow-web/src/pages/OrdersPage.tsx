import { useEffect, useState } from "react";
import { getMyOrders } from "../features/orders/orderService";
import type { Order } from "../features/orders/orderService";
import OrderCard from "../components/OrderCard";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Siparişleri backend'den çeker
  const loadOrders = async () => {
    try {
      const data = await getMyOrders();
      setOrders(data);
    } catch {
      console.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  // Sayfa açılınca siparişleri getir
  useEffect(() => {
    loadOrders();
  }, []);

  return (
    <div className="container py-5">
      <h2 className="fw-bold mb-2">My Orders</h2>
      <p className="text-muted mb-4">
        Review your order history and payment status.
      </p>

      {loading && <p>Loading...</p>}

      {!loading && orders.length === 0 && (
        <div className="alert alert-secondary">
          You have no orders yet. Once you complete a purchase, your orders will
          appear here.
        </div>
      )}

      {!loading &&
        orders.map((order) => <OrderCard key={order.id} order={order} />)}
    </div>
  );
}
