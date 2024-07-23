import {
  Component, OnChanges, OnInit,
  ChangeDetectionStrategy, SimpleChanges,
  inject, DestroyRef, Input, ViewChild,
} from '@angular/core';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { SelectionModel } from '@angular/cdk/collections';
import { User } from '../../data-access/models/users-data.models';
import { UsersListVM } from './users-list-viewmodel';
import { UsersSelectedService } from '../../data-access/services/users-selected.service';
import { UsersService } from '../../data-access/services/users.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { first } from 'rxjs';
import { UsersDialogComponent } from '../../feature-users-create/users-dialog/users-dialog.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { DangerComponent } from '../../../../../ui-kit/danger/danger.component';

@Component({
  selector: 'app-users-list',
  standalone: true,
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgIf,
    NgFor,
    NgClass,
    MatProgressBarModule,
    MatTableModule,
    MatSortModule,
    MatCheckboxModule,
    DangerComponent,
  ],
})
export class UsersListComponent implements OnInit, OnChanges {
  @Input({ required: true }) public vm!: UsersListVM;
  @ViewChild(MatSort) set matSort(sort: MatSort | undefined) {
    if (sort) {
      this.dataSource.sort = sort;
    }
  }

  private readonly dialog = inject(MatDialog);
  private readonly destroyRef = inject(DestroyRef);
  private readonly usersService = inject(UsersService);
  private readonly usersSelectedService = inject(UsersSelectedService);

  public readonly dataSource = new MatTableDataSource<User>([]);
  public readonly selection = new SelectionModel<User>(true, []);
  public readonly displayedColumns: string[] = ['select', 'name', 'surname', 'email', 'phone'];

  ngOnInit(): void {
    this.selection.changed
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(usersSelection => {
        this.usersSelectedService.updateSelectedUsers(usersSelection.source.selected);
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['vm'] && this.vm) {
      const newUsers = changes['vm'].currentValue.users;
      if (newUsers !== changes['vm'].previousValue?.users) {
        this.dataSource.data = newUsers;
        this.selection.clear();
      }
    }
  }

  public isAllSelected(): boolean {
    return this.selection.selected.length === this.dataSource.data.length;
  }

  public toggleAllRows(): void {
    if (this.isAllSelected()) {
      this.selection.clear();
    } else {
      this.selection.select(...this.dataSource.data);
    }
  }

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
