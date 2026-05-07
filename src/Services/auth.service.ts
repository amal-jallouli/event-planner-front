import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable, from, switchMap } from 'rxjs';
import { tap } from 'rxjs/operators';
import { User } from 'src/Models/User';
import { environment } from 'src/app/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private afAuth: AngularFireAuth
  ) {}

  // ── LOGIN ──────────────────────────────────────────────────────────────────
  login(email: string, password: string): Observable<any> {
    return from(
      this.afAuth.signInWithEmailAndPassword(email, password)
    ).pipe(
      switchMap(credential => from(credential.user!.getIdToken())),
      switchMap(idToken => {
        // Send Firebase token to Laravel to get our user info
        return this.http.post<any>(`${this.apiUrl}/auth/firebase-login`, {
          token: idToken
        }).pipe(
          tap(response => {
            localStorage.setItem('firebase_token', idToken);
            localStorage.setItem('user', JSON.stringify(response.user));
          })
        );
      })
    );
  }

  // ── REGISTER ───────────────────────────────────────────────────────────────
  register(data: { name: string; email: string; password: string }): Observable<any> {
    return from(
      this.afAuth.createUserWithEmailAndPassword(data.email, data.password)
    ).pipe(
      switchMap(credential => from(credential.user!.getIdToken()).pipe(
        switchMap(idToken => {
          return this.http.post<any>(`${this.apiUrl}/auth/firebase-register`, {
            token: idToken,
            name: data.name,
            email: data.email
          }).pipe(
            tap(response => {
              localStorage.setItem('firebase_token', idToken);
              localStorage.setItem('user', JSON.stringify(response.user));
            })
          );
        })
      ))
    );
  }

  // ── LOGOUT ─────────────────────────────────────────────────────────────────
  logout(): Observable<any> {
    return from(this.afAuth.signOut()).pipe(
      tap(() => {
        localStorage.removeItem('firebase_token');
        localStorage.removeItem('user');
      })
    );
  }

  // ── TOKEN ──────────────────────────────────────────────────────────────────
  getFirebaseToken(): string | null {
    return localStorage.getItem('firebase_token');
  }

  // ── REFRESH TOKEN (called by interceptor) ─────────────────────────────────
  refreshToken(): Observable<string | null> {
    return new Observable(observer => {
      this.afAuth.currentUser.then(user => {
        if (user) {
          user.getIdToken(true).then(token => {
            localStorage.setItem('firebase_token', token);
            observer.next(token);
            observer.complete();
          });
        } else {
          observer.next(null);
          observer.complete();
        }
      });
    });
  }

  // ── HELPERS ────────────────────────────────────────────────────────────────
  getUser(): User | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('firebase_token') && !!localStorage.getItem('user');
  }

  isAdmin(): boolean {
    const user = this.getUser();
    return user?.role === 'admin';
  }
}
