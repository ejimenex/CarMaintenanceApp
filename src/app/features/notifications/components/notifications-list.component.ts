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
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonList,
  IonItem,
  IonLabel,
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
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonList,
    IonItem,
    IonLabel,
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

  loadNotifications() {
    this.loading = true;
    this.notificationService.notifications$.subscribe({
      next: (notifications) => {
        this.notifications = notifications;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading notifications:', error);
        this.loading = false;
      }
    });
  }

  loadUnreadCount() {
    this.notificationService.unreadCount$.subscribe(count => {
      this.unreadCount = count;
    });
  }

  acceptNotification(notification: Notification) {
    this.notificationService.markAsRead(notification.id);
    this.alertService.showSuccess(
      this.translateService.instant('notifications.accepted')
    );
  }

  deleteNotification(notification: Notification) {
    this.alertService.showConfirm({
      message: this.translateService.instant('notifications.deleteConfirm'),
      confirmText: this.translateService.instant('common.delete'),
      cancelText: this.translateService.instant('common.cancel'),
      cssClass: 'alert-button-cancel'
    }).then((result) => {
      if (result) {
        this.notificationService.removeNotification(notification.id);
        this.alertService.showSuccess(
          this.translateService.instant('notifications.deleted')
        );
      }
    });
  }

  markAllAsRead() {
    if (this.unreadCount > 0) {
      this.notificationService.markAllAsRead();
      this.alertService.showSuccess(
        this.translateService.instant('notifications.allMarkedRead')
      );
    }
  }

  doRefresh(event: any) {
    setTimeout(() => {
      this.loadNotifications();
      event.target.complete();
    }, 1000);
  }

  getNotificationIcon(notification: Notification): string {
    switch (notification.category) {
      case 'maintenance':
        return 'car';
      case 'reminder':
        return 'time';
      case 'system':
        return 'shield';
      case 'message':
        return 'informationCircle';
      default:
        return 'notifications';
    }
  }

  getNotificationColor(notification: Notification): string {
    switch (notification.type) {
      case 'success':
        return 'success';
      case 'warning':
        return 'warning';
      case 'error':
        return 'danger';
      default:
        return 'primary';
    }
  }

  formatTimestamp(timestamp: Date): string {
    const now = new Date();
    const diff = now.getTime() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return this.translateService.instant('notifications.justNow');
    if (minutes < 60) return this.translateService.instant('notifications.minutesAgo', { minutes });
    if (hours < 24) return this.translateService.instant('notifications.hoursAgo', { hours });
    return this.translateService.instant('notifications.daysAgo', { days });
  }

  trackByNotificationId(index: number, notification: Notification): string {
    return notification.id;
  }
}
