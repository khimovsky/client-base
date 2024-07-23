import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { User } from '../models/users-data.models';

@Injectable({
  providedIn: 'root',
})
export class UsersSelectedService {
  private readonly usersSelectedSubject = new BehaviorSubject<User[]>([]);
  public readonly usersSelected$ = this.usersSelectedSubject.asObservable();

  public updateSelectedUsers(users: User[]): void {
    this.usersSelectedSubject.next(users);
  }

  public hasSelectedUsers(): Observable<boolean> {
    return this.usersSelected$.pipe(map(users => (users ? users.length > 0 : false)));
  }
}
