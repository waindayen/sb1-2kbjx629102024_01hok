export interface VisaDocument {
  name: string;
  url: string;
  type: string;
  size: number;
}

export interface Visa {
  id: string;
  passport_id: string;
  visa_number: string;
  country: string;
  visa_type: string;
  issue_date: string;
  expiry_date: string;
  status: 'active' | 'expired' | 'cancelled';
  notes?: string;
  documents: VisaDocument[];
  created_at: string;
  updated_at: string;
  passport?: {
    first_name: string;
    last_name: string;
    passport_number: string;
  };
}

export interface VisaFormData {
  passport_id: string;
  visa_number: string;
  country: string;
  visa_type: string;
  issue_date: string;
  expiry_date: string;
  notes?: string;
  documents: VisaDocument[];
}