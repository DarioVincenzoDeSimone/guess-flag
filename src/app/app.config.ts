import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';
import { routes } from './app.routes';

// HashLocationStrategy: all routes work on GitHub Pages without server rewrites.
export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(routes, withHashLocation()),
  ]
};
