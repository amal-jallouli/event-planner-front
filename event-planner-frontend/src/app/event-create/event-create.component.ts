import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EventService } from 'src/Services/event.service';
import { Category } from 'src/Models/Category';

@Component({
  selector: 'app-event-create',
  templateUrl: './event-create.component.html',
  styleUrls: ['./event-create.component.css']
})
export class EventCreateComponent implements OnInit {
  form!: FormGroup;
  categories: Category[] = [];
  isEdit: boolean = false;
  loading: boolean = false;
  selectedFile: File | null = null;

  constructor(
    private ES: EventService,
    private dialogRef: MatDialogRef<EventCreateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.categories = this.data?.categories || [];
    this.isEdit = !!this.data?.event;

    const evt = this.data?.event;
    this.form = new FormGroup({
      title: new FormControl(evt?.title || null, [Validators.required]),
      description: new FormControl(evt?.description || null, [Validators.required]),
      start_date: new FormControl(evt?.start_date ? new Date(evt.start_date) : null, [Validators.required]),
      end_date: new FormControl(evt?.end_date ? new Date(evt.end_date) : null, [Validators.required]),
      place: new FormControl(evt?.place || null, [Validators.required]),
      capacity: new FormControl(evt?.capacity || null, [Validators.required, Validators.min(1)]),
      category_id: new FormControl(evt?.category_id || null, [Validators.required]),
      status: new FormControl(evt?.status || 'actif', [Validators.required]),
      is_free: new FormControl(evt?.is_free ?? false),
      price: new FormControl(evt?.price || 0)
    });

    this.form.get('is_free')?.valueChanges.subscribe((isFree: boolean) => {
      if (isFree) {
        this.form.get('price')?.setValue(0);
        this.form.get('price')?.disable();
      } else {
        this.form.get('price')?.enable();
      }
    });
  }

  onFileChange(event: any): void {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }
  }

  buildFormData(): FormData {
    const fd = new FormData();
    const val = this.form.getRawValue();
    fd.append('title', val.title);
    fd.append('description', val.description);
    fd.append('start_date', val.start_date instanceof Date ? val.start_date.toISOString().split('T')[0] : val.start_date);
    fd.append('end_date', val.end_date instanceof Date ? val.end_date.toISOString().split('T')[0] : val.end_date);
    fd.append('place', val.place);
    fd.append('capacity', val.capacity);
    fd.append('category_id', val.category_id);
    fd.append('status', val.status);
    fd.append('is_free', val.is_free ? '1' : '0');
    fd.append('price', val.price || '0');
    if (this.selectedFile) {
      fd.append('image', this.selectedFile);
    }
    return fd;
  }

  save(): void {
    if (this.form.invalid) return;
    this.loading = true;
    const fd = this.buildFormData();

    if (this.isEdit) {
      this.ES.updateEvent(this.data.event.id, fd).subscribe({
        next: () => { this.loading = false; this.dialogRef.close(true); },
        error: () => { this.loading = false; }
      });
    } else {
      this.ES.addEvent(fd).subscribe({
        next: () => { this.loading = false; this.dialogRef.close(true); },
        error: () => { this.loading = false; }
      });
    }
  }

  close(): void {
    this.dialogRef.close(false);
  }
}
