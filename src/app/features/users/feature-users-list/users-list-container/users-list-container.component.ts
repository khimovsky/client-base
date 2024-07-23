import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { UsersListComponent } from "../users-list/users-list.component";
import { UsersService } from '../../data-access/services/users.service';
import { UsersToolbarComponent } from "../../feature-users-create/users-toolbar/users-toolbar.component";
import { AsyncPipe, NgIf } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { combineLatest, catchError, of, map, Observable } from 'rxjs';
import { UsersListVM } from '../users-list/users-list-viewmodel';

@Component({
  selector: 'app-users-list-container',
  standalone: true,
  templateUrl: './users-list-container.component.html',
  styleUrls: ['./users-list-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    UsersListComponent,
    UsersToolbarComponent,
    NgIf,
    AsyncPipe,
    MatProgressBarModule,
  ],
})
export class UsersListContainerComponent implements OnInit, OnDestroy {
  private readonly usersService = inject(UsersService);

  public defaultViewModel: UsersListVM = {
    users: [],
    status: 'error',
    error: null,
  };

  public viewModel$: Observable<UsersListVM> = combineLatest([
    this.usersService.users$.pipe(
      catchError(() => of([] as UsersListVM['users']))
    ),
    this.usersService.status$.pipe(
      catchError(() => of('error' as UsersListVM['status']))
    ),
    this.usersService.error$.pipe(
      catchError(() => of(null as UsersListVM['error']))
    ),
  ]).pipe(
    map(([users, status, error]) => ({
      users,
      status,
      error
    }))
  );

  ngOnInit(): void {
    this.usersService.loadUsers();
  }

  ngOnDestroy(): void {
    this.usersService.cleanup();
  }
}
