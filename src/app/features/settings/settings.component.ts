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
        titleKey: 'settings_categories_account',
        icon: 'personCircle',
        items: [
          { 
            titleKey: 'settings_account_deleteAccount_title', 
            icon: 'trash', 
            route: '/settings/account/delete', 
            descriptionKey: 'settings_account_deleteAccount_description' 
          },
          { 
            titleKey: 'settings_account_logout_title', 
            icon: 'logOut', 
            route: '/settings/account/logout', 
            descriptionKey: 'settings_account_logout_description' 
          },
          { 
            titleKey: 'settings_account_changePassword_title', 
            icon: 'key', 
            route: '/settings/account/password', 
            descriptionKey: 'settings_account_changePassword_description' 
          },
          { 
            titleKey: 'settings_account_updateProfile_title', 
            icon: 'mail', 
            route: '/settings/account/profile', 
            descriptionKey: 'settings_account_updateProfile_description' 
          }
        ]
      },
      {
        titleKey: 'settings_categories_privacy',
        icon: 'shieldCheckmark',
        items: [
          { 
            titleKey: 'settings_privacy_policy_title', 
            icon: 'documentText', 
            route: '/settings/privacy/policy', 
            descriptionKey: 'settings_privacy_policy_description' 
          },
          { 
            titleKey: 'settings_privacy_consent_title', 
            icon: 'eyeOff', 
            route: '/settings/privacy/consent', 
            descriptionKey: 'settings_privacy_consent_description' 
          },
          { 
            titleKey: 'settings_privacy_tracking_title', 
            icon: 'analytics', 
            route: '/settings/privacy/tracking', 
            descriptionKey: 'settings_privacy_tracking_description' 
          }
        ]
      },
      {
        titleKey: 'settings_categories_permissions',
        icon: 'location',
        items: [
          { 
            titleKey: 'settings_permissions_location_title', 
            icon: 'location', 
            route: '/settings/permissions/location', 
            descriptionKey: 'settings_permissions_location_description' 
          },
          { 
            titleKey: 'settings_permissions_notifications_title', 
            icon: 'notifications', 
            route: '/settings/permissions/notifications', 
            descriptionKey: 'settings_permissions_notifications_description' 
          },
          { 
            titleKey: 'settings_permissions_twoFactor_title', 
            icon: 'lockClosed', 
            route: '/settings/permissions/2fa', 
            descriptionKey: 'settings_permissions_twoFactor_description' 
          }
        ]
      },
      {
        titleKey: 'settings_categories_history',
        icon: 'time',
        items: [
          { 
            titleKey: 'settings_activityHistory_title', 
            icon: 'list', 
            route: '/settings/history/activity', 
            descriptionKey: 'settings_activityHistory_description' 
          }
        ]
      }
    ];
  }
}
