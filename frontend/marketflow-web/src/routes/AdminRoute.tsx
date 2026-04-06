import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

type AuthUser = {
  fullName: string;
  role: string;
};

type AdminRouteProps = {
  authUser: AuthUser | null;
  children: ReactNode;
};

export default function AdminRoute({ authUser, children }: AdminRouteProps) {
  // Giriş yoksa login'e gönder
  if (!authUser) {
    return <Navigate to="/login" replace />;
  }

  // Admin değilse ana sayfaya gönder
  if (authUser.role !== "StoreAdmin") {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
