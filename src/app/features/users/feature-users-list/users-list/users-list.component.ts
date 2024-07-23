import { Component, ChangeDetectionStrategy, inject, Input } from '@angular/core';
import { NgIf } from '@angular/common';
import { User } from '../../data-access/models/users-data.models';
import { UsersListVM } from './users-list-viewmodel';
import { UsersService } from '../../data-access/services/users.service';
import { first } from 'rxjs';
import { UsersDialogComponent } from '../../feature-users-create/users-dialog/users-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { DangerComponent } from '../../../../../ui-kit/danger/danger.component';
import { UsersTableComponent } from "../users-table/users-table.component";

@Component({
  selector: 'app-users-list',
  standalone: true,
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgIf,
    MatProgressBarModule,
    DangerComponent,
    UsersTableComponent
  ],
})
export class UsersListComponent {
  @Input({ required: true }) public vm!: UsersListVM;

  private readonly dialog = inject(MatDialog);
  private readonly usersService = inject(UsersService);

  public openUserDialog(user: User): void {
    const dialogRef = this.dialog.open(UsersDialogComponent, { data: { user, isEdit: !!user } });
    dialogRef.afterClosed().pipe(first())
      .subscribe(userForm => {
        if (user && userForm) {
          this.updateUser({ ...user, ...userForm });
        }
      });
  }

  private updateUser(user: User): void {
    this.usersService.updateUser(user);
  }
}
