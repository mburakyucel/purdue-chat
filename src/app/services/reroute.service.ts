import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RerouteService {
  private cachedRoute: string = '';

  constructor(
    private router: Router
  ) {}

  cacheRoute(url: string): void {
    this.cachedRoute = url;
  }

  getCachedRoute(): string {
    return this.cachedRoute;
  }

  clearCachedRoute(): void {
    this.cachedRoute = '';
  }
}
