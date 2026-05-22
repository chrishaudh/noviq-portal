export type ServiceType =
  | "TV Mounting"
  | "Picture & Art Hanging"
  | "Floating Shelves"
  | "Closet Shelving"
  | "Curtains & Blinds";

export type QuoteRequest = {
  business_id: string;
  customer_name: string;
  email?: string;
  phone?: string;
  service_type: ServiceType;
  message?: string;
  address_zip?: string;
};

export type QuoteResponse = QuoteRequest & {
  id: string;
  estimated_price: string | number;
  status: string;
  created_at: string;
  updated_at: string;
};

export type AvailabilitySlot = {
  start: string;
  end: string;
  available: boolean;
};

export type BookingRequest = {
  business_id: string;
  customer_name: string;
  email?: string;
  phone?: string;
  service_type: ServiceType;
  scheduled_start: string;
  address_street?: string;
  address_city?: string;
  address_state?: string;
  address_zip?: string;
  ladder_required: boolean;
  total_quote_amount?: string | number | null;
  notes?: string;
};

export type BookingResponse = BookingRequest & {
  id: string;
  booking_ref: string;
  scheduled_end?: string | null;
  duration_minutes?: number | null;
  status: string;
  deposit_required_amount: string | number;
  deposit_paid_amount: string | number;
  deposit_forfeited: boolean;
  created_at: string;
  updated_at: string;
};


export type Service = {
  id: string;
  business_id: string;
  name: string;
  description?: string | null;
  base_price?: string | number | null;
  duration_minutes?: number | null;
  estimated_duration_minutes?: number | null;
  active: boolean;
  is_active: boolean;
  same_day_eligible: boolean;
  after_hours_eligible: boolean;
};

export type BusinessSettings = {
  id: string;
  business_id: string;
  timezone: string;
  business_display_name?: string | null;
  logo_url?: string | null;
  primary_color?: string | null;
  secondary_color?: string | null;
  public_booking_title?: string | null;
  public_booking_subtitle?: string | null;
  powered_by_noviq_enabled?: boolean;
  business_start_hour: number;
  business_end_hour: number;
  sunday_enabled: boolean;
  after_hours_fee: string | number;
  same_day_fee: string | number;
  deposit_required_default: string | number;
  cancellation_policy?: string | null;
  service_radius_miles?: number | null;
};


export type Business = {
  id: string;
  name: string;
  phone?: string | null;
  email?: string | null;
  website_url?: string | null;
};


export type PublicInvoiceLineItem = {
  id: string;
  invoice_id: string;
  business_id: string;
  description: string;
  quantity: string | number;
  unit_price: string | number;
  line_total: string | number;
  service_type?: string | null;
  created_at: string;
  updated_at: string;
};

export type PublicInvoice = {
  id: string;
  invoice_number: string;
  status: string;
  customer_name?: string | null;
  customer_email?: string | null;
  customer_phone?: string | null;
  subtotal: string | number;
  deposit_amount: string | number;
  amount_paid: string | number;
  balance_due: string | number;
  deposit_status?: string;
  deposit_required_amount?: string | number;
  deposit_paid_amount?: string | number;
  deposit_balance_due?: string | number;
  due_date?: string | null;
  notes?: string | null;
  business: {
    id: string;
    name: string;
    phone?: string | null;
    email?: string | null;
    website_url?: string | null;
    logo_url?: string | null;
    primary_color?: string | null;
    secondary_color?: string | null;
    powered_by_noviq_enabled?: boolean;
  };
  booking?: {
    id?: string | null;
    booking_ref?: string | null;
    service_type?: string | null;
    scheduled_start?: string | null;
    address?: string | null;
  } | null;
  line_items: PublicInvoiceLineItem[];
  created_at: string;
  updated_at: string;
  security_note?: string;
};
