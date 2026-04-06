type AuthUser = {
  fullName: string;
  role: string;
};

export default function HomePage({ authUser }: { authUser: AuthUser | null }) {
  return (
    <div>
      {/* HERO */}
      <section className="bg-dark text-white text-center py-5">
        <div className="container">
          <h1 className="fw-bold display-5">
            Build Your E-Commerce Experience
          </h1>

          <p className="mt-3 text-light">
            A modern multi-tenant commerce platform built with React & .NET
          </p>

          <div className="mt-4 d-flex justify-content-center gap-3">
            <a href="/products" className="btn btn-light btn-lg">
              Browse Products
            </a>

            <a href="/register" className="btn btn-outline-light btn-lg">
              Get Started
            </a>
          </div>
        </div>
      </section>

      {/* USER INFO */}
      {authUser && (
        <div className="container mt-4">
          <div className="alert alert-success text-center">
            Welcome back <strong>{authUser.fullName}</strong> ({authUser.role})
          </div>
        </div>
      )}

      {/* FEATURES */}
      <section className="container py-5">
        <div className="row text-center g-4">
          <div className="col-md-4">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-body">
                <h5 className="fw-bold">Fast Checkout</h5>
                <p className="text-muted">
                  Seamless and secure payment integration with Iyzico.
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-body">
                <h5 className="fw-bold">Smart Management</h5>
                <p className="text-muted">
                  Manage orders, payments and users easily.
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-body">
                <h5 className="fw-bold">Modern UI</h5>
                <p className="text-muted">
                  Built with scalable and clean frontend architecture.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
