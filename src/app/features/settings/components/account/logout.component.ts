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
  IonIcon
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { logOut, warning } from 'ionicons/icons';
import { AlertService } from '../../../../utils/alert.service';
import { AuthService } from '../../../../features/auth/services/auth.service';

@Component({
  selector: 'app-logout',
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
    IonIcon
  ],
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent {
  isLoading = false;

  constructor(
    private router: Router,
    private alertService: AlertService,
    private authService: AuthService
  ) {
    addIcons({ logOut, warning });
  }

  async logout() {
    this.isLoading = true;
    
    try {
      await this.authService.signOut();
      this.alertService.showSuccess('Sesión cerrada exitosamente');
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Error logging out:', error);
      this.alertService.showError('Error al cerrar sesión');
    } finally {
      this.isLoading = false;
    }
  }
}
