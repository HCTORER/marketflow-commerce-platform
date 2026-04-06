import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";

// Auth user tipi
type AuthUser = {
  fullName: string;
  role: string;
};

type MainLayoutProps = {
  authUser: AuthUser | null;
  onLogout: () => void;
  children: ReactNode;
};

function Navbar({
  authUser,
  onLogout,
}: {
  authUser: AuthUser | null;
  onLogout: () => void;
}) {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom shadow-sm sticky-top">
      <div className="container">
        <NavLink to="/" className="navbar-brand fw-bold">
          MarketFlow
        </NavLink>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNavbar"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="mainNavbar">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink to="/" className="nav-link">
                Home
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink to="/products" className="nav-link">
                Products
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink to="/cart" className="nav-link">
                Cart
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink to="/orders" className="nav-link">
                Orders
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink to="/addresses" className="nav-link">
                Addresses
              </NavLink>
            </li>

            {authUser?.role === "StoreAdmin" && (
              <>
                <li className="nav-item">
                  <NavLink to="/admin/orders" className="nav-link">
                    Admin Orders
                  </NavLink>
                </li>

                <li className="nav-item">
                  <NavLink to="/admin/payments" className="nav-link">
                    Admin Payments
                  </NavLink>
                </li>
              </>
            )}
          </ul>

          {!authUser ? (
            <div className="d-flex gap-2">
              <NavLink to="/login" className="btn btn-outline-dark btn-sm">
                Login
              </NavLink>
              <NavLink to="/register" className="btn btn-dark btn-sm">
                Register
              </NavLink>
            </div>
          ) : (
            <div className="d-flex align-items-center gap-3">
              <span className="text-muted small">
                {authUser.fullName} ({authUser.role})
              </span>
              <button
                onClick={onLogout}
                className="btn btn-outline-danger btn-sm"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="border-top py-4 mt-auto bg-white">
      <div className="container text-center text-muted small">
        © 2026 MarketFlow. Professional e-commerce platform.
      </div>
    </footer>
  );
}

export default function MainLayout({
  authUser,
  onLogout,
  children,
}: MainLayoutProps) {
  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <Navbar authUser={authUser} onLogout={onLogout} />

      <main className="flex-grow-1 bg-light">{children}</main>

      <Footer />
    </div>
  );
}
