import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getProductById } from "../features/catalog/productService";
import { addToCart } from "../features/cart/cartService";

type ProductDetail = {
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
  brand?: {
    id: number;
    name: string;
  };
  store?: {
    id: number;
    name: string;
    email?: string;
  };
};

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const loadProduct = async () => {
    try {
      const data = await getProductById(Number(id));
      setProduct(data);
    } catch {
      console.error("Failed to load product detail");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;

    try {
      await addToCart(product.id, 1);
      setMessage("Product added to cart successfully.");
    } catch {
      setMessage("Failed to add product to cart.");
    }

    setTimeout(() => setMessage(""), 2000);
  };

  if (loading) {
    return (
      <div className="container py-5">
        <p>Loading...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">Product not found.</div>
      </div>
    );
  }

  const isOutOfStock = product.stock <= 0;

  return (
    <div className="container py-5">
      <div className="mb-4">
        <Link to="/products" className="text-decoration-none">
          ← Back to Products
        </Link>
      </div>

      {message && <div className="alert alert-info">{message}</div>}

      <div className="card shadow-sm border-0">
        <div className="card-body p-4 p-lg-5">
          <div className="row g-5 align-items-center">
            <div className="col-lg-6">
              <div
                className="bg-light border rounded d-flex align-items-center justify-content-center"
                style={{ minHeight: "420px", overflow: "hidden" }}
              >
                <img
                  src={product.imageUrl || "/products/iphone15.png"}
                  alt={product.name}
                  className="img-fluid"
                  style={{ maxHeight: "360px", objectFit: "contain" }}
                />
              </div>
            </div>

            <div className="col-lg-6">
              {product.category?.name && (
                <div className="mb-2">
                  <span className="badge bg-light text-dark border">
                    {product.category.name}
                  </span>
                </div>
              )}

              <h1 className="fw-bold mb-3">{product.name}</h1>

              <p className="text-muted mb-4">{product.description}</p>

              <div className="mb-3">
                <span className="text-muted d-block">Brand</span>
                <strong>{product.brand?.name || "-"}</strong>
              </div>

              <div className="mb-3">
                <span className="text-muted d-block">Store</span>
                <strong>{product.store?.name || "-"}</strong>
              </div>

              <div className="mb-3">
                {isOutOfStock ? (
                  <span className="badge bg-danger">Out of Stock</span>
                ) : product.stock <= 3 ? (
                  <span className="badge bg-warning text-dark">
                    Low Stock: {product.stock}
                  </span>
                ) : (
                  <span className="badge bg-success">
                    In Stock: {product.stock}
                  </span>
                )}
              </div>

              <div className="mb-4">
                <span className="text-muted d-block">Price</span>
                <h2 className="fw-bold">{product.price} ₺</h2>
              </div>

              <button
                className="btn btn-dark btn-lg"
                onClick={handleAddToCart}
                disabled={isOutOfStock}
              >
                {isOutOfStock ? "Unavailable" : "Add to Cart"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
