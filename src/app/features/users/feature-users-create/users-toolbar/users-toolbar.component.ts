import { UsersSelectedService } from './../../data-access/services/users-selected.service';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { IconComponent } from '../../../../../ui-kit/icon/icon.component';
import { UsersService } from '../../data-access/services/users.service';
import { UsersDialogComponent } from '../users-dialog/users-dialog.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { User } from '../../data-access/models/users-data.models';
import { first, switchMap, tap } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { CoreUiConfirmDialogComponent } from '../../../../core/ui/core-ui-confirm-dialog/core-ui-confirm-dialog.component';

@Component({
  selector: 'app-users-toolbar',
  standalone: true,
  templateUrl: './users-toolbar.component.html',
  styleUrls: ['./users-toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AsyncPipe,
    IconComponent,
  ],
})
export class UsersToolbarComponent {
  private readonly dialog = inject(MatDialog);
  private readonly usersService = inject(UsersService);
  private readonly usersSelectedService = inject(UsersSelectedService);

  public readonly hasUsersSelected$ = this.usersSelectedService.hasSelectedUsers();

  public openUserDialog(): void {
    const dialogRef: MatDialogRef<UsersDialogComponent> = this.dialog.open(UsersDialogComponent, {
      data: { isEdit: false }
    });
    dialogRef.afterClosed().pipe(first())
      .subscribe((result: User) => {
        if (result) {
          this.addUser({
            name: result.name,
            surname: result.surname,
            email: result.email,
            phone: result.phone,
          })
        }
      });
  }

  private addUser(user: User): void {
    this.usersService.addUser(user);
  }

  public onUsersDelete(): void {
    this.usersSelectedService.usersSelected$
    .pipe(
      first(),
      switchMap(users => {
        const dialogRef: MatDialogRef<CoreUiConfirmDialogComponent> = this.dialog.open(CoreUiConfirmDialogComponent, {
          data: { dialogText: `Удалить выбранные строки (${users.length})?` },
        });
        return dialogRef.afterClosed().pipe(
          first(),
          tap(result => {
            if (result) {
              this.usersService.deleteUsers(users);
              this.usersSelectedService.updateSelectedUsers([]);
            }
          })
        );
      })
    ).subscribe();
  }
}
