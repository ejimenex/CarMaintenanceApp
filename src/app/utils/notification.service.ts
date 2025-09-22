import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, timer, interval } from 'rxjs';
import { map, catchError, switchMap, startWith } from 'rxjs/operators';
import { ApiResponse, ApiService, CrudService } from './api.service';

export interface Notification {
  id: string;
  title?: string;
  message?: string;
  notificationTypeName: string;
  createdDate: Date;
  isRead: boolean;
  color: string;
  icon: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationService: CrudService<Notification>;
  private marksReadService: CrudService<string>;
  private unreadCountService: CrudService<number>;
  
  private unreadCountSubject = new BehaviorSubject<number>(0);
  public unreadCount$ = this.unreadCountSubject.asObservable();
 
  
  // Preferences
  
  constructor(private apiService: ApiService) {
    this.notificationService = this.apiService.createCrudService<Notification>({
      endpoint: 'notification',
      retryAttempts: 3
    });
    this.marksReadService = this.apiService.createCrudService<string>({
      endpoint: 'notification/MarkAsRead',
      retryAttempts: 3
    });
    this.unreadCountService = this.apiService.createCrudService<number>({
      endpoint: 'notification/GetCountUnReadByUser',
      retryAttempts: 3
    });
  }

  // Core API methods
  getNotificationByUser(): Observable<ApiResponse<Notification[]>> {
    return this.notificationService.getAllWithoutParams();
  }
  getUnreadCount(): Observable<ApiResponse<number>> {
    return this.unreadCountService.getOneWithOutParams();
  }
  markAsRead(id: string): Observable<ApiResponse<string>> {
    return this.marksReadService.updateWithoutBody(id);
  }
 
}
