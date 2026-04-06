import { Link } from "react-router-dom";

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl?: string;
  category?: {
    id: number;
    name: string;
  };
};

type ProductCardProps = {
  product: Product;
  onAddToCart: (productId: number) => void;
};

export default function ProductCard({
  product,
  onAddToCart,
}: ProductCardProps) {
  const isOutOfStock = product.stock <= 0;

  return (
    <div className="card shadow-sm border-0 h-100 product-card">
      {/* Üst görsel alanı*/}
      <div
        className="bg-light border-bottom d-flex align-items-center justify-content-center"
        style={{ height: "220px", overflow: "hidden" }}
      >
        <Link
          to={`/products/${product.id}`}
          className="w-100 h-100 d-flex align-items-center justify-content-center"
        >
          <img
            src={product.imageUrl || "/products/iphone15.png"}
            alt={product.name}
            className="img-fluid"
            style={{ maxHeight: "180px", objectFit: "contain" }}
          />
        </Link>
      </div>

      <div className="card-body d-flex flex-column p-4">
        {/* Ürün adı */}
        <h5 className="fw-bold mb-2">
          <Link
            to={`/products/${product.id}`}
            className="text-decoration-none text-dark"
          >
            {product.name}
          </Link>
        </h5>

        {product.category?.name && (
          <div className="mb-2">
            <span className="badge bg-light text-dark border">
              {product.category.name}
            </span>
          </div>
        )}

        {/* Açıklama */}
        <p className="text-muted small mb-3" style={{ minHeight: "48px" }}>
          {product.description}
        </p>

        {/* Stok badge */}
        <div className="mb-3">
          {isOutOfStock ? (
            <span className="badge bg-danger">Out of Stock</span>
          ) : product.stock <= 3 ? (
            <span className="badge bg-warning text-dark">
              Low Stock: {product.stock}
            </span>
          ) : (
            <span className="badge bg-success">In Stock: {product.stock}</span>
          )}
        </div>

        {/* Alt alan */}
        <div className="mt-auto d-flex justify-content-between align-items-center">
          <div>
            <div className="text-muted small">Price</div>
            <div className="fw-bold fs-5">{product.price} ₺</div>
          </div>

          <button
            className="btn btn-dark"
            onClick={() => onAddToCart(product.id)}
            disabled={isOutOfStock}
          >
            {isOutOfStock ? "Unavailable" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}
