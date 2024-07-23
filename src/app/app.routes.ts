import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/users',
    pathMatch: 'full'
  },
  {
    path: 'users',
    loadComponent: () => import('./features/users/feature-users-list/users-list-container/users-list-container.component')
      .then((c) => c.UsersListContainerComponent)
  },
  {
    path: '**',
    loadComponent: () => import('./features/users/feature-users-list/users-list-container/users-list-container.component')
      .then((c) => c.UsersListContainerComponent)
  }
];
