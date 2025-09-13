import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
  IonIcon
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { person, mail, call } from 'ionicons/icons';
import { AlertService } from '../../../../utils/alert.service';

@Component({
  selector: 'app-update-profile',
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
    IonIcon
  ],
  templateUrl: './update-profile.component.html',
  styleUrls: ['./update-profile.component.scss']
})
export class UpdateProfileComponent {
  profileForm: FormGroup;
  isLoading = false;

  constructor(
    private formBuilder: FormBuilder,
    private alertService: AlertService
  ) {
    this.profileForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required]
    });
  }

  ngOnInit() {
    addIcons({ person, mail, call });
    this.loadProfile();
  }

  loadProfile() {
    // Simular carga de datos del perfil
    this.profileForm.patchValue({
      name: 'Usuario Ejemplo',
      email: 'usuario@ejemplo.com',
      phone: '+1234567890'
    });
  }

  async updateProfile() {
    if (this.profileForm.valid) {
      this.isLoading = true;
      
      try {
        // Simular llamada al API
        await new Promise(resolve => setTimeout(resolve, 2000));
        this.alertService.showSuccess('Perfil actualizado exitosamente');
      } catch (error) {
        this.alertService.showError('Error al actualizar el perfil');
      } finally {
        this.isLoading = false;
      }
    }
  }
}
