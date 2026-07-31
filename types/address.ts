export interface Address {
  id: number;
  recipientName: string;
  phone: string;
  provinceCode: string;
  provinceName: string;
  districtCode: string;
  districtName: string;
  wardCode: string;
  wardName: string;
  streetAddress: string;
  fullAddress: string;
  defaultAddress: boolean;
  label?: string;
}

export interface AddressRequest {
  recipientName: string;
  phone: string;
  provinceCode: string;
  provinceName: string;
  districtCode: string;
  districtName: string;
  wardCode: string;
  wardName: string;
  streetAddress: string;
  setAsDefault?: boolean;
  label?: string;
}
