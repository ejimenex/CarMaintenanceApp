import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  IonList,
  IonItem,
  IonLabel,
  IonToggle,
  IonIcon,
  IonButton
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { location, navigate, settings } from 'ionicons/icons';
import { AlertService } from '../../../../utils/alert.service';

@Component({
  selector: 'app-location-permissions',
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
    IonList,
    IonItem,
    IonLabel,
    IonToggle,
    IonIcon,
    IonButton
  ],
  templateUrl: './location-permissions.component.html',
  styleUrls: ['./location-permissions.component.scss']
})
export class LocationPermissionsComponent {
  
  locationSettings = [
    {
      id: 'foreground',
      title: 'Ubicación en Primer Plano',
      description: 'Acceso a ubicación cuando la app está abierta',
      icon: 'location',
      enabled: true
    },
    {
      id: 'background',
      title: 'Ubicación en Segundo Plano',
      description: 'Acceso a ubicación cuando la app está cerrada',
      icon: 'navigate',
      enabled: false
    },
    {
      id: 'precise',
      title: 'Ubicación Precisa',
      description: 'Usar GPS para ubicación más precisa',
      icon: 'location',
      enabled: true
    }
  ];

  constructor(private alertService: AlertService) {
    addIcons({ location, navigate, settings });
  }

  toggleLocation(setting: any) {
    setting.enabled = !setting.enabled;
    this.alertService.showSuccess(`Permiso ${setting.enabled ? 'activado' : 'desactivado'}: ${setting.title}`);
  }

  openSettings() {
    this.alertService.showInfo('Redirigiendo a configuración del sistema...');
  }
}
