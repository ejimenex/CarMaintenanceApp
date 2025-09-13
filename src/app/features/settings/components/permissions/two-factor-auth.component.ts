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
  IonButton,
  IonIcon,
  IonItem,
  IonLabel,
  IonToggle
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { lockClosed, shieldCheckmark, qrCode } from 'ionicons/icons';
import { AlertService } from '../../../../utils/alert.service';

@Component({
  selector: 'app-two-factor-auth',
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
    IonItem,
    IonLabel,
    IonToggle
  ],
  templateUrl: './two-factor-auth.component.html',
  styleUrls: ['./two-factor-auth.component.scss']
})
export class TwoFactorAuthComponent {
  
  twoFactorEnabled = false;
  isLoading = false;

  constructor(private alertService: AlertService) {
    addIcons({ lockClosed, shieldCheckmark, qrCode });
  }

  async toggleTwoFactor() {
    this.isLoading = true;
    
    try {
      // Simular llamada al API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      this.twoFactorEnabled = !this.twoFactorEnabled;
      
      if (this.twoFactorEnabled) {
        this.alertService.showSuccess('Verificación en dos pasos activada');
      } else {
        this.alertService.showSuccess('Verificación en dos pasos desactivada');
      }
    } catch (error) {
      this.alertService.showError('Error al configurar la verificación en dos pasos');
    } finally {
      this.isLoading = false;
    }
  }

  setupTwoFactor() {
    this.alertService.showInfo('Redirigiendo a configuración de 2FA...');
  }
}
