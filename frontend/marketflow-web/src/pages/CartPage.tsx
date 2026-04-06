import { useEffect, useState } from "react";
import { getCart } from "../features/cart/cartService";
import { createOrder, startPayment } from "../features/orders/checkoutService";
import { getMyAddresses } from "../features/account/addressService";
import type { Address } from "../features/account/addressService";
import CartItemCard from "../components/CartItemCard";

type CartItem = {
  id: number;
  productId: number;
  name: string;
  price: number;
  quantity: number;
  total: number;
};

type CartResponse = {
  items: CartItem[];
  totalPrice: number;
};

export default function CartPage() {
  const [cart, setCart] = useState<CartResponse>({
    items: [],
    totalPrice: 0,
  });
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [processing, setProcessing] = useState(false);

  const loadCartAndAddresses = async () => {
    try {
      const [cartData, addressData] = await Promise.all([
        getCart(),
        getMyAddresses(),
      ]);

      setCart(cartData);
      setAddresses(addressData);

      const defaultAddress = addressData.find((a) => a.isDefault);

      if (defaultAddress) {
        setSelectedAddressId(defaultAddress.id);
      } else if (addressData.length > 0) {
        setSelectedAddressId(addressData[0].id);
      }
    } catch {
      console.error("Failed to load cart or addresses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCartAndAddresses();
  }, []);

  const handleCheckout = async () => {
    setMessage("");

    if (!selectedAddressId) {
      setMessage("Please select an address before payment.");
      return;
    }

    setProcessing(true);

    try {
      const orderResult = await createOrder(selectedAddressId);
      const paymentResult = await startPayment(orderResult.id);

      if (paymentResult.paymentPageUrl) {
        window.location.href = paymentResult.paymentPageUrl;
        return;
      }

      setMessage("Payment page could not be created.");
    } catch {
      setMessage("Checkout process failed.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="container py-5">
      <h2 className="fw-bold mb-4">Cart</h2>
      <p className="text-muted mb-4">
        Review your cart items, choose your address and continue securely to
        payment.
      </p>

      {message && <div className="alert alert-info">{message}</div>}
      {loading && <p>Loading...</p>}

      {!loading && cart.items.length === 0 && (
        <div className="alert alert-secondary">Your cart is empty.</div>
      )}

      {!loading && cart.items.length > 0 && (
        <div className="row g-4">
          <div className="col-lg-7">
            <div className="card shadow-sm border-0">
              <div className="card-body">
                {cart.items.map((item) => (
                  <CartItemCard key={item.id} item={item} />
                ))}

                <div className="border-top pt-4 mt-3">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="text-muted">Subtotal</span>
                    <span className="fw-semibold">{cart.totalPrice} ₺</span>
                  </div>

                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="text-muted">Shipping</span>
                    <span className="fw-semibold">Free</span>
                  </div>

                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0 fw-bold">Total</h5>
                    <h5 className="mb-0 fw-bold">{cart.totalPrice} ₺</h5>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-5">
            <div className="card shadow-sm border-0">
              <div className="card-body">
                <h5 className="fw-bold mb-3">Select Address</h5>

                {addresses.length === 0 && (
                  <div className="alert alert-warning">
                    No address found. Please add an address first.
                  </div>
                )}

                {addresses.map((address) => (
                  <div
                    key={address.id}
                    className={`border rounded p-3 mb-3 ${
                      selectedAddressId === address.id
                        ? "border-dark bg-light"
                        : "border-secondary-subtle"
                    }`}
                  >
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="selectedAddress"
                        checked={selectedAddressId === address.id}
                        onChange={() => setSelectedAddressId(address.id)}
                      />
                      <label className="form-check-label w-100">
                        <div className="fw-bold">
                          {address.title} {address.isDefault && "(Default)"}
                        </div>
                        <div>{address.fullName}</div>
                        <div className="text-muted small">
                          {address.phoneNumber}
                        </div>
                        <div className="text-muted small">
                          {address.city} / {address.district}
                        </div>
                        <div className="text-muted small">
                          {address.fullAddress}
                        </div>
                        <div className="text-muted small">
                          {address.postalCode}
                        </div>
                      </label>
                    </div>
                  </div>
                ))}

                <p className="text-muted small mt-3 mb-3">
                  You will be redirected securely to the payment provider after
                  order confirmation.
                </p>

                <button
                  className="btn btn-dark w-100 mt-2"
                  onClick={handleCheckout}
                  disabled={processing || addresses.length === 0}
                >
                  {processing
                    ? "Redirecting to payment..."
                    : "Proceed to Payment"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
