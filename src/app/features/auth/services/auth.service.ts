import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { firstValueFrom } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { MenuController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
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
  private storageInitialized = false;
  private _storage: Storage | null = null;
  
  // Storage key constant
  private readonly USER_STORAGE_KEY = 'currentUser';
  
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
    private menu: MenuController,
    private storage: Storage
  ) {
    // Initialize storage and check for stored user data
    this.initStorage();
    
    this.authService = this.apiService.createCrudService<LoginRequest>({
      endpoint: 'auth/login',
      retryAttempts: 3
    });
    this.userService = this.apiService.createCrudService<RegisterRequest>({
      endpoint: 'user',
      retryAttempts: 3
    });
  }

  /**
   * Inicializa el Ionic Storage
   */
  private async initStorage(): Promise<void> {
    try {
      this._storage = await this.storage.create();
      this.storageInitialized = true;
      console.log('✅ Ionic Storage initialized successfully');
      
      // Check for stored user data after storage is ready
      await this.checkStoredUser();
    } catch (error) {
      console.error('❌ Error initializing Ionic Storage:', error);
    }
  }

  /**
   * Verifica si hay un usuario almacenado en el Ionic Storage
   */
  private async checkStoredUser(): Promise<void> {
    if (!this._storage) {
      console.warn('⚠️ Storage not initialized yet');
      return;
    }

    try {
      const storedUser = await this._storage.get(this.USER_STORAGE_KEY);
      if (storedUser) {
        console.log('📦 User data found in Ionic Storage');
        this.userSubject.next(storedUser);
      } else {
        console.log('📭 No user data in Ionic Storage');
      }
    } catch (error) {
      console.error('❌ Error reading from Ionic Storage:', error);
      // Si hay error leyendo, intentar limpiar
      await this.clearStoredUser();
    }
  }

  /**
   * Almacena los datos del usuario en Ionic Storage
   */
  private async storeUser(user: UserData): Promise<void> {
    if (!this._storage) {
      console.warn('⚠️ Storage not initialized, cannot store user');
      return;
    }

    try {
      await this._storage.set(this.USER_STORAGE_KEY, user);
      console.log('💾 User data stored in Ionic Storage');
    } catch (error) {
      console.error('❌ Error storing user in Ionic Storage:', error);
    }
  }

  /**
   * Elimina los datos del usuario del Ionic Storage
   */
  private async clearStoredUser(): Promise<void> {
    if (!this._storage) {
      console.warn('⚠️ Storage not initialized, cannot clear user');
      return;
    }

    try {
      await this._storage.remove(this.USER_STORAGE_KEY);
      this.hasLoggedExpiredToken = false; // Reset flag when clearing user
      console.log('🗑️ User data cleared from Ionic Storage');
    } catch (error) {
      console.error('❌ Error clearing user from Ionic Storage:', error);
    }
  }

  /**
   * Obtiene los datos del usuario del Ionic Storage
   */
  private async getStoredUser(): Promise<UserData | null> {
    if (!this._storage) {
      console.warn('⚠️ Storage not initialized');
      return null;
    }

    try {
      const storedUser = await this._storage.get(this.USER_STORAGE_KEY);
      return storedUser;
    } catch (error) {
      console.error('❌ Error getting user from Ionic Storage:', error);
      return null;
    }
  }

  private async handleExpiredToken(): Promise<void> {
    // Only log once to prevent infinite logging
    if (!this.hasLoggedExpiredToken) {
      console.log('Token expired - clearing user data');
      this.hasLoggedExpiredToken = true;
    }
    await this.clearStoredUser();
    this.userSubject.next(null);
  }

  // Public method to handle token expiration cleanup
  public async handleTokenExpiration(): Promise<void> {
    await this.handleExpiredToken();
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
      
      console.log('💾 Storing user data in Ionic Storage...');
      this.userSubject.next(userData);
      await this.storeUser(userData);
      
      // Reset flags after successful login
      this.hasLoggedExpiredToken = false;
      this.isCheckingAuth = false;
      
      console.log('✅ User data stored successfully');
      
      // Navegar al dashboard después del login exitoso
      await this.router.navigateByUrl('/dashboard', { replaceUrl: true });
      console.log('🎯 Navigation to dashboard completed');
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
      await this.clearStoredUser();
      this.menu.close();
      this.menu.enable(false);
      await this.router.navigate(['/login']);
    } catch (error: any) {
      console.error('Sign out error:', error);
      // Even if API call fails, clear local data
      this.userSubject.next(null);
      await this.clearStoredUser();
      await this.router.navigate(['/login']);
    }
  }

  /**
   * Verifica si el usuario está autenticado (ahora es async)
   * Usa el BehaviorSubject en memoria y valida con Ionic Storage si es necesario
   */
  async isAuthenticated(): Promise<boolean> {
    console.log('🔍 isAuthenticated called');
 
    // Prevent recursive calls
    if (this.isCheckingAuth) {
      console.log('🔍 Preventing recursive auth check');
      return false;
    }
    
    this.isCheckingAuth = true;
    
    try {
      // Primero verificar si hay usuario en el BehaviorSubject
      const currentUser = this.userSubject.value;
      
      // Si no hay usuario en memoria, intentar cargar desde Ionic Storage
      if (!currentUser) {
        console.log('📭 No user in memory, checking storage...');
        const storedUser = await this.getStoredUser();
        if (!storedUser) {
          console.log('📭 No user found in memory or Ionic Storage');
          return false;
        }
        
        // Cargar usuario en memoria
        console.log('✅ User found in storage, loading to memory');
        this.userSubject.next(storedUser);
        return await this.validateToken(storedUser);
      }
      
      // Validar el token del usuario en memoria
      console.log('✅ User found in memory, validating token');
      return await this.validateToken(currentUser);
      
    } catch (error) {
      console.error('❌ Error in isAuthenticated:', error);
      return false;
    } finally {
      this.isCheckingAuth = false;
    }
  }

  /**
   * Valida el token JWT
   */
  private async validateToken(userData: UserData): Promise<boolean> {
    // Check if token exists
    if (!userData.token) {
      console.log('❌ No token found in user data');
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
        await this.handleExpiredToken();
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
