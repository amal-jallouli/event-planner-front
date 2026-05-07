import { Injectable } from '@angular/core';
import {
  HttpRequest, HttpHandler, HttpEvent,
  HttpInterceptor, HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError, from, switchMap, catchError } from 'rxjs';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private afAuth: AngularFireAuth, private router: Router) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('firebase_token');

    if (token) {
      request = this.addToken(request, token);
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // Token expired → refresh and retry
        if (error.status === 401) {
          return from(this.afAuth.currentUser).pipe(
            switchMap(user => {
              if (user) {
                return from(user.getIdToken(true)).pipe(
                  switchMap(newToken => {
                    localStorage.setItem('firebase_token', newToken);
                    return next.handle(this.addToken(request, newToken));
                  })
                );
              } else {
                localStorage.clear();
                this.router.navigate(['/login']);
                return throwError(() => error);
              }
            })
          );
        }
        return throwError(() => error);
      })
    );
  }

  private addToken(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }
}
