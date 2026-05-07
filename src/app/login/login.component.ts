import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/Services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  hide: boolean = true;
  errorMessage: string = '';
  loading: boolean = false;

  constructor(private authService: AuthService, private router: Router) {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/events']);
    }
  }

  Login(): void {
    if (!this.email || !this.password) return;
    this.loading = true;
    this.errorMessage = '';

    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/events']);
      },
      error: (err: any) => {
        this.loading = false;
        const code = err?.code || '';
        if (code === 'auth/user-not-found' || code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
          this.errorMessage = 'Email ou mot de passe incorrect.';
        } else if (code === 'auth/too-many-requests') {
          this.errorMessage = 'Trop de tentatives. Réessayez plus tard.';
        } else {
          this.errorMessage = "Erreur de connexion. Vérifiez vos identifiants.";
        }
      }
    });
  }
}
