import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { Registration } from 'src/Models/Registration';
import { RegistrationService } from 'src/Services/registration.service';
import { ConfirmComponent } from '../confirm/confirm.component';

@Component({
  selector: 'app-my-registrations',
  templateUrl: './my-registrations.component.html',
  styleUrls: ['./my-registrations.component.css']
})
export class MyRegistrationsComponent implements OnInit, AfterViewInit {
  dataSource: MatTableDataSource<Registration> = new MatTableDataSource<Registration>();
  displayedColumns: string[] = ['id', 'event_title', 'start_date', 'place', 'registered_at', 'actions'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private RS: RegistrationService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.fetchRegistrations();
  }

  fetchRegistrations(): void {
    this.RS.GetMyRegistrations().subscribe((data: Registration[]) => {
      this.dataSource.data = data;
    });
  }

  applyFilter(event: any): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  cancelRegistration(eventId: number): void {
    const dialogRef = this.dialog.open(ConfirmComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.RS.unregister(eventId).subscribe(() => this.fetchRegistrations());
      }
    });
  }
}
