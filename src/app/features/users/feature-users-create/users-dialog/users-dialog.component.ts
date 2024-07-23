import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ButtonComponent } from '../../../../../ui-kit/button/button.component';
import { User } from '../../data-access/models/users-data.models';
import { CustomFormFieldComponent } from '../../../../core/ui/custom-form-field/custom-form-field.component';

interface FormField<T>{
  control: T;
  placeholder: string;
  label: string;
  errorMessage: string;
}

@Component({
  selector: 'app-users-dialog',
  standalone: true,
  templateUrl: './users-dialog.component.html',
  styleUrls: ['./users-dialog.component.scss'],
  imports: [
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    ButtonComponent,
    CustomFormFieldComponent,
],
})
export class UsersDialogComponent implements OnInit {
  private readonly dialogRef = inject(MatDialogRef<UsersDialogComponent>);
  private readonly data: { user: User | undefined, isEdit: boolean } = inject(MAT_DIALOG_DATA);

  public readonly userFormGroup = new FormGroup({
    name: new FormControl<string>('', { nonNullable : true, validators: [Validators.required, Validators.minLength(2)] }),
    surname: new FormControl<string>('', { nonNullable : true, validators: [Validators.required, Validators.minLength(2)] }),
    email: new FormControl<string>('', { nonNullable : true, validators: [Validators.required, Validators.email] }),
    phone: new FormControl<string>('', { nonNullable : true, validators: [Validators.pattern(/^(\+7\s?(\d{3})\s?\d{3}[-\s]?\d{2}[-\s]?\d{2})?$/)] }),
  });
  public readonly formFields: FormField<keyof typeof this.userFormGroup.controls>[] = [
    { control: 'name', placeholder: 'Имя', label: 'Имя', errorMessage: 'Минимальное количество символов: 2' },
    { control: 'surname', placeholder: 'Фамилия', label: 'Фамилия', errorMessage: 'Минимальное количество символов: 2' },
    { control: 'email', placeholder: 'E-mail', label: 'E-mail', errorMessage: 'Некорректный адрес' },
    { control: 'phone', placeholder: 'Телефон', label: 'Телефон', errorMessage: 'Некорректный номер телефона' }
  ];
  public readonly isEdit: boolean = this.data.isEdit;

  ngOnInit(): void {
    if (this.data.user) {
      this.userFormGroup.patchValue(this.data.user);
    }
  }

  public cancel(): void {
    this.dialogRef.close(false);
  }

  public save(): void {
    const formData = {
      name: this.userFormGroup.getRawValue().name.trim(),
      surname: this.userFormGroup.getRawValue().surname.trim(),
      email: this.userFormGroup.getRawValue().email.trim(),
      phone: this.userFormGroup.getRawValue().phone.trim(),
    }
    this.dialogRef.close(formData)
  }

  public onFocus(event: FocusEvent) {
    const input = event.target as HTMLInputElement;
    const label = input.nextElementSibling as HTMLElement;
    if (label) {
      label.style.display = 'block';
    }
  }

  public onBlur(event: FocusEvent) {
    const input = event.target as HTMLInputElement;
    const label = input.nextElementSibling as HTMLElement;
    if (label && input.value === '') {
      label.style.display = 'none';
    }
  }

  public trackByControl<T>(index: number, field: FormField<T>): T {
    return field.control;
  }

  public getControl<K extends keyof typeof this.userFormGroup.controls>(key: K): FormControl<string> {
    return this.userFormGroup.controls[key];
  }
}
