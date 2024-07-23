import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, of, Subject, takeUntil, tap } from 'rxjs';
import { User, UsersError, UsersResponse } from '../models/users-data.models';
import { LoadingStatus } from '../../../../core/models/loading-status.model';
import { ApiService } from '../../../../core/http/api.service';
import { LocalStorageCacheService } from '../../../../core/services/cache.service';
import { CacheConfigService } from '../../../../core/services/cache-config.service';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private readonly apiService = inject(ApiService);
  private readonly cacheService = inject(LocalStorageCacheService);
  private readonly configService = inject(CacheConfigService);

  private readonly usersSubject = new BehaviorSubject<User[]>([]);
  private readonly statusSubject = new BehaviorSubject<LoadingStatus>('init');
  private readonly errorSubject = new BehaviorSubject<UsersError | null>(null);
  private readonly destroy$ = new Subject<void>();

  public readonly users$ = this.usersSubject.asObservable();
  public readonly status$ = this.statusSubject.asObservable();
  public readonly error$ = this.errorSubject.asObservable();

  private readonly CACHE_KEY = this.configService.cacheKey;

  public loadUsers(): void {
    // Check if the users are currently being loaded or have already been loaded
    if (this.statusSubject.value === 'loading' || this.statusSubject.value === 'loaded') {
      return; // Exit the function if users are loading or already loaded
    }
    // Attempt to retrieve cached users and cache timestamp from cache service
    const cachedUsers = this.cacheService.getItem<User[]>(this.CACHE_KEY);
    const cacheTime = localStorage.getItem(`${this.CACHE_KEY}_time`);
    // Check if cached users exist and if the cache is still valid
    if (cachedUsers && this.cacheService.isCacheValid(cacheTime)) {
      // If valid cached users are found, update users and status subjects
      this.usersSubject.next(cachedUsers);
      this.statusSubject.next('loaded');
    } else {
      // If no valid cache, set the status to loading and fetch users from the API
      this.statusSubject.next('loading');
      this.apiService.get<UsersResponse>('/task1')
        .pipe(
          map((response) => response.users), // Extract users from the API response
          tap((users) => {
            // If users are retrieved, cache them
            if (users.length > 0) {
                this.cacheService.setItem(this.CACHE_KEY, users);
            } else {
                // If no users are retrieved, clear the cache
                this.cacheService.clearCache(this.CACHE_KEY);
            }
          }),
          catchError((error) => {
            // Handle any errors during the API call
            this.errorSubject.next({ status: error.status, ...error });
            this.statusSubject.next('error');
            return of([]); // Return an empty array to continue the stream
          }),
          takeUntil(this.destroy$) // Complete the observable when the component is destroyed
        )
        .subscribe({
          next: (users) => {
            // Update users and status subjects if no error occurred
            if (this.statusSubject.value !== 'error') {
                this.usersSubject.next(users);
                this.statusSubject.next('loaded');
            }
          },
          error: (error) => {
            // Log error if needed (optional)
          }
        });
    }
  }

  public addUser(user: User): void {
    const currentUsers = this.usersSubject.getValue();
    const updatedUsers = [...currentUsers, user];
    this.updateUsers(updatedUsers);
  }

  public updateUser(updatedUser: User): void {
    const currentUsers = this.usersSubject.getValue();
    const userIndex = currentUsers.findIndex(user => user.email === updatedUser.email);
    if (userIndex !== -1) {
      const updatedUsers = [...currentUsers];
      updatedUsers[userIndex] = updatedUser;
      this.updateUsers(updatedUsers);
    }
  }

  public deleteUsers(usersSelected: User[]): void {
    const currentUsers = this.usersSubject.getValue();
    const updatedUsers = currentUsers.filter(user =>
      !usersSelected.some(selected => selected.email === user.email)
    );
    this.updateUsers(updatedUsers);
  }

  private updateUsers(users: User[]): void {
    if (users.length > 0) {
      this.cacheService.setItem(this.CACHE_KEY, users);
    } else {
      this.cacheService.clearCache(this.CACHE_KEY);
    }
    this.usersSubject.next(users);
  }

  public cleanup(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

