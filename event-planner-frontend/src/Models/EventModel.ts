export interface EventModel {
  id: number;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  place: string;
  price: number;
  is_free: boolean;
  capacity: number;
  image: string | null;
  category_id: number;
  created_by: number;
  status: string;
  available_spots?: number;
  registrations_count?: number;
  category?: { id: number; name: string };
  creator?: { id: number; name: string };
}
