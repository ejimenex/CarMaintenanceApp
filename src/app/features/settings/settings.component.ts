import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent, IonList, IonItem, IonIcon, IonLabel, IonItemSliding } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  personCircle, 
  shieldCheckmark, 
  location, 
  phonePortrait, 
  time, 
  chevronForward,
  trash,
  logOut,
  key,
  mail,
  documentText,
  download,
  eyeOff,
  analytics,
  notifications,
  lockClosed,
  list,
  trashBin
} from 'ionicons/icons';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonMenuButton,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonIcon,
    IonLabel,

  ],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {
  
  settingsCategories: any[] = [];

  constructor(private translateService: TranslateService) {
    addIcons({ 
      personCircle, 
      shieldCheckmark, 
      location, 
      phonePortrait, 
      time, 
      chevronForward,
      trash,
      logOut,
      key,
      mail,
      documentText,
      download,
      eyeOff,
      analytics,
      notifications,
      lockClosed,
      list,
      trashBin
    });
    
    this.initializeSettingsCategories();
  }

  private initializeSettingsCategories() {
    this.settingsCategories = [
      {
        titleKey: 'settings.categories.account',
        icon: 'personCircle',
        items: [
          { 
            titleKey: 'settings.account.deleteAccount.title', 
            icon: 'trash', 
            route: '/settings/account/delete', 
            descriptionKey: 'settings.account.deleteAccount.description' 
          },
          { 
            titleKey: 'settings.account.logout.title', 
            icon: 'logOut', 
            route: '/settings/account/logout', 
            descriptionKey: 'settings.account.logout.description' 
          },
          { 
            titleKey: 'settings.account.changePassword.title', 
            icon: 'key', 
            route: '/settings/account/password', 
            descriptionKey: 'settings.account.changePassword.description' 
          },
          { 
            titleKey: 'settings.account.updateProfile.title', 
            icon: 'mail', 
            route: '/settings/account/profile', 
            descriptionKey: 'settings.account.updateProfile.description' 
          }
        ]
      },
      {
        titleKey: 'settings.categories.privacy',
        icon: 'shieldCheckmark',
        items: [
          { 
            titleKey: 'settings.privacy.policy.title', 
            icon: 'documentText', 
            route: '/settings/privacy/policy', 
            descriptionKey: 'settings.privacy.policy.description' 
          },
          { 
            titleKey: 'settings.privacy.consent.title', 
            icon: 'eyeOff', 
            route: '/settings/privacy/consent', 
            descriptionKey: 'settings.privacy.consent.description' 
          },
          { 
            titleKey: 'settings.privacy.tracking.title', 
            icon: 'analytics', 
            route: '/settings/privacy/tracking', 
            descriptionKey: 'settings.privacy.tracking.description' 
          }
        ]
      },
      {
        titleKey: 'settings.categories.permissions',
        icon: 'location',
        items: [
          { 
            titleKey: 'settings.permissions.location.title', 
            icon: 'location', 
            route: '/settings/permissions/location', 
            descriptionKey: 'settings.permissions.location.description' 
          },
          { 
            titleKey: 'settings.permissions.notifications.title', 
            icon: 'notifications', 
            route: '/settings/permissions/notifications', 
            descriptionKey: 'settings.permissions.notifications.description' 
          },
          { 
            titleKey: 'settings.permissions.twoFactor.title', 
            icon: 'lockClosed', 
            route: '/settings/permissions/2fa', 
            descriptionKey: 'settings.permissions.twoFactor.description' 
          }
        ]
      },
      {
        titleKey: 'settings.categories.history',
        icon: 'time',
        items: [
          { 
            titleKey: 'settings.activityHistory.title', 
            icon: 'list', 
            route: '/settings/history/activity', 
            descriptionKey: 'settings.activityHistory.description' 
          }
        ]
      }
    ];
  }
}
