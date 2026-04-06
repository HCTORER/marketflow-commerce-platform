import { Route, Routes } from "react-router-dom";

import HomePage from "../pages/HomePage";
import ProductsPage from "../pages/ProductsPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import CartPage from "../pages/CartPage";
import OrdersPage from "../pages/OrdersPage";
import AddressesPage from "../pages/AddressesPage";
import AdminOrdersPage from "../pages/AdminOrdersPage";
import AdminPaymentsPage from "../pages/AdminPaymentsPage";
import PaymentResultPage from "../pages/PaymentResultPage";
import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";
import ProductDetailPage from "../pages/ProductDetailPage";

// Auth user tipi
type AuthUser = {
  fullName: string;
  role: string;
};

type AppRoutesProps = {
  authUser: AuthUser | null;
  onLogin: (user: AuthUser) => void;
};

export default function AppRoutes({ authUser, onLogin }: AppRoutesProps) {
  return (
    <Routes>
      <Route path="/" element={<HomePage authUser={authUser} />} />
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/products/:id" element={<ProductDetailPage />} />
      <Route path="/login" element={<LoginPage onLogin={onLogin} />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route
        path="/cart"
        element={
          <ProtectedRoute authUser={authUser}>
            <CartPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/orders"
        element={
          <ProtectedRoute authUser={authUser}>
            <OrdersPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/addresses"
        element={
          <ProtectedRoute authUser={authUser}>
            <AddressesPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/orders"
        element={
          <AdminRoute authUser={authUser}>
            <AdminOrdersPage />
          </AdminRoute>
        }
      />

      <Route
        path="/admin/payments"
        element={
          <AdminRoute authUser={authUser}>
            <AdminPaymentsPage />
          </AdminRoute>
        }
      />

      <Route
        path="/payment/success"
        element={<PaymentResultPage type="success" />}
      />
      <Route path="/payment/fail" element={<PaymentResultPage type="fail" />} />
      <Route
        path="/payment/cancel"
        element={<PaymentResultPage type="cancel" />}
      />
    </Routes>
  );
}
