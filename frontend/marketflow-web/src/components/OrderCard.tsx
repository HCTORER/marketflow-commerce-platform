type OrderItem = {
  productId: number;
  productName: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
};

type Order = {
  id: number;
  totalPrice: number;
  status: string;
  items: OrderItem[];
};

type OrderCardProps = {
  order: Order;
};

export default function OrderCard({ order }: OrderCardProps) {
  const getStatusClass = (status: string) => {
    if (status === "Paid") return "bg-success";
    if (status === "Pending") return "bg-warning text-dark";
    if (status === "Cancelled") return "bg-secondary";
    return "bg-danger";
  };

  return (
    <div className="card mb-4 shadow-sm border-0">
      <div className="card-body p-4">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h5 className="mb-1 fw-bold">Order #{order.id}</h5>
            <small className="text-muted">
              Your order items and payment status are listed below.
            </small>
          </div>

          <span className={`badge ${getStatusClass(order.status)}`}>
            {order.status}
          </span>
        </div>

        {/* Items */}
        <div className="border-top pt-3">
          {order.items.map((item) => (
            <div
              key={item.productId}
              className="d-flex justify-content-between align-items-center border-bottom py-3"
            >
              <div>
                <strong>{item.productName}</strong>
                <div className="text-muted small">
                  {item.quantity} × {item.unitPrice} ₺
                </div>
              </div>

              <div className="text-end">
                <div className="text-muted small">Line Total</div>
                <div className="fw-bold">{item.totalPrice} ₺</div>
              </div>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="d-flex justify-content-between align-items-center mt-4">
          <span className="text-muted">Order Total</span>
          <h5 className="mb-0 fw-bold">{order.totalPrice} ₺</h5>
        </div>
      </div>
    </div>
  );
}
