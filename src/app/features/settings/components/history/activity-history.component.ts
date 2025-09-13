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
  IonIcon,
  IonSpinner,
  IonButton,
  IonInfiniteScroll,
  IonInfiniteScrollContent
} from '@ionic/angular/standalone';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import { list, time, calendar, car, construct } from 'ionicons/icons';
import { logUserService, LogUser } from '../../../../utils/logUser.service';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-activity-history',
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
    IonIcon,
    IonSpinner,
    IonButton,
    IonInfiniteScroll,
    IonInfiniteScrollContent
  ],
  templateUrl: './activity-history.component.html',
  styleUrls: ['./activity-history.component.scss']
})
export class ActivityHistoryComponent implements OnInit {
  
  activityHistory: LogUser[] = [];
  currentPage: number = 1;
  totalPages: number = 1;
  isLoading: boolean = false;
  error: string | null = null;
  hasMoreData: boolean = true;

  constructor(
    private logUserService: logUserService,
    private translateService: TranslateService
  ) {
    addIcons({ list, time, calendar, car, construct });
  }

  ngOnInit() {
    this.loadActivityHistory();
  }

  loadActivityHistory(isLoadMore: boolean = false) {
    if (isLoadMore) {
      this.currentPage++;
    } else {
      this.currentPage = 1;
      this.activityHistory = [];
    }

    this.isLoading = true;
    this.error = null;

    this.logUserService.getLogUser(this.currentPage)
      .pipe(
        catchError(error => {
          console.error('Error loading activity history:', error);
          this.error = this.translateService.instant('settings.activityHistory.error');
          return of(null);
        }),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(response => {
        if (response && response.data) {
          // Handle API response structure with items property
          const responseData = response.data as any;
          const newItems = responseData.items || responseData || [];
          
          if (isLoadMore) {
            this.activityHistory = [...this.activityHistory, ...newItems];
          } else {
            this.activityHistory = newItems;
          }
          
          this.totalPages = responseData.totalPages || 1;
          this.hasMoreData = this.currentPage < this.totalPages;
        }
      });
  }

  loadMore(event: any) {
    if (this.hasMoreData && !this.isLoading) {
      this.loadActivityHistory(true);
    }
    event.target.complete();
  }

  getActivityIcon(icon: string): string {
    // Map API icon values to Ionic icons
    const iconMap: { [key: string]: string } = {
      'car': 'car',
      'construct': 'construct',
      'list': 'list',
      'time': 'time',
      'calendar': 'calendar'
    };
    return iconMap[icon] || 'list';
  }

  formatDate(date: Date): string {
    const currentLang = this.translateService.currentLang || 'es';
    return new Date(date).toLocaleDateString(currentLang === 'es' ? 'es-ES' : currentLang === 'pt' ? 'pt-PT' : 'en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  }

  formatTime(date: Date): string {
    const currentLang = this.translateService.currentLang || 'es';
    return new Date(date).toLocaleTimeString(currentLang === 'es' ? 'es-ES' : currentLang === 'pt' ? 'pt-PT' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
