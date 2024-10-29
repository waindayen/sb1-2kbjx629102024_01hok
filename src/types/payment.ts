export interface Price {
  id: string;
  product: string;
  unit_amount: number;
  currency: string;
  type: 'one_time' | 'recurring';
  interval?: 'month' | 'year';
  interval_count?: number;
}

export interface Subscription {
  id: string;
  status: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
}

export interface PaymentMethod {
  id: string;
  brand: string;
  last4: string;
  exp_month: number;
  exp_year: number;
}