import { useEffect, useState } from "react";
import { getAdminPayments } from "../features/admin/adminService";
import type { AdminPayment } from "../features/admin/adminService";

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<AdminPayment[]>([]);
  const [loading, setLoading] = useState(true);

  const loadPayments = async () => {
    try {
      const data = await getAdminPayments();
      setPayments(data);
    } catch {
      console.error("Failed to load payments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayments();
  }, []);

  // 📊 SUMMARY
  const totalPayments = payments.length;
  const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0);
  const successPayments = payments.filter(
    (p) => p.status === "SUCCESS" || p.status === "Paid",
  ).length;

  return (
    <div className="container py-5">
      <h2 className="fw-bold mb-2">Admin Payments</h2>
      <p className="text-muted mb-4">Monitor all payment transactions.</p>

      {/* 🔥 SUMMARY */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card shadow-sm border-0 text-center p-3">
            <h6 className="text-muted">Total Payments</h6>
            <h3 className="fw-bold">{totalPayments}</h3>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm border-0 text-center p-3">
            <h6 className="text-muted">Successful</h6>
            <h3 className="fw-bold text-success">{successPayments}</h3>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm border-0 text-center p-3">
            <h6 className="text-muted">Total Amount</h6>
            <h3 className="fw-bold">{totalAmount} ₺</h3>
          </div>
        </div>
      </div>

      {/* 💳 PAYMENT LIST */}
      {loading && <p>Loading...</p>}

      {!loading && payments.length === 0 && (
        <div className="alert alert-secondary">No payments found.</div>
      )}

      {!loading &&
        payments.map((payment) => (
          <div key={payment.id} className="card mb-3 shadow-sm border-0">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h5 className="mb-1">Payment #{payment.id}</h5>
                  <div className="text-muted small">
                    Order #{payment.orderId}
                  </div>
                  <div className="text-muted small">{payment.customerName}</div>
                </div>

                <span
                  className={`badge ${
                    payment.status === "SUCCESS" || payment.status === "Paid"
                      ? "bg-success"
                      : payment.status === "Pending"
                        ? "bg-warning text-dark"
                        : "bg-danger"
                  }`}
                >
                  {payment.status}
                </span>
              </div>

              <div className="mt-3">
                <div>
                  <strong>Amount:</strong> {payment.amount} ₺
                </div>
                <div>
                  <strong>Provider:</strong> {payment.provider}
                </div>
                <div>
                  <strong>Payment ID:</strong> {payment.paymentId ?? "-"}
                </div>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}
