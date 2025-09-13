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
  IonButton,
  IonIcon
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { list, phonePortrait, time, location } from 'ionicons/icons';
import { AlertService } from '../../../../utils/alert.service';

@Component({
  selector: 'app-active-devices',
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
    IonButton,
    IonIcon
  ],
  templateUrl: './active-devices.component.html',
  styleUrls: ['./active-devices.component.scss']
})
export class ActiveDevicesComponent {
  
  activeDevices = [
    {
      id: 1,
      name: 'iPhone 12',
      location: 'Madrid, España',
      lastActive: 'Hace 2 horas',
      current: true,
      ipAddress: '192.168.1.100'
    },
    {
      id: 2,
      name: 'iPad Pro',
      location: 'Barcelona, España',
      lastActive: 'Hace 1 día',
      current: false,
      ipAddress: '192.168.1.101'
    },
    {
      id: 3,
      name: 'MacBook Pro',
      location: 'Valencia, España',
      lastActive: 'Hace 3 días',
      current: false,
      ipAddress: '192.168.1.102'
    }
  ];

  constructor(private alertService: AlertService) {
    addIcons({ list, phonePortrait, time, location });
  }

  revokeSession(deviceId: number) {
    this.alertService.showSuccess(`Sesión revocada para el dispositivo ${deviceId}`);
  }
}
