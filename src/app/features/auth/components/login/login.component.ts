import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, ReactiveFormsModule, RouterModule]
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  showPassword = false;
  isLoading = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private menu: MenuController
  ) {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }
  ionViewWillEnter() {
    this.menu.enable(false); // 🔒 deshabilita el menú al entrar al login
  }

  ionViewDidLeave() {
    this.menu.enable(true); // 🔓 vuelve a habilitarlo al salir
  }
  ngOnInit() {
    // Check if user is already authenticated
    this.authService.getCurrentUser().subscribe(user => {
      if (user) {
        this.router.navigate(['/']);
      }
    });
  }
  async onLogin() {
    if (this.loginForm.valid) {
      console.log('🔄 Starting login process...');
      this.isLoading = true;
      const { username, password } = this.loginForm.value;
      console.log('📧 Email:', username);
   
      try {
        console.log('🚀 Sending login request...');
        // Agregar timeout para prevenir loading infinito
        const loginPromise = this.authService.signInWithEmail(username, password);
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Login timeout - please try again')), 30000)
        );
        
        await Promise.race([loginPromise, timeoutPromise]);
        
        // Si llegamos aquí, el login fue exitoso
        console.log('✅ Login successful');
      } catch (error: any) {
        console.error('❌ Login error:', error);
        console.error('Error details:', {
          message: error.message,
          status: error.status,
          statusText: error.statusText,
          error: error.error
        });
        
        // Si es un timeout, proporcionamos un mensaje más específico
        if (error.message && error.message.includes('timeout')) {
          console.error('⏰ Login timed out - check your internet connection');
        }
        // El error ya se muestra en el AuthService, pero aseguramos que el loading se detenga
      } finally {
        console.log('🏁 Login process finished, setting isLoading to false');
        this.isLoading = false;
      }
    } else {
      console.log('❌ Form is invalid');
      this.markFormGroupTouched();
    }
  }

  async onGoogleLogin() {
    this.isLoading = true;
    try {
      // Agregar timeout para prevenir loading infinito
      const googleLoginPromise = this.authService.signInWithGoogle();
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Google login timeout - please try again')), 30000)
      );
      
      await Promise.race([googleLoginPromise, timeoutPromise]);
      
      console.log('Google login successful');
    } catch (error: any) {
      console.error('Google login error:', error);
      // Si es un timeout, proporcionamos un mensaje más específico
      if (error.message && error.message.includes('timeout')) {
        console.error('Google login timed out - check your internet connection');
      }
    } finally {
      this.isLoading = false;
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  private markFormGroupTouched() {
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });
  }

  get username() {
    return this.loginForm.get('username');
  }

  get password() {
    return this.loginForm.get('password');
  }
} 