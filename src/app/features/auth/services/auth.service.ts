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
  }

  getCurrentUser(): Observable<UserData | null> {
    return this.user$;
  }

  async signInWithEmail(email: string, password: string): Promise<void> {
    
    const loading = await this.loadingController.create({
      message: 'Signing in...'
    });
    await loading.present();

    try {
      // TODO: Replace with actual API call
      const data = await firstValueFrom(
        this.authService.create({ username: email, password : password })
      );
      if(!data.success){
        await this.showErrorAlert('Sign In Error', data.message || 'Failed to sign in');
        return;
      }
   
             // Use actual API response
       const userData: UserData = {
         token: data.data as any
       };
      
      this.userSubject.next(userData);
      this.storeUser(userData);
      await this.router.navigate(['/user-preference']);
    } catch (error: any) {
  
      await this.showErrorAlert('Sign In Error', error.message || 'Failed to sign in');
    } finally {
      await loading.dismiss();
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
        this.userService.create({
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
       // Check localStorage for token
       const storedUser = localStorage.getItem('currentUser');
       if (!storedUser) {
         return false;
       }
       
       try {
         const userData: UserData = JSON.parse(storedUser);
         
         // Check if token exists
         if (!userData.token) {
           this.clearStoredUser();
           return false;
         }
         
         // Decode JWT token to get expiration
         try {
           const decodedToken = jwtDecode<JWTPayload>(userData.token);
           const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
           
           // Check if token is expired
           if (decodedToken.exp && decodedToken.exp < currentTime) {
             console.log('Token expired. Exp:', new Date(decodedToken.exp * 1000), 'Current:', new Date());
             this.clearStoredUser();
             this.userSubject.next(null);
             return false;
           }
           
           console.log('Token valid. Expires:', new Date(decodedToken.exp * 1000));
         } catch (jwtError) {
           console.error('Invalid JWT token:', jwtError);
           this.clearStoredUser();
           return false;
         }
         
         // Token is valid, update the user subject
         this.userSubject.next(userData);
         return true;
       } catch (error) {
         // If parsing fails, clear invalid data
         console.error('Error parsing stored user data:', error);
         this.clearStoredUser();
         return false;
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