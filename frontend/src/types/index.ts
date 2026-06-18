export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number;
  currency: string;
  stock_quantity: number;
}

export interface AuthResponse {
  token: string;
  user: User;
  message: string;
}