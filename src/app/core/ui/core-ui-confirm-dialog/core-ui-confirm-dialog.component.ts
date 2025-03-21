import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { ButtonComponent } from "../../../../ui-kit/button/button.component";

@Component({
  selector: 'users-core-ui-confirm-dialog',
  standalone: true,
  templateUrl: './core-ui-confirm-dialog.component.html',
  styleUrls: ['./core-ui-confirm-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatDialogModule, ButtonComponent],
})
export class CoreUiConfirmDialogComponent {
  public data: { dialogText: string } = inject(MAT_DIALOG_DATA);
  public dialogText: string = this.data.dialogText;

  private dialogRef = inject(MatDialogRef<CoreUiConfirmDialogComponent, boolean>);

  public confirm() {
    this.dialogRef.close(true);
  }

  public cancel() {
    this.dialogRef.close(false)
  }
}
