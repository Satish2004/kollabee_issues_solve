export type TabType = "account" | "password" | "payment";

export interface FormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  email: string;
  fullName: string;
  firstName: string;
  lastName: string;
  address: string;
  name: string;
  phoneCountry: string;
  phoneNumber: string;
  country: string;
  state: string;
  accountHolder: string;
  bank: string;
  bankType: string;
  cvCode: string;
  zipCode: string;
  accountNumber: string;
  upinId: string;
  imageUrl: string;
}

export interface BankDetails {
  fullName: string;
  holderName?: string;
  bankName: string;
  bankType: string;
  cvCode: string;
  zipCode: string;
  accountNumber: string;
  upinId?: string;
  firstName?: string;
  userId?: string;
}

export interface PasswordResponse {
  newPassword: string;
  currentPassword: string;
  confirmPassword: string;
}

export interface Country {
  code: string;
  name: string;
  flag: string;
}

export interface Alert {
  show: boolean;
  type: "error" | "success";
  message1: string;
  message2: string;
}

export interface ValidationErrors {
  [key: string]: string;
}

export enum BankType {
  SAVINGS = "SAVINGS",
  CURRENT = "CURRENT",
}
