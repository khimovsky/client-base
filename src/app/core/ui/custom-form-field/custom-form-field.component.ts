import { NgClass, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-custom-form-field',
  standalone: true,
  templateUrl: './custom-form-field.component.html',
  styleUrls: ['./custom-form-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    NgClass,
    NgIf
  ]
})
export class CustomFormFieldComponent {
  @Input() control!: FormControl;
  @Input() placeholder!: string;
  @Input() label!: string;
  @Input() errorMessage!: string;

  @Output() focus = new EventEmitter<FocusEvent>();
  @Output() blur = new EventEmitter<FocusEvent>();

  onFocus(event: FocusEvent): void {
    this.focus.emit(event);
  }

  onBlur(event: FocusEvent): void {
    this.blur.emit(event);
  }
}
