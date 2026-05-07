import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/Services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  form!: FormGroup;
  hide: boolean = true;
  errorMessage: string = '';
  loading: boolean = false;

  constructor(private authService: AuthService, private router: Router) {
    this.form = new FormGroup({
      name: new FormControl(null, [Validators.required, Validators.minLength(3)]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(8)]),
      password_confirmation: new FormControl(null, [Validators.required])
    });
  }

  Register(): void {
    if (this.form.invalid) return;
    this.loading = true;
    this.errorMessage = '';

    const { name, email, password } = this.form.value;

    this.authService.register({ name, email, password }).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/events']);
      },
      error: (err: any) => {
        this.loading = false;
        const code = err?.code || '';
        if (code === 'auth/email-already-in-use') {
          this.errorMessage = 'Cet email est déjà utilisé.';
        } else if (code === 'auth/weak-password') {
          this.errorMessage = 'Mot de passe trop faible (min. 8 caractères).';
        } else {
          this.errorMessage = "Erreur lors de l'inscription.";
        }
      }
    });
  }
}
