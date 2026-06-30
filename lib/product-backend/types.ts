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

export interface ApiResult<T = void> {
  ok: boolean;
  data?: T;
  error?: string;
}
