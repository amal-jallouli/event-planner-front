import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Category } from 'src/Models/Category';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.css']
})
export class CategoryFormComponent implements OnInit {
  form!: FormGroup;
  isEdit: boolean = false;

  constructor(
    private dialogRef: MatDialogRef<CategoryFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Category | null
  ) {}

  ngOnInit(): void {
    this.isEdit = !!this.data;
    this.form = new FormGroup({
      name: new FormControl(this.data?.name || null, [Validators.required, Validators.minLength(2)])
    });
  }

  save(): void {
    if (this.form.invalid) return;
    this.dialogRef.close(this.form.value);
  }

  close(): void {
    this.dialogRef.close(null);
  }
}
