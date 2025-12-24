import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { 
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonIcon,
  IonSpinner,
  IonMenuButton
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  key, 
  eye, 
  eyeOff, 
  shieldCheckmark, 
  lockClosed, 
  checkmarkCircle, 
  informationCircle, 
  alertCircle, 
  bulb 
} from 'ionicons/icons';
import { AlertService } from '../../../../../utils/alert.service';
import { UserService } from '../../../../../utils/user.service';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonTitle,
    IonContent,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonIcon,
    IonSpinner,
    IonMenuButton
  ],
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent {
  passwordForm: FormGroup;
  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;
  isLoading = false;
  securityTips: string[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private userService: UserService,
    private translateService: TranslateService
  ) {
    this.passwordForm = this.formBuilder.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit() {
    addIcons({ 
      key, 
      eye, 
      eyeOff, 
      shieldCheckmark, 
      lockClosed, 
      checkmarkCircle, 
      informationCircle, 
      alertCircle, 
      bulb 
    });
    this.loadSecurityTips();
  }

  private loadSecurityTips() {
    this.securityTips = this.translateService.instant('settings_account_changePassword_tips');
  }

  passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword');
    const confirmPassword = form.get('confirmPassword');
    
    if (newPassword && confirmPassword && newPassword.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    return null;
  }

  async changePassword() {
    if (this.passwordForm.valid) {
      this.isLoading = true;
      
      try {
        const changePasswordData = {
          oldPassword: this.passwordForm.get('currentPassword')?.value,
          newPassword: this.passwordForm.get('newPassword')?.value
        };
        
        this.userService.changePassword(changePasswordData).subscribe({
          next: (response) => {
            if(!response.success){
              this.alertService.showError(response.message || response.errors?.join(', ') || 'Error desconocido');
              return;
            }
            this.alertService.showSuccess(this.translateService.instant('settings_account_changePassword_button') + ' exitosamente');
            this.passwordForm.reset();
          },
          error: (error) => {
            console.error('Error changing password:', error);
            this.alertService.showError('Error al actualizar la contraseña');
          }
        });
      } catch (error) {
        console.error('Error changing password:', error);
        this.alertService.showError('Error al actualizar la contraseña');
      } finally {
        this.isLoading = false;
      }
    }
  }
}
