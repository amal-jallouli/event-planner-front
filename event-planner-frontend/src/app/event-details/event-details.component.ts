import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EventModel } from 'src/Models/EventModel';
import { RegistrationService } from 'src/Services/registration.service';
import { AuthService } from 'src/Services/auth.service';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.css']
})
export class EventDetailsComponent implements OnInit {
  isRegistered: boolean = false;
  loading: boolean = false;
  message: string = '';

  constructor(
    private dialogRef: MatDialogRef<EventDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public event: EventModel,
    private RS: RegistrationService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    if (!this.authService.isAdmin()) {
      this.RS.checkRegistration(this.event.id).subscribe(res => {
        this.isRegistered = res.is_registered;
      });
    }
  }

  register(): void {
    this.loading = true;
    this.RS.register(this.event.id).subscribe({
      next: () => {
        this.loading = false;
        this.isRegistered = true;
        this.message = 'Inscription réussie !';
      },
      error: (err: any) => {
        this.loading = false;
        this.message = err.error?.message || 'Erreur lors de l'inscription.';
      }
    });
  }

  unregister(): void {
    this.loading = true;
    this.RS.unregister(this.event.id).subscribe({
      next: () => {
        this.loading = false;
        this.isRegistered = false;
        this.message = 'Désinscription réussie.';
      },
      error: () => { this.loading = false; }
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}
