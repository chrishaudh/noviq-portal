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
  payment_provider?: string | null;
  payment_status?: string | null;
  stripe_payment_link?: string | null;
  stripe_checkout_session_id?: string | null;
  public_access_token?: string | null;
  public_access_token_expires_at?: string | null;
  public_access_revoked_at?: string | null;
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


export type PublicQuote = QuoteResponse & {
  quote_number?: string | null;
  estimated_duration?: number | null;
  expiration_date?: string | null;
  notes?: string | null;
  customer_message?: string | null;
  line_items?: Array<{ description: string; quantity: string | number; unit_price: string | number; line_total?: string | number | null; optional_add_on?: boolean }>;
  approved_at?: string | null;
  rejected_at?: string | null;
  converted_booking_id?: string | null;
  public_access_token?: string | null;
  public_access_token_expires_at?: string | null;
  public_access_revoked_at?: string | null;
  business: { id: string; name: string; logo_url?: string | null; primary_color?: string | null; secondary_color?: string | null; powered_by_noviq_enabled?: boolean };
};


export type PublicBooking = {
  id: string;
  booking_ref: string;
  customer_name?: string | null;
  service_type?: string | null;
  scheduled_start: string;
  scheduled_end?: string | null;
  duration_minutes?: number | null;
  address?: string | null;
  status: string;
  ladder_required?: boolean;
  deposit_status?: string;
  deposit_required_amount?: string | number;
  deposit_paid_amount?: string | number;
  deposit_payment_link?: string | null;
  deposit_payment_provider?: string | null;
  deposit_checkout_session_id?: string | null;
  public_access_token?: string | null;
  public_access_token_expires_at?: string | null;
  public_access_revoked_at?: string | null;
  assigned_contractor?: { first_name?: string | null; display_name?: string | null } | null;
  business_contact: { phone?: string | null; email?: string | null };
  business: PublicInvoice["business"];
  invoice?: { id: string; invoice_number: string; status: string; balance_due: string | number; payment_status?: string | null; payment_provider?: string | null; stripe_payment_link?: string | null; stripe_checkout_session_id?: string | null; public_access_token?: string | null } | null;
  quote?: { id: string; quote_number?: string | null; status: string; estimated_price: string | number; public_access_token?: string | null } | null;
  notes_placeholder: string;
  security_note?: string;
};

export type PublicLookupRecord = {
  id: string;
  label: string;
  status: string;
  href: string;
  service_type?: string | null;
  scheduled_start?: string | null;
  balance_due?: string | number | null;
};

export type PublicCustomerLookup = {
  business: PublicInvoice["business"];
  email: string;
  reference: string;
  bookings: PublicLookupRecord[];
  invoices: PublicLookupRecord[];
  quotes: PublicLookupRecord[];
  service_history_placeholder: string;
  support_placeholder: string;
  security_note?: string;
};

export type PublicSupportRequestPayload = {
  business_id?: string | null;
  customer_name: string;
  email: string;
  phone?: string | null;
  related_type?: string | null;
  related_id?: string | null;
  request_type: string;
  subject: string;
  message: string;
};

export type PublicSupportRequestResponse = {
  id: string;
  status: string;
  priority: string;
  message: string;
  created_at: string;
};
