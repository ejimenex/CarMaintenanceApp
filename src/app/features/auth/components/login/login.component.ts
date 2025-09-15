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
      this.isLoading = true;
      const { username, password } = this.loginForm.value;
   
      try {
        await this.authService.signInWithEmail(username, password);
      } catch (error) {
        console.error('Login error:', error);
      } finally {
        this.isLoading = false;
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  async onGoogleLogin() {
    this.isLoading = true;
    try {
      await this.authService.signInWithGoogle();
    } catch (error) {
      console.error('Google login error:', error);
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