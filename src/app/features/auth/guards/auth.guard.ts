import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, map, take } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean {
    const isAuthenticated= this.authService.isAuthenticated();
    if(!isAuthenticated){
      this.router.navigate(['/login']);
      return false;
    }
    return true;
    // return this.authService.isAuthenticated().pipe(
    //   take(1),
    //   map(authenticated => {
    //     if (!authenticated) {
    //       this.router.navigate(['/login']);
    //       return false;
    //     }
    //     return true;
    //   })
    // );
  }
} 