import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  IonButton,
  IonIcon,
  IonList,
  IonItem,
  IonLabel
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { phonePortrait, warning, logOut } from 'ionicons/icons';
import { AlertService } from '../../../../utils/alert.service';
import { AuthService } from '../../../../features/auth/services/auth.service';

@Component({
  selector: 'app-logout-all-devices',
  standalone: true,
  imports: [
    CommonModule,
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
    IonButton,
    IonIcon,
    IonList,
    IonItem,
    IonLabel
  ],
  templateUrl: './logout-all-devices.component.html',
  styleUrls: ['./logout-all-devices.component.scss']
})
export class LogoutAllDevicesComponent {
  
  activeDevices = [
    {
      id: 1,
      name: 'iPhone 12',
      location: 'Madrid, España',
      lastActive: 'Hace 2 horas',
      current: true
    },
    {
      id: 2,
      name: 'iPad Pro',
      location: 'Barcelona, España',
      lastActive: 'Hace 1 día',
      current: false
    },
    {
      id: 3,
      name: 'MacBook Pro',
      location: 'Valencia, España',
      lastActive: 'Hace 3 días',
      current: false
    }
  ];
  
  isLoading = false;

  constructor(
    private router: Router,
    private alertService: AlertService,
    private authService: AuthService
  ) {
    addIcons({ phonePortrait, warning, logOut });
  }

  async logoutAllDevices() {
    this.isLoading = true;
    
    try {
      // Simular llamada al API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      this.alertService.showSuccess('Sesión cerrada en todos los dispositivos');
      this.router.navigate(['/login']);
    } catch (error) {
      this.alertService.showError('Error al cerrar sesión en todos los dispositivos');
    } finally {
      this.isLoading = false;
    }
  }
}
