import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
  },
  {
    path: 'game',
    loadComponent: () => import('./pages/game/game.component').then(m => m.GameComponent),
  },
  {
    path: 'results',
    loadComponent: () => import('./pages/results/results.component').then(m => m.ResultsComponent),
  },
  { path: '**', redirectTo: '' },
];
