import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { 
  IonHeader, 
  IonToolbar, 
  IonButtons, 
  IonBackButton, 
  IonTitle, 
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonAlert,
  IonIcon
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { trash, warning, checkmarkCircle } from 'ionicons/icons';
import { AlertService } from '../../../../../utils/alert.service';
import { UserService } from '../../../../../utils/user.service';

@Component({
  selector: 'app-delete-account',
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
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonAlert,
    IonIcon
  ],
  templateUrl: './delete-account.component.html',
  styleUrls: ['./delete-account.component.scss']
})
export class DeleteAccountComponent {
  deleteForm: FormGroup;
  showConfirmation = false;
  isLoading = false;
  consequences: string[] = [];
  alertButtons: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private alertService: AlertService,
    private userService: UserService,
    private translateService: TranslateService
  ) {
    this.deleteForm = this.formBuilder.group({
      confirmation: ['', [Validators.required, Validators.pattern(/^ELIMINAR$/)]],
      reason: ['', Validators.required]
    });
  }

  ngOnInit() {
    addIcons({ trash, warning, checkmarkCircle });
    this.loadConsequences();
    this.setupAlertButtons();
  }

  private loadConsequences() {
    this.consequences = this.translateService.instant('settings_account_deleteAccount_consequences');
  }

  private setupAlertButtons() {
    this.alertButtons = [
      {
        text: this.translateService.instant('common_cancel'),
        role: 'cancel',
        handler: () => this.cancelDelete()
      },
      {
        text: this.translateService.instant('settings_account_deleteAccount_button'),
        role: 'destructive',
        handler: () => this.deleteAccount()
      }
    ];
  }

  async confirmDelete() {
    if (this.deleteForm.valid) {
      this.showConfirmation = true;
    } else {
      this.alertService.showError('Por favor completa todos los campos correctamente');
    }
  }

  async deleteAccount() {
    this.isLoading = true;
    
    try {
      const deleteData = {
        reason: this.deleteForm.get('reason')?.value
      };
      
      this.userService.deleteUser(deleteData).subscribe({
        next: (response) => {
          this.alertService.showSuccess('Cuenta eliminada exitosamente');
          
          // Limpiar datos locales
          localStorage.clear();
          sessionStorage.clear();
          
          // Redirigir al login
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 1500);
        },
        error: (error) => {
          console.error('Error deleting account:', error);
          this.alertService.showError('Error al eliminar la cuenta. Inténtalo de nuevo.');
        }
      });
      
    } catch (error) {
      console.error('Error deleting account:', error);
      this.alertService.showError('Error al eliminar la cuenta. Inténtalo de nuevo.');
    } finally {
      this.isLoading = false;
      this.showConfirmation = false;
    }
  }

  cancelDelete() {
    this.showConfirmation = false;
  }
}
