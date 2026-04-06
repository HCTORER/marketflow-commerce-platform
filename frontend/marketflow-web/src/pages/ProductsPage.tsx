import { useEffect, useMemo, useState } from "react";
import { getProducts } from "../features/catalog/productService";
import { addToCart } from "../features/cart/cartService";
import ProductCard from "../components/ProductCard";

// Ürün tipi
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

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // Filtre state
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOption, setSortOption] = useState("default");

  // Ürünleri backend'den çeker
  const loadProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch {
      console.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // Sepete ürün ekler
  const handleAddToCart = async (productId: number) => {
    try {
      await addToCart(productId, 1);
      setMessage("Product added to cart successfully.");
    } catch {
      setMessage("Failed to add product to cart.");
    }

    setTimeout(() => setMessage(""), 2000);
  };

  // Kategori listesini otomatik çıkarır
  const categories = useMemo(() => {
    const names = products
      .map((p) => p.category?.name)
      .filter((name): name is string => Boolean(name));

    return ["All", ...new Set(names)];
  }, [products]);

  // Search + category filtreleme
  const filteredProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === "All" ||
        product.category?.name === selectedCategory;

      return matchesSearch && matchesCategory;
    });

    const sorted = [...filtered];

    switch (sortOption) {
      case "price-asc":
        sorted.sort((a, b) => a.price - b.price);
        break;

      case "price-desc":
        sorted.sort((a, b) => b.price - a.price);
        break;

      case "stock-desc":
        sorted.sort((a, b) => b.stock - a.stock);
        break;

      case "name-asc":
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;

      default:
        break;
    }

    return sorted;
  }, [products, searchTerm, selectedCategory, sortOption]);

  return (
    <div className="container py-5">
      <h2 className="fw-bold mb-2">Products</h2>
      <p className="text-muted mb-1">
        Browse our catalog, search products and filter by category.
      </p>
      <p className="text-muted mb-4">
        Showing {filteredProducts.length} product(s)
      </p>
      {message && <div className="alert alert-info">{message}</div>}

      {/* Filtre alanı */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-lg-5">
              <label className="form-label">Search</label>
              <input
                type="text"
                className="form-control"
                placeholder="Search by product name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="col-lg-4">
              <label className="form-label">Category</label>
              <select
                className="form-select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map((categoryName) => (
                  <option key={categoryName} value={categoryName}>
                    {categoryName}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-lg-3">
              <label className="form-label">Sort By</label>
              <select
                className="form-select"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="default">Default</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="stock-desc">Stock: High to Low</option>
                <option value="name-asc">Name: A to Z</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {loading && <p>Loading...</p>}

      {!loading && filteredProducts.length === 0 && (
        <div className="alert alert-secondary">
          No products matched your search or category filter.
        </div>
      )}

      <div className="row g-4">
        {filteredProducts.map((product) => (
          <div key={product.id} className="col-sm-6 col-lg-4">
            <ProductCard product={product} onAddToCart={handleAddToCart} />
          </div>
        ))}
      </div>
    </div>
  );
}
