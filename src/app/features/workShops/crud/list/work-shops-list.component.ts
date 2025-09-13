import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { AlertService } from '../../../../utils/alert.service';
import { WorkshopService, WorkshopGetRequest } from '../../../../utils/worksShop.service';
import { WorkShop } from '../../interfaces/work-shop.interface';
import { catchError, finalize, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { of, Subject } from 'rxjs';
import { WorkshopViewModalComponent } from '../view/workshop-view-modal.component';

@Component({
  selector: 'app-work-shops-list',
  templateUrl: './work-shops-list.component.html',
  styleUrls: ['./work-shops-list.component.scss'],
  imports: [
    CommonModule,
    IonicModule,
    TranslateModule,
    FormsModule
  ],
  providers: [
    WorkshopService,
    AlertService
  ],
  standalone: true
})
export class WorkShopsListComponent implements OnInit, OnDestroy {
  workshops: WorkShop[] = [];
  loading = false;
  errorMessage = '';
  globalSearch = '';
  currentPage = 1;
  totalPages = 1;
  totalItems = 0;
  hasMoreData = true;
  
  // Delete confirmation properties
  showDeleteAlert = false;
  workshopToDelete: WorkShop | null = null;
  deleteAlertButtons = [
    {
      text: 'common.cancel',
      role: 'cancel',
      cssClass: 'alert-button-cancel'
    },
    {
      text: 'workshops.actions.delete',
      role: 'destructive',
      cssClass: 'alert-button-delete',
      handler: () => {
        this.deleteWorkshop();
      }
    }
  ];

  // Dropdown menu properties
  openMenuId: string | null = null;
  menuEvent: any = null;

  // Search debounce subject
  private searchSubject = new Subject<string>();

  constructor(
    private workshopService: WorkshopService,
    private router: Router,
    private alertService: AlertService,
    private translateService: TranslateService,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.loadWorkshops();
    this.translateDeleteButtons();
    this.setupDebouncedSearch();
  }

  ionViewDidEnter() {
    this.loadWorkshops();
  }

  private translateDeleteButtons() {
    this.deleteAlertButtons = this.deleteAlertButtons.map(button => ({
      ...button,
      text: this.translateService.instant(button.text)
    }));
  }

  loadWorkshops(isLoadMore: boolean = false) {
    if (isLoadMore) {
      this.currentPage++;
    } else {
      this.currentPage = 1;
      this.workshops = [];
    }

    this.loading = true;
    this.errorMessage = '';

    this.workshopService.getWorksShopPaged(this.currentPage, this.globalSearch).pipe(
      catchError(error => {
        console.error('Error loading workshops:', error);
        this.errorMessage = this.translateService.instant('workshops.list.error');
        return of(null);
      }),
      finalize(() => {
        this.loading = false;
      })
    ).subscribe({
      next: (response: any) => {
        
        if (response && response.success) {
          const newItems = response.data || [];
          
          if (isLoadMore) {
            this.workshops = [...this.workshops, ...newItems.items];
          } else {
            this.workshops = newItems.items;
          }
          
          this.totalItems = response?.data.totalCount || newItems.totalCount;
          this.totalPages = response?.datatotalPages || 1;
          this.hasMoreData = this.currentPage < this.totalPages;
        } else {
          this.errorMessage = response?.message || this.translateService.instant('workshops.list.error');
        }
      }
    });
  }

  onSearch(event: any) {
    this.globalSearch = event.target.value;
    this.searchSubject.next(this.globalSearch);
  }

  private setupDebouncedSearch() {
    this.searchSubject
      .pipe(
        debounceTime(2000), // 2 second debounce
        distinctUntilChanged() // Only emit if the value has changed
      )
      .subscribe(searchTerm => {
        this.currentPage = 1;
        this.loadWorkshops();
      });
  }

  onClearSearch() {
    this.globalSearch = '';
    this.searchSubject.next(this.globalSearch);
  }

  performSearch() {
    this.currentPage = 1;
    this.loadWorkshops();
  }

  loadMore(event: any) {
    if (this.hasMoreData && !this.loading) {
      this.loadWorkshops(true);
    }
    event.target.complete();
  }

  trackByWorkshop(index: number, workshop: WorkShop): string | number {
    return workshop.id || index;
  }

  addWorkshop() {
    this.router.navigate(['/workshops/add']);
  }

  async viewWorkshop(id: string) {
    this.closeMenuWithDelay(); // Close the dropdown menu before opening modal
    console.log('viewWorkshop called with id:', id);
    console.log('Available workshops:', this.workshops);
    
    // Find the workshop data
    const workshop = this.workshops.find(w => w.id === id);
    if (!workshop) {
      this.alertService.showError(this.translateService.instant('workshops.view.error'));
      return;
    }

    // Small delay to ensure menu closes before opening modal
    setTimeout(async () => {
      // Open the modal
      const modal = await this.modalController.create({
        component: WorkshopViewModalComponent,
        componentProps: {
          workshop: workshop
        },
        cssClass: 'workshop-view-modal'
      });

      await modal.present();

      // Handle modal dismissal
      const { data } = await modal.onDidDismiss();
      if (data) {
        if (data.action === 'edit') {
          this.editWorkshop(data.workshopId);
        } else if (data.action === 'delete') {
          this.confirmDelete(data.workshop);
        }
      }
    }, 150);
  }

  editWorkshop(id: string) {
    this.closeMenuWithDelay(); // Close the dropdown menu before navigating
    setTimeout(() => {
      this.router.navigate(['/workshops/edit', id]);
    }, 150);
  }

  confirmDelete(workshop: WorkShop) {
    this.closeMenuWithDelay(); // Close the dropdown menu before showing delete confirmation
    this.workshopToDelete = workshop;
    this.showDeleteAlert = true;
  }

  onDeleteAlertDismiss() {
    this.showDeleteAlert = false;
    this.workshopToDelete = null;
  }

  deleteWorkshop() {
    if (!this.workshopToDelete?.id) {
      return;
    }

    this.loading = true;
    this.workshopService.deleteWorksShop(this.workshopToDelete.id).pipe(
      catchError(error => {
        console.error('Error deleting workshop:', error);
        this.alertService.showError(this.translateService.instant('workshops.delete.error'));
        return of(null);
      }),
      finalize(() => {
        this.loading = false;
        this.showDeleteAlert = false;
        this.workshopToDelete = null;
      })
    ).subscribe({
      next: (response: any) => {
        if (response && response.success) {
          this.alertService.showSuccess(this.translateService.instant('workshops.delete.success'));
          // Remove the deleted workshop from the list
          this.workshops = this.workshops.filter(w => w.id !== this.workshopToDelete?.id);
          this.totalItems--;
        } else {
          this.alertService.showError(response.message || this.translateService.instant('workshops.delete.error'));
        }
      }
    });
  }

  // Dropdown menu methods
  toggleMenu(event: any, workshopId: string) {
    event.stopPropagation();
    this.menuEvent = event;
    this.openMenuId = this.openMenuId === workshopId ? null : workshopId;
  }

  closeMenu() {
    this.openMenuId = null;
    this.menuEvent = null;
  }

  // Method to close menu with a small delay for better UX
  private closeMenuWithDelay() {
    this.closeMenu();
    // Small delay to ensure menu closes before navigation
    setTimeout(() => {
      this.closeMenu();
    }, 100);
  }

  ngOnDestroy() {
    this.searchSubject.complete();
  }
}