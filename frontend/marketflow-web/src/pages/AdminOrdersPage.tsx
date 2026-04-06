import { useEffect, useState } from "react";
import { getAdminOrders } from "../features/admin/adminService";
import type { AdminOrder } from "../features/admin/adminService";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    try {
      const data = await getAdminOrders();
      setOrders(data);
    } catch {
      console.error("Failed to load admin orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  // 📊 SUMMARY
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalPrice, 0);
  const paidOrders = orders.filter((o) => o.status === "Paid").length;

  return (
    <div className="container py-5">
      <h2 className="fw-bold mb-2">Admin Orders</h2>
      <p className="text-muted mb-4">Manage and monitor all customer orders.</p>

      {/* 🔥 SUMMARY CARDS */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card shadow-sm border-0 text-center p-3">
            <h6 className="text-muted">Total Orders</h6>
            <h3 className="fw-bold">{totalOrders}</h3>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm border-0 text-center p-3">
            <h6 className="text-muted">Paid Orders</h6>
            <h3 className="fw-bold text-success">{paidOrders}</h3>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm border-0 text-center p-3">
            <h6 className="text-muted">Total Revenue</h6>
            <h3 className="fw-bold">{totalRevenue} ₺</h3>
          </div>
        </div>
      </div>

      {/* 📦 ORDER LIST */}
      {loading && <p>Loading...</p>}

      {!loading && orders.length === 0 && (
        <div className="alert alert-secondary">No orders found.</div>
      )}

      {!loading &&
        orders.map((order) => (
          <div key={order.id} className="card mb-4 shadow-sm border-0">
            <div className="card-body">
              <div className="d-flex justify-content-between mb-3">
                <div>
                  <h5 className="mb-1">Order #{order.id}</h5>
                  <div className="text-muted small">
                    {order.customerName} - {order.customerEmail}
                  </div>
                </div>

                <span
                  className={`badge ${
                    order.status === "Paid"
                      ? "bg-success"
                      : order.status === "Pending"
                        ? "bg-warning text-dark"
                        : "bg-danger"
                  }`}
                >
                  {order.status}
                </span>
              </div>

              {order.items.map((item) => (
                <div
                  key={item.productId}
                  className="d-flex justify-content-between border-bottom py-2"
                >
                  <div>
                    <strong>{item.productName}</strong>
                    <div className="text-muted small">
                      {item.quantity} × {item.unitPrice} ₺
                    </div>
                  </div>

                  <div className="fw-bold">{item.totalPrice} ₺</div>
                </div>
              ))}

              <div className="d-flex justify-content-between mt-3">
                <strong>Total</strong>
                <strong>{order.totalPrice} ₺</strong>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}
