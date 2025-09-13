import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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
  
  alertButtons = [
    {
      text: 'Cancelar',
      role: 'cancel',
      handler: () => this.cancelDelete()
    },
    {
      text: 'Eliminar',
      role: 'destructive',
      handler: () => this.deleteAccount()
    }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private alertService: AlertService,
    private userService: UserService
  ) {
    this.deleteForm = this.formBuilder.group({
      confirmation: ['', [Validators.required, Validators.pattern(/^ELIMINAR$/)]],
      reason: ['', Validators.required]
    });
  }

  ngOnInit() {
    addIcons({ trash, warning, checkmarkCircle });
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
