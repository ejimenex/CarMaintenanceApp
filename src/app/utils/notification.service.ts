import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  timestamp: Date;
  read: boolean;
  category: 'maintenance' | 'reminder' | 'system' | 'message';
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  public notifications$ = this.notificationsSubject.asObservable();

  private unreadCountSubject = new BehaviorSubject<number>(0);
  public unreadCount$ = this.unreadCountSubject.asObservable();

  constructor() {
    // Initialize with some sample notifications
    this.initializeSampleNotifications();
  }

  private initializeSampleNotifications(): void {
    const sampleNotifications: Notification[] = [
      {
        id: '1',
        title: 'Mantenimiento Programado',
        message: 'Tu vehículo ABC-123 tiene un mantenimiento programado para mañana.',
        type: 'warning',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        read: false,
        category: 'maintenance'
      },
      {
        id: '2',
        title: 'Nuevo Mensaje',
        message: 'Tienes un nuevo mensaje del taller "AutoService Plus".',
        type: 'info',
        timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
        read: false,
        category: 'message'
      },
      {
        id: '3',
        title: 'Recordatorio de Servicio',
        message: 'El servicio de tu vehículo XYZ-789 vence en 7 días.',
        type: 'warning',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
        read: true,
        category: 'reminder'
      },
      {
        id: '4',
        title: 'Actualización del Sistema',
        message: 'Nueva versión de la aplicación disponible.',
        type: 'info',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        read: false,
        category: 'system'
      }
    ];

    this.notificationsSubject.next(sampleNotifications);
    this.updateUnreadCount();
  }

  getNotifications(): Observable<Notification[]> {
    return this.notifications$;
  }

  getUnreadCount(): Observable<number> {
    return this.unreadCount$;
  }

  markAsRead(notificationId: string): void {
    const notifications = this.notificationsSubject.value;
    const updatedNotifications = notifications.map(notification => 
      notification.id === notificationId 
        ? { ...notification, read: true }
        : notification
    );
    this.notificationsSubject.next(updatedNotifications);
    this.updateUnreadCount();
  }

  markAllAsRead(): void {
    const notifications = this.notificationsSubject.value;
    const updatedNotifications = notifications.map(notification => 
      ({ ...notification, read: true })
    );
    this.notificationsSubject.next(updatedNotifications);
    this.updateUnreadCount();
  }

  addNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'read'>): void {
    const newNotification: Notification = {
      ...notification,
      id: this.generateId(),
      timestamp: new Date(),
      read: false
    };

    const currentNotifications = this.notificationsSubject.value;
    this.notificationsSubject.next([newNotification, ...currentNotifications]);
    this.updateUnreadCount();
  }

  removeNotification(notificationId: string): void {
    const notifications = this.notificationsSubject.value;
    const updatedNotifications = notifications.filter(n => n.id !== notificationId);
    this.notificationsSubject.next(updatedNotifications);
    this.updateUnreadCount();
  }

  private updateUnreadCount(): void {
    const notifications = this.notificationsSubject.value;
    const unreadCount = notifications.filter(n => !n.read).length;
    this.unreadCountSubject.next(unreadCount);
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Simulate receiving new notifications
  simulateNewNotification(): void {
    const notificationTypes = [
      {
        title: 'Nuevo Recordatorio',
        message: 'Tu vehículo necesita revisión de frenos.',
        type: 'warning' as const,
        category: 'maintenance' as const
      },
      {
        title: 'Mensaje del Taller',
        message: 'Tu cita ha sido confirmada para mañana.',
        type: 'info' as const,
        category: 'message' as const
      },
      {
        title: 'Servicio Completado',
        message: 'El mantenimiento de tu vehículo ha sido completado.',
        type: 'success' as const,
        category: 'system' as const
      }
    ];

    const randomNotification = notificationTypes[Math.floor(Math.random() * notificationTypes.length)];
    this.addNotification(randomNotification);
  }
}
