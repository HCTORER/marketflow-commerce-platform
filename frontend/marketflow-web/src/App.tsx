import { useState } from "react";
import { BrowserRouter } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import AppRoutes from "./routes/AppRoutes";

// Auth user tipi
type AuthUser = {
  fullName: string;
  role: string;
};

export default function App() {
  // İlk açılışta localStorage'dan auth bilgisini al
  const [authUser, setAuthUser] = useState<AuthUser | null>(() => {
    const fullName = localStorage.getItem("fullName");
    const role = localStorage.getItem("role");

    if (fullName && role) {
      return { fullName, role };
    }

    return null;
  });

  // Login sonrası navbar ve home state güncellenir
  const handleLogin = (user: AuthUser) => {
    setAuthUser(user);
  };

  // Logout sonrası local storage temizlenir
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("fullName");
    localStorage.removeItem("email");
    localStorage.removeItem("role");
    setAuthUser(null);
    window.location.href = "/";
  };

  return (
    <BrowserRouter>
      <MainLayout authUser={authUser} onLogout={handleLogout}>
        <AppRoutes authUser={authUser} onLogin={handleLogin} />
      </MainLayout>
    </BrowserRouter>
  );
}
