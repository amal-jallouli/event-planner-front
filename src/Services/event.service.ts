import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EventModel } from 'src/Models/EventModel';
import { environment } from 'src/app/environment';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  GetAllEvents(filters?: any): Observable<any> {
    let params = new HttpParams();
    if (filters) {
      if (filters.search) params = params.set('search', filters.search);
      if (filters.category_id) params = params.set('category_id', filters.category_id);
      if (filters.status) params = params.set('status', filters.status);
    }
    return this.http.get<any>(`${this.apiUrl}/events`, { params });
  }

  getEventById(id: number): Observable<EventModel> {
    return this.http.get<EventModel>(`${this.apiUrl}/events/${id}`);
  }

  addEvent(formData: FormData): Observable<EventModel> {
    return this.http.post<EventModel>(`${this.apiUrl}/events`, formData);
  }

  updateEvent(id: number, formData: FormData): Observable<EventModel> {
    return this.http.post<EventModel>(`${this.apiUrl}/events/${id}/update`, formData);
  }

  deleteEvent(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/events/${id}`);
  }

  getDashboardStats(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/dashboard/stats`);
  }
}
