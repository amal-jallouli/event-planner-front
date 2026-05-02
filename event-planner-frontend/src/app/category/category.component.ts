import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Category } from 'src/Models/Category';
import { CategoryService } from 'src/Services/category.service';
import { CategoryFormComponent } from '../category-form/category-form.component';
import { ConfirmComponent } from '../confirm/confirm.component';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit, AfterViewInit {
  dataSource: MatTableDataSource<Category> = new MatTableDataSource<Category>();
  displayedColumns: string[] = ['id', 'name', 'events_count', 'actions'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private CS: CategoryService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.fetchCategories();
  }

  fetchCategories(): void {
    this.CS.GetAllCategories().subscribe((data: Category[]) => {
      this.dataSource.data = data;
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
    const dialogRef = this.dialog.open(CategoryFormComponent, { width: '450px', data: null });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.CS.addCategory({ name: result.name }).subscribe(() => this.fetchCategories());
      }
    });
  }

  openEdit(cat: Category): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '450px';
    dialogConfig.data = cat;
    const dialogRef = this.dialog.open(CategoryFormComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.CS.updateCategory(cat.id, { name: result.name }).subscribe(() => this.fetchCategories());
      }
    });
  }

  delete(id: number): void {
    const dialogRef = this.dialog.open(ConfirmComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.CS.deleteCategory(id).subscribe(() => this.fetchCategories());
      }
    });
  }
}
