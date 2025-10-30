import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { MaintenanceDetailService, MaintenanceDetail } from '../../../../utils/maintenanceDetail.service';
import { AlertService } from '../../../../utils/alert.service';
import { catchError, finalize, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { of, Subject } from 'rxjs';

@Component({
  selector: 'app-maintenance-detail-list',
  templateUrl: './maintenance-detail-list.component.html',
  styleUrls: ['./maintenance-detail-list.component.scss'],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule,
    TranslateModule,
    FormsModule
  ],
  providers: [
    MaintenanceDetailService,
    AlertService
  ],
  standalone: true
})
export class MaintenanceDetailListComponent implements OnInit, OnDestroy {
  maintenanceDetails: MaintenanceDetail[] = [];
  loading = false;
  errorMessage = '';
  globalSearch = '';
  maintenanceHeaderId: string = '';
  
  // Delete confirmation properties
  showDeleteAlert = false;
  detailToDelete: string = '';
  deleteAlertButtons = [
    {
      text: this.translateService.instant('common.cancel'),
      role: 'cancel',
      cssClass: 'alert-button-cancel'
    },
    {
      text: this.translateService.instant('maintenance.actions.delete'),
      role: 'destructive',
      cssClass: 'alert-button-delete',
      handler: () => {
        this.deleteMaintenanceDetail();
      }
    }
  ];

  // Dropdown menu properties
  openMenuId: string | null = null;
  menuEvent: any = null;

  // Search debounce subject
  private searchSubject = new Subject<string>();

  constructor(
    private maintenanceDetailService: MaintenanceDetailService,
    private router: Router,
    private route: ActivatedRoute,
    private alertService: AlertService,
    private translateService: TranslateService
  ) {}

  ngOnInit() {
    console.log('🚀 MaintenanceDetailListComponent inicializado');
    this.route.params.subscribe(params => {
      this.maintenanceHeaderId = params['id'];
      if (this.maintenanceHeaderId) {
        this.loadMaintenanceDetails();
      }
    });
    this.setupDebouncedSearch();
  }

  ionViewDidEnter() {
    this.setupDebouncedSearch();
    if (this.maintenanceHeaderId) {
      this.loadMaintenanceDetails();
    }
  }

