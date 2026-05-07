export interface Registration {
  id: number;
  user_id: number;
  event_id: number;
  created_at: string;
  user?: { id: number; name: string; email: string };
  event?: { id: number; title: string; start_date: string; place: string };
}
