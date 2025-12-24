import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  async canActivate(): Promise<boolean> {
    console.log('🛡️ AuthGuard: Checking authentication...');
    const isAuthenticated = await this.authService.isAuthenticated();
    
    console.log('🛡️ AuthGuard: Authentication result:', isAuthenticated);
    
    if(!isAuthenticated){
      console.log('🛡️ AuthGuard: User not authenticated, redirecting to login');
      await this.authService.handleTokenExpiration();
      this.router.navigate(['/login']);
      return false;
    }
    
    console.log('🛡️ AuthGuard: User authenticated, allowing access');
    return true;
  }
}
