export interface UserSession {
  email: string;
  name: string;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface TrackResult {
  orderId: string;
  status: string;
  eta: string;
  location: string;
}

export interface OrderDetails extends TrackResult {
  email: string;
  total: number;
  items: CartItem[];
  createdAt: string;
}

export interface ApiResult<T = void> {
  ok: boolean;
  data?: T;
  error?: string;
}
