import { api } from "../../api/api";

// Adres tipi
export type Address = {
  id: number;
  title: string;
  fullName: string;
  phoneNumber: string;
  city: string;
  district: string;
  fullAddress: string;
  postalCode: string;
  isDefault: boolean;
};

// Yeni adres oluşturma tipi
export type CreateAddressRequest = {
  title: string;
  fullName: string;
  phoneNumber: string;
  city: string;
  district: string;
  fullAddress: string;
  postalCode: string;
  isDefault: boolean;
};

// Kullanıcının adreslerini getirir
export async function getMyAddresses(): Promise<Address[]> {
  const response = await api.get("/address");
  return response.data;
}

// Yeni adres ekler
export async function createAddress(data: CreateAddressRequest) {
  const response = await api.post("/address", data);
  return response.data;
}

// Adres siler
export async function deleteAddress(id: number) {
  const response = await api.delete(`/address/${id}`);
  return response.data;
}
