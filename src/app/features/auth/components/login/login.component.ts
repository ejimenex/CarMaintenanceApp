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
  authError: string = '';

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
    this.menu.enable(false); // Deshabilita el menú en el login
  }

  ionViewDidLeave() {
    this.menu.enable(true); // Habilita el menú al salir
  }

  ngOnInit() {
    // Verificar si el usuario ya está autenticado
    this.authService.getCurrentUser().subscribe(user => {
      if (user) {
        this.router.navigate(['/dashboard']);
      }
    });
  }

  async onLogin() {
    // Limpiar error anterior
    this.authError = '';

    if (this.loginForm.valid) {
      this.isLoading = true;
      const { username, password } = this.loginForm.value;
   
      try {
        console.log('🔐 LoginComponent: Starting login process...');
        
        // Timeout de 30 segundos para prevenir loading infinito
        const loginPromise = this.authService.signInWithEmail(username, password);
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('timeout')), 30000)
        );
        
        await Promise.race([loginPromise, timeoutPromise]);
        
        // Login exitoso - el AuthService maneja la navegación automáticamente
        console.log('✅ LoginComponent: Login successful, AuthService handled navigation');
        
        // El loading se desactivará automáticamente en el catch o al final
      } catch (error: any) {
        console.error('❌ Error de login:', error);
        
        // Manejar diferentes tipos de errores
        if (error.message && error.message.includes('timeout')) {
          this.authError = 'La solicitud ha tardado demasiado. Verifica tu conexión.';
        } else if (error.status === 401 || error.status === 403) {
          this.authError = 'Email o contraseña incorrectos.';
        } else if (error.status === 0) {
          this.authError = 'No se pudo conectar con el servidor. Verifica tu conexión.';
        } else if (error.message) {
          this.authError = error.message;
        } else {
          this.authError = 'Error al iniciar sesión. Intenta nuevamente.';
        }
        
        this.isLoading = false;
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  async onGoogleLogin() {
    this.authError = '';
    this.isLoading = true;
    
    try {
      // Timeout de 30 segundos
      const googleLoginPromise = this.authService.signInWithGoogle();
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('timeout')), 30000)
      );
      
      await Promise.race([googleLoginPromise, timeoutPromise]);
      
      // Login con Google exitoso - navegar al dashboard
      console.log('✅ Google login exitoso - Redirigiendo al dashboard');
      this.router.navigate(['/dashboard']);
      
    } catch (error: any) {
      console.error('❌ Error de Google login:', error);
      
      if (error.message && error.message.includes('timeout')) {
        this.authError = 'La solicitud ha tardado demasiado. Intenta nuevamente.';
      } else if (error.message && error.message.includes('popup')) {
        this.authError = 'La ventana emergente fue cerrada. Intenta nuevamente.';
      } else {
        this.authError = 'Error al iniciar sesión con Google. Intenta nuevamente.';
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
