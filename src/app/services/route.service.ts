import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class RouteService {
  private previousRoute: string = '';

  constructor(private router: Router) {}

  saveRoute(url: string): void {
    this.previousRoute = url;
  }

  getSavedRoute(): string {
    return this.previousRoute;
  }

  routeUser(): void {
    if (this.previousRoute !== '') {
      this.router.navigate([this.previousRoute]);
      this.previousRoute = '';
    } 
    else this.router.navigate(['']);
  }
}