  loadMaintenanceDetails() {
    if (!this.maintenanceHeaderId) {
      console.warn('⚠️ No maintenance header ID provided');
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    console.log('🔄 Cargando detalles de mantenimiento...', { headerId: this.maintenanceHeaderId });
    
    this.maintenanceDetailService.getByHeader(this.maintenanceHeaderId).pipe(
      catchError(error => {
        console.error('❌ Error loading maintenance details:', error);
        this.errorMessage = this.translateService.instant('maintenance.detail.list.error');
        return of(null);
      }),
      finalize(() => {
        this.loading = false;
        console.log('✅ Carga de detalles de mantenimiento finalizada');
      })
    ).subscribe({
      next: (response: any) => {
        console.log('📦 Respuesta del servidor:', response);
        
        if (response && response.success) {
          this.maintenanceDetails = response.data || [];
          console.log('✅ Detalles de mantenimiento cargados:', this.maintenanceDetails.length);
          console.log('📋 Sample detail structure:', this.maintenanceDetails[0]);
          
          if (this.maintenanceDetails.length === 0) {
            console.log('ℹ️ No se encontraron detalles de mantenimiento');
          }
        } else if (response === null) {
          // Error ya manejado en catchError
          this.maintenanceDetails = [];
        } else {
          console.error('❌ Respuesta inválida:', response);
          this.errorMessage = response?.message || this.translateService.instant('maintenance.detail.list.error');
          this.maintenanceDetails = [];
        }
      },
      error: (error) => {
        console.error('❌ Error en subscribe:', error);
        this.maintenanceDetails = [];
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
        this.loadMaintenanceDetails();
      });
  }

  onClearSearch() {
    this.globalSearch = '';
    this.searchSubject.next(this.globalSearch);
  }

  performSearch() {
    this.loadMaintenanceDetails();
  }

  trackByMaintenanceDetail(index: number, detail: MaintenanceDetail): string | number {
    return detail.MaintenanceDetailId || index;
  }

  addMaintenanceDetail() {
    this.router.navigate(['/maintenance/detail/add', this.maintenanceHeaderId]);
  }

  editMaintenanceDetail(id: string) {
    this.closeMenuWithDelay(); // Close the dropdown menu before navigating
    setTimeout(() => {
      this.router.navigate(['/maintenance/detail/edit', id]);
    }, 150);
  }

  viewMaintenanceDetail(id: string) {
    this.closeMenuWithDelay(); // Close the dropdown menu before navigating
    setTimeout(() => {
      this.router.navigate(['/maintenance/detail/view', id]);
    }, 150);
  }

  confirmDelete(detail: string) {
    console.log('🗑️ Confirm delete for detail:', detail);
    this.closeMenu(); // Close the dropdown menu before showing delete confirmation
    this.detailToDelete = detail;
    this.showDeleteAlert = true;
  }

  onDeleteAlertDismiss() {
    this.showDeleteAlert = false;
    this.detailToDelete = '';
  }

  deleteMaintenanceDetail() {
    if (!this.detailToDelete) {
      this.alertService.showError('No se seleccionó ningún detalle para eliminar');
      return;
    }
 

    if (!this.detailToDelete) {
      console.error('❌ No valid ID found for deletion:', this.detailToDelete);
      this.alertService.showError('No se pudo encontrar el ID del detalle para eliminar');
      return;
    }

    console.log('🗑️ Deleting maintenance detail with ID:', this.detailToDelete);
    this.loading = true;
    
    this.maintenanceDetailService.deleteMaintenanceDetail(this.detailToDelete).pipe(
      catchError(error => {
        console.error('❌ Error deleting maintenance detail:', error);
        this.alertService.showError(this.translateService.instant('maintenance.detail.delete.error'));
        return of(null);
      }),
      finalize(() => {
        this.loading = false;
        this.showDeleteAlert = false;
        this.detailToDelete = '';
      })
    ).subscribe({
      next: (response: any) => {
        console.log('📦 Delete response:', response);
        if (response && response.success) {
          this.alertService.showSuccess(this.translateService.instant('maintenance.detail.delete.success'));
          // Remove the deleted detail from the list using the same ID logic
          this.maintenanceDetails = this.maintenanceDetails.filter(d => {
            const currentId = d.MaintenanceDetailId || d.id  || (d as any).Id;
            return currentId !== this.detailToDelete;
          });
          console.log('✅ Detail removed from list. Remaining items:', this.maintenanceDetails.length);
        } else {
          console.error('❌ Delete failed:', response);
          this.alertService.showError(response?.message || this.translateService.instant('maintenance.detail.delete.error'));
        }
      },
      error: (error) => {
        console.error('❌ Delete subscription error:', error);
        this.alertService.showError('Error al eliminar el detalle de mantenimiento');
      }
    });
  }

  // Dropdown menu methods
  toggleMenu(event: any, detailId: string) {
    event.stopPropagation();
    this.menuEvent = event;
    this.openMenuId = this.openMenuId === detailId ? null : detailId;
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

  goBack() {
    this.router.navigate(['/maintenance/list']);
  }

  getMaintenanceTypeColor(maintenanceTypeName: string): string {
    const colors: { [key: string]: string } = {
      'Preventive': 'success',
      'Corrective': 'warning',
      'Predictive': 'primary',
      'Emergency': 'danger'
    };
    return colors[maintenanceTypeName] || 'medium';
  }

  getStatusColor(statusName: string): string {
    const colors: { [key: string]: string } = {
      'Pending': 'warning',
      'In Progress': 'primary',
      'Completed': 'success',
      'Cancelled': 'danger'
    };
    return colors[statusName] || 'medium';
  }

  ngOnDestroy() {
    this.searchSubject.complete();
  }
}
