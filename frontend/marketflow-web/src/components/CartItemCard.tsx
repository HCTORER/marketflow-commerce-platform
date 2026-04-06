type CartItem = {
  id: number;
  productId: number;
  name: string;
  price: number;
  quantity: number;
  total: number;
};

type CartItemCardProps = {
  item: CartItem;
};

export default function CartItemCard({ item }: CartItemCardProps) {
  return (
    <div className="d-flex justify-content-between align-items-center border-bottom py-3">
      <div>
        <h5 className="mb-1 fw-bold">{item.name}</h5>
        <small className="text-muted">
          Quantity: {item.quantity} × {item.price} ₺
        </small>
      </div>

      <div className="text-end">
        <div className="text-muted small">Line Total</div>
        <div className="fw-bold fs-5">{item.total} ₺</div>
      </div>
    </div>
  );
}
