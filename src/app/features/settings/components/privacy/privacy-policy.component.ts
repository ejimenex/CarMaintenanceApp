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
  IonIcon
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { documentText, shieldCheckmark, eye, server } from 'ionicons/icons';

@Component({
  selector: 'app-privacy-policy',
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
    IonIcon
  ],
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss']
})
export class PrivacyPolicyComponent {

  privacySections = [
    {
      title: 'Información que Recopilamos',
      icon: 'documentText',
      content: [
        'Información personal (nombre, email, teléfono)',
        'Datos de vehículos y talleres',
        'Información de ubicación (con tu consentimiento)',
        'Datos de uso de la aplicación',
        'Información técnica del dispositivo'
      ]
    },
    {
      title: 'Cómo Usamos tu Información',
      icon: 'server',
      content: [
        'Proporcionar servicios de mantenimiento de vehículos',
        'Conectar con talleres cercanos',
        'Mejorar nuestros servicios',
        'Enviar notificaciones importantes',
        'Cumplir con obligaciones legales'
      ]
    },
    {
      title: 'Compartir Información',
      icon: 'shieldCheckmark',
      content: [
        'Solo compartimos datos con talleres autorizados',
        'No vendemos tu información personal',
        'Podemos compartir datos anónimos para análisis',
        'Cumplimiento de requisitos legales',
        'Con tu consentimiento explícito'
      ]
    },
    {
      title: 'Tus Derechos',
      icon: 'eye',
      content: [
        'Acceder a tus datos personales',
        'Corregir información incorrecta',
        'Eliminar tu cuenta y datos',
        'Exportar tus datos',
        'Revocar consentimientos',
        'Limitar el procesamiento'
      ]
    }
  ];

  constructor() {
    addIcons({ documentText, shieldCheckmark, eye, server });
  }

  getCurrentDate(): string {
    return new Date().toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}
