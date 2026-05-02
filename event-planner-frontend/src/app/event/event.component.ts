import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { EventModel } from 'src/Models/EventModel';
import { Category } from 'src/Models/Category';
import { EventService } from 'src/Services/event.service';
import { CategoryService } from 'src/Services/category.service';
import { AuthService } from 'src/Services/auth.service';
import { EventCreateComponent } from '../event-create/event-create.component';
import { EventDetailsComponent } from '../event-details/event-details.component';
import { ConfirmComponent } from '../confirm/confirm.component';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent implements OnInit, AfterViewInit {
  dataSource: MatTableDataSource<EventModel> = new MatTableDataSource<EventModel>();
  displayedColumns: string[] = ['id', 'title', 'category', 'start_date', 'place', 'capacity', 'status', 'actions'];
  categories: Category[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private ES: EventService,
    private CS: CategoryService,
    public authService: AuthService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.fetchEvents();
    this.CS.GetAllCategories().subscribe(cats => {
      this.categories = cats;
    });
  }

  fetchEvents(): void {
    this.ES.GetAllEvents().subscribe((response: any) => {
      this.dataSource.data = response.data || response;
    });
  }

  applyFilter(event: any): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  open(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '650px';
    dialogConfig.data = { categories: this.categories };
    const dialogRef = this.dialog.open(EventCreateComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if (result) this.fetchEvents();
    });
  }

  openEdit(evt: EventModel): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '650px';
    dialogConfig.data = { event: evt, categories: this.categories };
    const dialogRef = this.dialog.open(EventCreateComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if (result) this.fetchEvents();
    });
  }

  openView(id: number): void {
    this.ES.getEventById(id).subscribe(evt => {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.width = '700px';
      dialogConfig.data = evt;
      this.dialog.open(EventDetailsComponent, dialogConfig);
    });
  }

  delete(id: number): void {
    const dialogRef = this.dialog.open(ConfirmComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.ES.deleteEvent(id).subscribe(() => this.fetchEvents());
      }
    });
  }
}
