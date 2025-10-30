import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { firstValueFrom } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { MenuController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { ApiService, CrudService } from 'src/app/utils/api.service';
import { AlertService } from 'src/app/utils/alert.service';

export interface AuthUser {
  id: string;
  username: string;
  name: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  userEmail: string;
  password: string;
  name: string;
}

export interface UserData {
  token: string;
  user?: AuthUser;
  expirationDate?: string; // ISO string format
}

interface JWTPayload {
  exp: number; // Expiration timestamp
  iat: number; // Issued at timestamp
  sub?: string; // Subject (user ID)
  [key: string]: any; // Other JWT claims
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject = new BehaviorSubject<UserData | null>(null);
  user$: Observable<UserData | null> = this.userSubject.asObservable();
  private hasLoggedExpiredToken = false; // Flag to prevent infinite logging
  private isCheckingAuth = false; // Flag to prevent recursive calls
  
  // TODO: Replace with your actual API base URL
  private apiUrl = environment.apiUrl;
  private authService: CrudService<LoginRequest>
  private userService: CrudService<RegisterRequest>

  constructor(
    private apiService: ApiService,
    private http: HttpClient,
    private router: Router,
    private alertController: AlertController,
    private alertService: AlertService, 
    private loadingController: LoadingController,
    private menu: MenuController
   
  ) {
    // Check for stored user data on app start
    this.checkStoredUser();
    this.authService = this.apiService.createCrudService<LoginRequest>({
      endpoint: 'auth/login',
      retryAttempts: 3
    });
    this.userService = this.apiService.createCrudService<RegisterRequest>({
      endpoint: 'user',
      retryAttempts: 3
    });
  }

  private checkStoredUser(): void {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        this.userSubject.next(user);
      } catch (error) {
        localStorage.removeItem('currentUser');
      }
    }
  }

  private storeUser(user: UserData): void {
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  private clearStoredUser(): void {
    localStorage.removeItem('currentUser');
    this.hasLoggedExpiredToken = false; // Reset flag when clearing user
  }

  private handleExpiredToken(): void {
    // Only log once to prevent infinite logging
    if (!this.hasLoggedExpiredToken) {
      console.log('Token expired - clearing user data');
      this.hasLoggedExpiredToken = true;
    }
    this.clearStoredUser();
    this.userSubject.next(null);
  }

  // Public method to handle token expiration cleanup
  public handleTokenExpiration(): void {
    this.handleExpiredToken();
  }

  getCurrentUser(): Observable<UserData | null> {
    return this.user$;
  }

  async signInWithEmail(email: string, password: string): Promise<void> {
    console.log('🔑 AuthService: signInWithEmail called');
    console.log('🌐 API URL:', this.apiUrl);
    console.log('📡 Login endpoint:', 'auth/login');
    
    try {
      console.log('📤 Sending login request to API...');
      // TODO: Replace with actual API call
      const data = await firstValueFrom(
        this.authService.createWithoutAuth({ username: email, password : password })
      );
      
      console.log('📥 API Response received:', data);
      
      if(!data.success){
        console.log('❌ Login failed - API returned success: false');
        await this.showErrorAlert('Sign In Error', data.message || 'Failed to sign in');
        return;
      }
   
      console.log('✅ Login successful, processing user data...');
      // Use actual API response
      const userData: UserData = {
        token: data.data as any
      };
      
      console.log('💾 Storing user data and navigating...');
      this.userSubject.next(userData);
      this.storeUser(userData);
      
      // Reset flags after successful login
      this.hasLoggedExpiredToken = false;
      this.isCheckingAuth = false;
      
      console.log('🔍 Token stored, checking if valid...');
      // Test the token immediately after storing
      const testAuth = this.isAuthenticated();
      console.log('🔍 Token validation result:', testAuth);
      
      // Usar navigateByUrl para una navegación más robusta
      await this.router.navigateByUrl('/vehicles/list', { replaceUrl: true });
      console.log('🎯 Navigation completed');
    } catch (error: any) {
      console.error('💥 AuthService error:', error);
      await this.showErrorAlert('Sign In Error', error.message || 'Failed to sign in');
      throw error; // Re-throw para que el componente pueda manejar el error
    }
  }

  async signInWithGoogle(): Promise<void> {
   
  }

  async signUp(username: string, password: string, name: string): Promise<void> {
    const loading = await this.loadingController.create({
      message: 'Creating account...'
    });
    await loading.present();

    try {
      // TODO: Replace with actual API call
   
      const response = await firstValueFrom(
        this.userService.createWithoutAuth({
          userEmail:username,
          password:password,
          name:name
        })
     
      );
      if(!response.success){
        await this.alertService.showError(response.message || response.errors?.join(', ') || 'Failed to sign up' );
        return;
      }
   
      // this.userSubject.next(mockUser);
      // this.storeUser(mockUser);
      await this.router.navigate(['/login']);
    } catch (error: any) {
      await this.showErrorAlert('Sign Up Error', error.message || 'Failed to create account');
    } finally {
      await loading.dismiss();
    }
  }

  async resetPassword(email: string): Promise<void> {
    const loading = await this.loadingController.create({
      message: 'Sending reset email...'
    });
    await loading.present();

    try {
      // TODO: Replace with actual API call
      // await this.http.post(`${this.apiUrl}/reset-password`, { email }).toPromise();
      
      // Temporary mock password reset
      await this.showSuccessAlert('Password Reset', 'Password reset email sent to ' + email);
    } catch (error: any) {
      await this.showErrorAlert('Password Reset Error', error.message || 'Failed to send reset email');
    } finally {
      await loading.dismiss();
    }
  }

  async signOut(): Promise<void> {
    try {
      this.userSubject.next(null);
      this.clearStoredUser();
      this.menu.close();
      this.menu.enable(false);
      await this.router.navigate(['/login']);
    } catch (error: any) {
      console.error('Sign out error:', error);
      // Even if API call fails, clear local data
      this.userSubject.next(null);
      this.clearStoredUser();
      await this.router.navigate(['/login']);
    }
  }

    isAuthenticated(): boolean {
      const url = this.router.url; // ejemplo: "/user-preference"
      const parts = url.split('/'); 
      let lastSegment = parts[parts.length - 1]; // "user-preference"
      console.log('🔍 isAuthenticated called - URL:', url, 'Last segment:', lastSegment);
      
      // Don't validate token on login/register pages
      if(lastSegment === 'login' || lastSegment === 'register'){
        console.log('🔍 Skipping auth check on login/register page');
        return false;
      }
   
      // Prevent recursive calls
      if (this.isCheckingAuth) {
        console.log('🔍 Preventing recursive auth check');
        return false;
      }
      
      this.isCheckingAuth = true;
      
      try {
        // Check localStorage for token
        const storedUser = localStorage.getItem('currentUser');
        if (!storedUser) {
          return false;
        }
        
        const userData: UserData = JSON.parse(storedUser);
        
        // Check if token exists
        if (!userData.token) {
          return false;
        }
        
        // Decode JWT token to get expiration
        try {
          console.log('🔍 Decoding token:', userData.token.substring(0, 50) + '...');
          const decodedToken = jwtDecode<JWTPayload>(userData.token);
          console.log('🔍 Decoded token payload:', decodedToken);
          
          const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
          console.log('🔍 Current time:', currentTime, 'Token exp:', decodedToken.exp);
          
          // Check if token is expired
          if (decodedToken.exp && decodedToken.exp < currentTime) {
            // Only log once to prevent infinite logging
            if (!this.hasLoggedExpiredToken) {
              console.log('❌ Token expired. Exp:', new Date(decodedToken.exp * 1000), 'Current:', new Date());
              this.hasLoggedExpiredToken = true;
            }
            return false;
          }
          
          // Reset flag when token is valid
          this.hasLoggedExpiredToken = false;
          console.log('✅ Token valid. Expires:', new Date(decodedToken.exp * 1000));
          return true;
        } catch (jwtError) {
          console.error('❌ Invalid JWT token:', jwtError);
          return false;
        }
      } catch (error) {
        // If parsing fails, return false
        console.error('Error parsing stored user data:', error);
        return false;
      } finally {
        this.isCheckingAuth = false;
      }
   }

  private async showErrorAlert(header: string, message: string): Promise<void> {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  private async showSuccessAlert(header: string, message: string): Promise<void> {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }
} 