import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { AlertService } from '../../../../utils/alert.service';
import { VehicleService, VehicleGetRequest } from '../../../../utils/vehicle.service';
import { catchError, finalize, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { of, Subject } from 'rxjs';
import { VehicleViewModalComponent } from '../view/vehicle-view-modal.component';

@Component({
  selector: 'app-vehicles-list',
  templateUrl: './vehicles-list.component.html',
  styleUrls: ['./vehicles-list.component.scss'],
  imports: [
    CommonModule,
    IonicModule,
    TranslateModule,
    FormsModule
  ],
  providers: [
    VehicleService,
    AlertService
  ],
  standalone: true
})
export class VehiclesListComponent implements OnInit, OnDestroy {
  vehicles: VehicleGetRequest[] = [];
  loading = false;
  errorMessage = '';
  currentPage = 1;
  globalSearch = '';
  totalPages = 1;
  totalItems = 0;
  hasMoreData = true;
  
  // Delete confirmation properties
  showDeleteAlert = false;
  vehicleToDelete: VehicleGetRequest | null = null;
  deleteAlertButtons = [
    {
      text: 'common.cancel',
      role: 'cancel',
      cssClass: 'alert-button-cancel'
    },
    {
      text: 'vehicles.actions.delete',
      role: 'destructive',
      cssClass: 'alert-button-delete',
      handler: () => {
        this.deleteVehicle();
      }
    }
  ];

  // Dropdown menu properties
  openMenuId: string | null = null;
  menuEvent: any = null;

  // Search debounce subject
  private searchSubject = new Subject<string>();

  constructor(
    private vehicleService: VehicleService,
    private router: Router,
    private alertService: AlertService,
    private translateService: TranslateService,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.loadVehicles();
    this.translateDeleteButtons();
    this.setupDebouncedSearch();
  }
  ionViewDidEnter() {
    this.loadVehicles();
  }
  private translateDeleteButtons() {
    this.deleteAlertButtons = this.deleteAlertButtons.map(button => ({
      ...button,
      text: this.translateService.instant(button.text)
    }));
  }

  loadVehicles(isLoadMore: boolean = false) {
    if (isLoadMore) {
      this.currentPage++;
    } else {
      this.currentPage = 1;
      this.vehicles = [];
    }

    this.loading = true;
    this.errorMessage = '';

    this.vehicleService.getVehiclePaged(this.currentPage, this.globalSearch).pipe(
      catchError(error => {
        console.error('Error loading vehicles:', error);
        this.errorMessage = this.translateService.instant('vehicles.list.error');
        return of(null);
      }),
      finalize(() => {
        this.loading = false;
      })
    ).subscribe({
      next: (response: any) => {
        if (response && response.success) {
          const responseData = response.data as any;
          const newItems = responseData.items || responseData || [];
          
          if (isLoadMore) {
            this.vehicles = [...this.vehicles, ...newItems];
          } else {
            this.vehicles = newItems;
          }
          
          this.totalItems = responseData?.totalCount || 0;
          this.totalPages = responseData?.totalPages || 1;
          this.hasMoreData = this.currentPage < this.totalPages;
        } else {
          this.errorMessage = response.message || this.translateService.instant('vehicles.list.error');
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
        this.loadVehicles();
      });
  }

  onClearSearch() {
    this.globalSearch = '';
    this.searchSubject.next(this.globalSearch);
  }

  performSearch() {
    this.currentPage = 1;
    this.loadVehicles();
  }

  loadMore(event: any) {
    if (this.hasMoreData && !this.loading) {
      this.loadVehicles(true);
    }
    event.target.complete();
  }

  trackByVehicle(index: number, vehicle: VehicleGetRequest): string | number {
    return vehicle.id || index;
  }

  addVehicle() {
    this.router.navigate(['/vehicles/add']);
  }

  async viewVehicle(id: string) {
    this.closeMenuWithDelay(); // Close the dropdown menu before opening modal
    console.log('viewVehicle called with id:', id);
    console.log('Available vehicles:', this.vehicles);
    
    // Find the vehicle data
    const vehicle = this.vehicles.find(v => v.id === id);
    if (!vehicle) {
      this.alertService.showError(this.translateService.instant('vehicles.view.error'));
      return;
    }

    // Small delay to ensure menu closes before opening modal
    setTimeout(async () => {
      // Open the modal
      const modal = await this.modalController.create({
        component: VehicleViewModalComponent,
        componentProps: {
          vehicle: vehicle
        },
        cssClass: 'vehicle-view-modal'
      });

      await modal.present();

      // Handle modal dismissal
      const { data } = await modal.onDidDismiss();
      if (data) {
        if (data.action === 'edit') {
          this.editVehicle(data.vehicleId);
        } else if (data.action === 'delete') {
          this.confirmDelete(data.vehicle);
        }
      }
    }, 150);
  }

  editVehicle(id: string) {
    this.closeMenuWithDelay(); // Close the dropdown menu before navigating
    setTimeout(() => {
      this.router.navigate(['/vehicles/edit', id]);
    }, 150);
  }

  confirmDelete(vehicle: VehicleGetRequest) {
    this.closeMenu(); // Close the dropdown menu before showing delete confirmation
    this.vehicleToDelete = vehicle;
    this.showDeleteAlert = true;
  }

  onDeleteAlertDismiss() {
    this.showDeleteAlert = false;
    this.vehicleToDelete = null;
  }

  deleteVehicle() {
    if (!this.vehicleToDelete?.id) {
      return;
    }

    this.loading = true;
    this.vehicleService.deleteVehicle(this.vehicleToDelete.id).pipe(
      catchError(error => {
        console.error('Error deleting vehicle:', error);
        this.alertService.showError(this.translateService.instant('vehicles.delete.error'));
        return of(null);
      }),
      finalize(() => {
        this.loading = false;
        this.showDeleteAlert = false;
        this.vehicleToDelete = null;
      })
    ).subscribe({
      next: (response: any) => {
        if (response && response.success) {
          this.alertService.showSuccess(this.translateService.instant('vehicles.delete.success'));
          // Remove the deleted vehicle from the list
          this.vehicles = this.vehicles.filter(v => v.id !== this.vehicleToDelete?.id);
          this.totalItems--;
        } else {
          this.alertService.showError(response.message || this.translateService.instant('vehicles.delete.error'));
        }
      }
    });
  }

  // Dropdown menu methods
  toggleMenu(event: any, vehicleId: string) {
    event.stopPropagation();
    this.menuEvent = event;
    this.openMenuId = this.openMenuId === vehicleId ? null : vehicleId;
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