import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

type AuthUser = {
  fullName: string;
  role: string;
};

type ProtectedRouteProps = {
  authUser: AuthUser | null;
  children: ReactNode;
};

export default function ProtectedRoute({
  authUser,
  children,
}: ProtectedRouteProps) {
  // Kullanıcı giriş yapmamışsa login sayfasına yönlendir
  if (!authUser) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
