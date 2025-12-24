
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
  IonBadge,
  IonList
} from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';

import { addIcons } from 'ionicons';
import { 
  car, 
  construct, 
  build, 
  settings, 
  helpCircle, 
  addCircle, 
  personCircle, 
  logOut, 
  person, 
  time, 
  logIn, 
  notifications, 
  notificationsOutline, 
  carSport,
  home,
  homeOutline,
  calendarOutline,
  navigateOutline,
  mapOutline,
  documentTextOutline,
  cloudUploadOutline,
  cashOutline,
  helpCircleOutline,
  megaphoneOutline,
  rocketOutline,
  list
} from 'ionicons/icons';
import { AuthService } from './features/auth/services/auth.service';
import { logUserService, LogUserStats } from './utils/logUser.service';
import { I18nService } from './i18n/i18n.service';
import { TranslateService } from '@ngx-translate/core';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import { NotificationService } from './utils/notification.service';
import { AlertController } from '@ionic/angular';
import { ThemeService } from './utils/theme.service';

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
    IonBadge,
    IonSpinner,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonList
  ],
})
export class AppComponent implements OnInit {
  isAuthenticated: boolean = false;
  
  public menuPages = [
    { 
      titleKey: 'dashboard_menu_navigation_vehicles', 
      url: '/vehicles', 
      icon: 'car'
    },
    { 
      titleKey: 'dashboard_menu_navigation_workshops', 
      url: '/workshops', 
      icon: 'construct'
    },
    { 
      titleKey: 'workshops_near_me_title',
      url: '/workshops/near-me', 
      icon: 'map-outline'
    },
    { 
      titleKey: 'dashboard_menu_navigation_maintenance', 
      url: '/maintenance', 
      icon: 'build'
    },
    { 
      titleKey: 'notifications_title', 
      url: '/notifications', 
      icon: 'notifications',
      badge: true,
      badgeCount: 0
    },
    { 
      titleKey: 'dashboard_menu_navigation_userPreferences', 
      url: '/user-preference', 
      icon: 'person'
    },
    { 
      titleKey: 'dashboard_menu_navigation_settings', 
      url: '/settings', 
      icon: 'settings'
    },
    { 
      titleKey: 'dashboard_menu_footer_helpSupport', 
      url: '/help', 
      icon: 'help-circle-outline'
    }
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
    private notificationService: NotificationService,
    private alertController: AlertController,
    private themeService: ThemeService // Inicializa el tema al cargar la app
  ) {
    addIcons({ 
      car, 
      construct, 
      build, 
      settings, 
      helpCircle, 
      addCircle, 
      personCircle, 
      logOut, 
      person, 
      time, 
      logIn, 
      notifications, 
      notificationsOutline, 
      carSport,
      home,
      homeOutline,
      calendarOutline,
      navigateOutline,
      mapOutline,
      documentTextOutline,
      cloudUploadOutline,
      cashOutline,
      helpCircleOutline,
      megaphoneOutline,
      rocketOutline,
      list
    });
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

  private async checkAuthentication(): Promise<void> {
    this.isAuthenticated = await this.authService.isAuthenticated();
  }

  formatLastLogin(date: Date): string {
    if (!date) return this.translateService.instant('common_never');

    const now = new Date();
    const lastLogin = new Date(date);
    const diffInHours = Math.floor((now.getTime() - lastLogin.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) {
      return this.translateService.instant('common_lessThanHour');
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
      this.unreadNotifications = count.data;
      // Update badge count in menu
      const reminderItem = this.menuPages.find(p => p.url === '/notifications');
      if (reminderItem) {
        reminderItem.badgeCount = this.unreadNotifications;
      }
    });
  }

  navigateToNotifications() {
    this.router.navigate(['/notifications']);
  }

  async showProFeatures() {
    const alert = await this.alertController.create({
      header: this.translateService.instant('menu_pro_title'),
      message: this.translateService.instant('menu_pro_message'),
      buttons: [
        {
          text: this.translateService.instant('common_cancel'),
          role: 'cancel'
        },
        {
          text: this.translateService.instant('menu_learn_more'),
          handler: () => {
            // Navigate to pro features page or external link
            console.log('Show PRO features');
          }
        }
      ]
    });

    await alert.present();
  }

  async logout() {
    await this.authService.signOut();
  }
}
