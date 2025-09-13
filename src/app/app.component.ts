
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { 
  IonApp, 
  IonMenu, 
  IonContent, 
  IonMenuToggle, 
  IonItem, 
  IonIcon, 
  IonLabel, 
  IonRouterOutlet, 
  IonSpinner, 
  MenuController,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonTitle,
  IonMenuButton,
  IonBadge
} from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';

import { addIcons } from 'ionicons';
import { car, construct, settings, helpCircle, addCircle, personCircle, logOut, person, time, logIn, notifications, notificationsOutline } from 'ionicons/icons';
import { AuthService } from './features/auth/services/auth.service';
import { logUserService, LogUserStats } from './utils/logUser.service';
import { I18nService } from './i18n/i18n.service';
import { TranslateService } from '@ngx-translate/core';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import { NotificationService } from './utils/notification.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  imports: [
    CommonModule, 
    TranslateModule, 
    IonApp, 
    IonMenu, 
    IonContent, 
    IonMenuToggle, 
    IonItem, 
    IonIcon, 
    IonLabel, 
    IonRouterOutlet, 
    IonSpinner,
    IonBadge
  ],
})
export class AppComponent implements OnInit {
  isAuthenticated: boolean = false;
  
  public appPages = [
    { titleKey: 'dashboard.menu.navigation.vehicles', url: '/vehicles', icon: 'car' },
    { titleKey: 'dashboard.menu.navigation.workshops', url: '/workshops', icon: 'construct' },
    { titleKey: 'dashboard.menu.navigation.myServices', url: '/workshops', icon: 'construct' },
    { titleKey: 'dashboard.menu.navigation.userPreferences', url: '/user-preference', icon: 'person' },
    { titleKey: 'dashboard.menu.navigation.settings', url: '/settings', icon: 'settings' },
  ];

  loginStats: LogUserStats | null = null;
  isLoadingStats: boolean = false;
  userName: string = 'Usuario';
  unreadNotifications: number = 0;

  constructor(
    private authService: AuthService,
    private logUserService: logUserService,
    private i18nService: I18nService,
    private translateService: TranslateService,
    private router: Router,
    private menu: MenuController,
    private notificationService: NotificationService
  ) {
    addIcons({ car, construct, settings, helpCircle, addCircle, personCircle, logOut, person, time, logIn, notifications, notificationsOutline });
    this.loadUserName();
  }

  ngOnInit() {
    this.checkAuthentication();
    this.loadLoginStats();
    this.loadNotifications();
    
    // Enable menu by default
    this.menu.enable(true, 'main-menu');
    
    // Listen for authentication changes
    this.authService.user$.subscribe(user => {
      this.isAuthenticated = !!user;
      if (user) {
        this.menu.enable(true, 'main-menu');
      } else {
        this.menu.enable(true, 'main-menu');
      }
    });
  }

  private checkAuthentication(): void {
    this.isAuthenticated = this.authService.isAuthenticated();
  }

  formatLastLogin(date: Date): string {
    if (!date) return this.translateService.instant('common.never');

    const now = new Date();
    const lastLogin = new Date(date);
    const diffInHours = Math.floor((now.getTime() - lastLogin.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) {
      return this.translateService.instant('common.lessThanHour');
    } else if (diffInHours < 24) {
      const hoursKey = diffInHours > 1 ? 'common.hoursAgo' : 'common.hourAgo';
      return this.translateService.instant(hoursKey, { hours: diffInHours });
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      const daysKey = diffInDays > 1 ? 'common.daysAgo' : 'common.dayAgo';
      return this.translateService.instant(daysKey, { days: diffInDays });
    }
  }

  // Method to handle navigation
  navigateTo(url: string): void {
    console.log('Navigating to:', url);
    this.router.navigate([url]);
  }

  loadUserName() {
    try {
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      const token = currentUser.token;
      
      if (token) {
        // Decode JWT token (payload is the second part)
        const tokenParts = token.split('.');
        if (tokenParts.length === 3) {
          const payload = JSON.parse(atob(tokenParts[1]));
          this.userName = payload.normalName || 'Usuario';
        } else {
          this.userName = 'Usuario';
        }
      } else {
        this.userName = 'Usuario';
      }
    } catch (error) {
      console.error('Error decoding user name from token:', error);
      this.userName = 'Usuario';
    }
  }

  loadLoginStats() {
    this.i18nService.setLanguage(this.translateService.currentLang);
    this.isLoadingStats = true;

    this.logUserService.getLogUserStats()
      .pipe(
        catchError(error => {
          console.error('Error loading login stats:', error);
          return of(null);
        }),
        finalize(() => {
          this.isLoadingStats = false;
        })
      )
      .subscribe(response => {
        if (response && response.data) {
          const responseData = response.data as any;
          this.loginStats = responseData.items || responseData || null;
          
          // Set user language from response
          if (responseData.language) {
            const userLanguage = responseData.language.toLowerCase();
            console.log('Setting user language from response:', userLanguage);
            this.translateService.use(userLanguage);
            this.i18nService.setLanguage(userLanguage);
          }
        }
      });
  }

  loadNotifications() {
    this.notificationService.getUnreadCount().subscribe(count => {
      this.unreadNotifications = count;
    });
  }

  navigateToNotifications() {
    this.router.navigate(['/notifications']);
  }

  async logout() {
    await this.authService.signOut();
  }
}
