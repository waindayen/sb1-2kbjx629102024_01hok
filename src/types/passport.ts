export interface Passport {
  id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  nationality: string;
  passport_number: string;
  issue_date: string;
  expiry_date: string;
  photo: string | null;
  created_at: string;
  updated_at: string;
}

export interface PassportFormData {
  first_name: string;
  last_name: string;
  date_of_birth: string;
  nationality: string;
  passport_number: string;
  issue_date: string;
  expiry_date: string;
  photo: string | null;
}