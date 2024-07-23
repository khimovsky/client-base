import {
  ChangeDetectionStrategy, Component, DestroyRef, EventEmitter,
  inject, Input, Output, SimpleChanges, ViewChild
} from '@angular/core';
import { NgClass } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { User } from '../../data-access/models/users-data.models';
import { SelectionModel } from '@angular/cdk/collections';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UsersSelectedService } from '../../data-access/services/users-selected.service';

@Component({
  selector: 'app-users-table',
  standalone: true,
  templateUrl: './users-table.component.html',
  styleUrls: ['./users-table.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgClass,
    MatTableModule,
    MatSortModule,
    MatCheckboxModule,
  ]
})
export class UsersTableComponent {
  @Input() public users!: User[] | null;
  @Output() openDialog = new EventEmitter<User>;
  @ViewChild(MatSort) set matSort(sort: MatSort | undefined) {
    if (sort) {
      this.dataSource.sort = sort;
    }
  }

  private readonly destroyRef = inject(DestroyRef);
  private readonly usersSelectedService = inject(UsersSelectedService);

  public readonly selection = new SelectionModel<User>(true, []);
  public readonly dataSource: MatTableDataSource<User> = new MatTableDataSource();
  public readonly displayedColumns: string[] = ['select', 'name', 'surname', 'email', 'phone'];

  ngOnInit(): void {
    this.selection.changed
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(usersSelection => {
        this.usersSelectedService.updateSelectedUsers(usersSelection.source.selected);
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['users']) {
      const newUsers = changes['users'].currentValue;
      if (newUsers !== changes['users'].previousValue) {
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

  public onOpenUserDialog(user: User): void {
    this.openDialog.emit(user);
  }
}
