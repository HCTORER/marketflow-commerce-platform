import type { Address } from "../features/account/addressService";

type AddressCardProps = {
  address: Address;
  onDelete: (id: number) => void;
};

export default function AddressCard({ address, onDelete }: AddressCardProps) {
  return (
    <div className="border rounded p-3 mb-3 bg-white">
      <div className="d-flex justify-content-between align-items-start">
        <div>
          <h5 className="mb-1">
            {address.title}{" "}
            {address.isDefault && (
              <span className="badge bg-dark ms-2">Default</span>
            )}
          </h5>

          <div>{address.fullName}</div>
          <div className="text-muted small">{address.phoneNumber}</div>
          <div className="text-muted small">
            {address.city} / {address.district}
          </div>
          <div className="text-muted small">{address.fullAddress}</div>
          <div className="text-muted small">{address.postalCode}</div>
        </div>

        <button
          className="btn btn-outline-danger btn-sm"
          onClick={() => onDelete(address.id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
