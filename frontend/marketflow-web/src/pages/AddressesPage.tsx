import { useEffect, useState } from "react";
import {
  createAddress,
  deleteAddress,
  getMyAddresses,
} from "../features/account/addressService";
import type { Address } from "../features/account/addressService";
import AddressCard from "../components/AddressCard";

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    title: "",
    fullName: "",
    phoneNumber: "",
    city: "",
    district: "",
    fullAddress: "",
    postalCode: "",
    isDefault: false,
  });

  const loadAddresses = async () => {
    try {
      const data = await getMyAddresses();
      setAddresses(data);
    } catch {
      console.error("Failed to load addresses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAddresses();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;

    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    try {
      await createAddress(form);

      setMessage("Address added successfully.");

      setForm({
        title: "",
        fullName: "",
        phoneNumber: "",
        city: "",
        district: "",
        fullAddress: "",
        postalCode: "",
        isDefault: false,
      });

      loadAddresses();
    } catch {
      setMessage("Failed to add address.");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteAddress(id);
      setMessage("Address deleted successfully.");
      loadAddresses();
    } catch {
      setMessage("Failed to delete address.");
    }
  };

  return (
    <div className="container py-5">
      <div className="row g-4">
        <div className="col-lg-5">
          <div className="card shadow-sm border-0">
            <div className="card-body p-4">
              <h3 className="fw-bold mb-4">Add New Address</h3>

              {message && <div className="alert alert-info">{message}</div>}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Title</label>
                  <input
                    type="text"
                    name="title"
                    className="form-control"
                    value={form.title}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    className="form-control"
                    value={form.fullName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="text"
                    name="phoneNumber"
                    className="form-control"
                    value={form.phoneNumber}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">City</label>
                    <input
                      type="text"
                      name="city"
                      className="form-control"
                      value={form.city}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">District</label>
                    <input
                      type="text"
                      name="district"
                      className="form-control"
                      value={form.district}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Full Address</label>
                  <textarea
                    name="fullAddress"
                    className="form-control"
                    rows={3}
                    value={form.fullAddress}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Postal Code</label>
                  <input
                    type="text"
                    name="postalCode"
                    className="form-control"
                    value={form.postalCode}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-check mb-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="isDefault"
                    checked={form.isDefault}
                    onChange={handleChange}
                  />
                  <label className="form-check-label">Set as default</label>
                </div>

                <button className="btn btn-dark w-100">Save Address</button>
              </form>
            </div>
          </div>
        </div>

        <div className="col-lg-7">
          <div className="card shadow-sm border-0">
            <div className="card-body p-4">
              <h3 className="fw-bold mb-4">My Addresses</h3>

              {loading && <p>Loading...</p>}

              {!loading && addresses.length === 0 && (
                <div className="alert alert-secondary">
                  You have no saved addresses.
                </div>
              )}

              {!loading &&
                addresses.map((address) => (
                  <AddressCard
                    key={address.id}
                    address={address}
                    onDelete={handleDelete}
                  />
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
