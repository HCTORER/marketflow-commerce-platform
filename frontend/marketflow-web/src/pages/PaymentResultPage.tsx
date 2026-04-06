import { useLocation, Link } from "react-router-dom";

// URL query param alır (?status=success gibi)
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function PaymentResultPage({
  type,
}: {
  type: "success" | "fail" | "cancel";
}) {
  const query = useQuery();
  const orderId = query.get("orderId");

  // UI renk ve mesaj
  const config = {
    success: {
      title: "Payment Successful",
      message: "Your order has been completed successfully.",
      color: "success",
    },
    fail: {
      title: "Payment Failed",
      message: "Something went wrong during payment.",
      color: "danger",
    },
    cancel: {
      title: "Payment Cancelled",
      message: "You cancelled the payment process.",
      color: "warning",
    },
  }[type];

  return (
    <div className="container py-5 text-center">
      <div className={`alert alert-${config.color}`}>
        <h2 className="fw-bold">{config.title}</h2>
        <p className="mt-3">{config.message}</p>

        {orderId && <p className="text-muted">Order ID: {orderId}</p>}
      </div>

      <div className="mt-4 d-flex justify-content-center gap-3">
        <Link to="/orders" className="btn btn-dark">
          Go to Orders
        </Link>

        <Link to="/products" className="btn btn-outline-dark">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
