import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Registration } from 'src/Models/Registration';
import { environment } from 'src/app/environment';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  register(eventId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/registrations/${eventId}`, {});
  }

  unregister(eventId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/registrations/${eventId}`);
  }

  GetMyRegistrations(): Observable<Registration[]> {
    return this.http.get<Registration[]>(`${this.apiUrl}/registrations/my`);
  }

  GetAllRegistrations(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/registrations`);
  }

  checkRegistration(eventId: number): Observable<{ is_registered: boolean }> {
    return this.http.get<{ is_registered: boolean }>(`${this.apiUrl}/registrations/check/${eventId}`);
  }
}
