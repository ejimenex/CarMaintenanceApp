import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  IonHeader, 
  IonToolbar, 
  IonButtons, 
  IonBackButton, 
  IonTitle, 
  IonContent,
  IonCard,
  IonCardContent,
  IonButton,
  IonIcon,
  IonBadge,
  IonAvatar,
  IonSkeletonText,
  IonRefresher,
  IonRefresherContent,
  IonFab,
  IonFabButton
} from '@ionic/angular/standalone';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import { 
  notifications, 
  checkmarkCircle, 
  warning, 
  informationCircle, 
  trash,
  time,
  car,
  construct,
  shield
} from 'ionicons/icons';

import { NotificationService, Notification } from '../../../utils/notification.service';
import { AlertService } from '../../../utils/alert.service';

@Component({
  selector: 'app-notifications-list',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonTitle,
    IonContent,
    IonCard,
    IonCardContent,
    IonButton,
    IonIcon,
    IonBadge,
    IonAvatar,
    IonSkeletonText,
    IonRefresher,
    IonRefresherContent,
    IonFab,
    IonFabButton
  ],
  templateUrl: './notifications-list.component.html',
  styleUrls: ['./notifications-list.component.scss']
})
export class NotificationsListComponent implements OnInit {
  notifications: Notification[] = [];
  loading = false;
  unreadCount = 0;

  constructor(
    private notificationService: NotificationService,
    private alertService: AlertService,
    private translateService: TranslateService
  ) {
    addIcons({ 
      notifications, 
      checkmarkCircle, 
      warning, 
      informationCircle,
      trash,
      time,
      car,
      construct,
      shield
    });
  }

  ngOnInit() {
    this.loadNotifications();
    this.loadUnreadCount();
  }
markAllAsRead(

) {

}
onNotificationClick(notification: Notification) {
 
}
acceptNotification(notification: Notification) {
  this.notificationService.markAsRead(notification.id).subscribe({
    next: (notifications) => {
      this.loadNotifications();
    },
    error: (error) => {
      console.error('Error loading notifications:', error);
    }
  });
}
markAsUnread(notification: Notification) {
  alert('markAsUnread');
}
deleteNotification(notification: Notification) {
  alert('deleteNotification');
}
  loadNotifications() {
    // Subscribe to reactive notifications
    this.notificationService.getNotificationByUser().subscribe({
      next: (notifications) => {
        this.notifications = notifications.data || [];
      },
      error: (error) => {
        console.error('Error loading notifications:', error);
      }
    });

    
  }

  loadUnreadCount() {
    this.notificationService.unreadCount$.subscribe(count => {
      this.unreadCount = count;
    });
  }
  
  formatTimestamp(timestamp: Date): string {
    const now = new Date();
    const diff = now.getTime() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return this.translateService.instant('notifications_justNow');
    if (minutes < 60) return this.translateService.instant('notifications.minutesAgo', { minutes });
    if (hours < 24) return this.translateService.instant('notifications.hoursAgo', { hours });
    return this.translateService.instant('notifications.daysAgo', { days });
  }

  trackByNotificationId(index: number, notification: Notification): string {
    return notification.id;
  }
}
