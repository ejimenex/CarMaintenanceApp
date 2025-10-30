import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { ProcessHeaderService, ProcessHeaderGetRequest } from '../../../utils/processHeader.service';
import { AlertService } from '../../../utils/alert.service';
import { catchError, finalize, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { of, Subject } from 'rxjs';

@Component({
  selector: 'app-maintenance-list',
  templateUrl: './maintenance-list.component.html',
  styleUrls: ['./maintenance-list.component.scss'],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule,
    TranslateModule,
    FormsModule
  ],
  providers: [
    ProcessHeaderService,
    AlertService
  ],
  standalone: true
})
export class MaintenanceListComponent implements OnInit, OnDestroy {
  maintenances: ProcessHeaderGetRequest[] = [];
  loading = false;
  errorMessage = '';
  currentPage = 1;
  globalSearch = '';
  totalPages = 1;
  totalItems = 0;
  hasMoreData = true;
  
  // Delete confirmation properties
  showDeleteAlert = false;
  maintenanceToDelete: ProcessHeaderGetRequest | null = null;
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
        this.deleteMaintenance();
      }
    }
  ];

  // Dropdown menu properties
  openMenuId: string | null = null;
  menuEvent: any = null;

  // Search debounce subject
  private searchSubject = new Subject<string>();

  constructor(
    private processHeaderService: ProcessHeaderService,
    private router: Router,
    private alertService: AlertService,
    private translateService: TranslateService
  ) {}

  ngOnInit() {
    console.log('🚀 MaintenanceListComponent inicializado');
    this.checkServiceConnection();
    this.loadMaintenances();
    this.setupDebouncedSearch();
  }
  ionViewDidEnter() {
  this.setupDebouncedSearch();
  this.loadMaintenances();
}
  checkServiceConnection() {
    // Verificar que el servicio esté disponible
    console.log('🔍 Verificando conexión del servicio...');
    console.log('ProcessHeaderService:', this.processHeaderService);
    
    // Verificar token de autenticación
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      const user = JSON.parse(currentUser);
      console.log('👤 Usuario autenticado:', user.username || 'Sin username');
      console.log('🔑 Token presente:', !!user.token);
    } else {
      console.warn('⚠️ No hay usuario autenticado');
    }
  }

  loadMaintenances(isLoadMore: boolean = false) {
    if (isLoadMore) {
      this.currentPage++;
    } else {
      this.currentPage = 1;
      this.maintenances = [];
    }

    this.loading = true;
    this.errorMessage = '';
    console.log('🔄 Cargando mantenimientos...', { page: this.currentPage, search: this.globalSearch });
    
    this.processHeaderService.getProcessHeaderPaged(this.currentPage, this.globalSearch).pipe(
      catchError(error => {
        console.error('❌ Error loading maintenances:', error);
        this.errorMessage = this.translateService.instant('maintenance.list.error');
        return of(null);
      }),
      finalize(() => {
        this.loading = false;
        console.log('✅ Carga de mantenimientos finalizada');
      })
    ).subscribe({
      next: (response: any) => {
        console.log('📦 Respuesta del servidor:', response);
        
        if (response && response.success) {
          const responseData = response.data as any;
          const newItems = responseData.items || responseData || [];
          
          if (isLoadMore) {
            this.maintenances = [...this.maintenances, ...newItems];
          } else {
            this.maintenances = newItems;
          }
          
          this.totalItems = responseData?.totalCount || 0;
          this.totalPages = responseData?.totalPages || 1;
          this.hasMoreData = this.currentPage < this.totalPages;
          
          console.log('✅ Mantenimientos cargados:', this.maintenances.length);
          
          if (this.maintenances.length === 0) {
            console.log('ℹ️ No se encontraron mantenimientos');
          }
        } else if (response === null) {
          // Error ya manejado en catchError
          this.maintenances = [];
        } else {
          console.error('❌ Respuesta inválida:', response);
          this.errorMessage = response?.message || this.translateService.instant('maintenance.list.error');
          this.maintenances = [];
        }
      },
      error: (error) => {
        console.error('❌ Error en subscribe:', error);
        this.maintenances = [];
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
        this.loadMaintenances();
      });
  }

  onClearSearch() {
    this.globalSearch = '';
    this.searchSubject.next(this.globalSearch);
  }

  performSearch() {
    this.currentPage = 1;
    this.loadMaintenances();
  }

  loadMore(event: any) {
    if (this.hasMoreData && !this.loading) {
      this.loadMaintenances(true);
    }
    event.target.complete();
  }

  trackByMaintenance(index: number, maintenance: ProcessHeaderGetRequest): string | number {
    return maintenance.id || index;
  }

  addMaintenance() {
    this.router.navigate(['/maintenance/add']);
  }

  editMaintenance(id: string) {
    this.closeMenuWithDelay(); // Close the dropdown menu before navigating
    setTimeout(() => {
      this.router.navigate(['/maintenance/edit', id]);
    }, 150);
  }

  viewMaintenance(id: string) {
    this.closeMenuWithDelay(); // Close the dropdown menu before navigating
    setTimeout(() => {
      this.router.navigate(['/maintenance/view', id]);
    }, 150);
  }

  addFuelDetail(maintenance: any) {
    this.closeMenuWithDelay(); // Close the dropdown menu before navigating
    setTimeout(() => {
      if(maintenance.processType === 'FUEL') {
        this.router.navigate([`/maintenance/fuel/list`, maintenance.id]);}
        if(maintenance.processType === 'INSU') {
          this.router.navigate([`/maintenance/insurance/list`, maintenance.id]);
        }
        if(maintenance.processType === 'RETA') {
          this.router.navigate([`/maintenance/detail/list`, maintenance.id]);
        }
    }, 150);
  }

  confirmDelete(maintenance: ProcessHeaderGetRequest) {
    this.closeMenu(); // Close the dropdown menu before showing delete confirmation
    this.maintenanceToDelete = maintenance;
    this.showDeleteAlert = true;
  }

  onDeleteAlertDismiss() {
    this.showDeleteAlert = false;
    this.maintenanceToDelete = null;
  }

  deleteMaintenance() {
    if (!this.maintenanceToDelete?.id) {
      return;
    }

    this.loading = true;
    this.processHeaderService.deleteProcessHeader(this.maintenanceToDelete.id).pipe(
      catchError(error => {
        console.error('Error deleting maintenance:', error);
        this.alertService.showError(this.translateService.instant('maintenance.delete.error'));
        return of(null);
      }),
      finalize(() => {
        this.loading = false;
        this.showDeleteAlert = false;
        this.maintenanceToDelete = null;
      })
    ).subscribe({
      next: (response: any) => {
        if (response && response.success) {
          this.alertService.showSuccess(this.translateService.instant('maintenance.delete.success'));
          // Remove the deleted maintenance from the list
          this.maintenances = this.maintenances.filter(m => m.id !== this.maintenanceToDelete?.id);
          this.totalItems--;
        } else {
          this.alertService.showError(response?.message || this.translateService.instant('maintenance.delete.error'));
        }
      }
    });
  }

  // Dropdown menu methods
  toggleMenu(event: any, maintenanceId: string) {
    event.stopPropagation();
    this.menuEvent = event;
    this.openMenuId = this.openMenuId === maintenanceId ? null : maintenanceId;
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

  getProcessTypeLabel(processType: string): string {
    return this.translateService.instant(`maintenance.processTypes.${processType}`) || processType;
  }

  getProcessTypeColor(processType: string): string {
    const colors: { [key: string]: string } = {
      'FUEL': 'warning',
      'PART': 'primary',
      'TALL': 'success',
      'INSU': 'secondary'
    };
    return colors[processType] || 'medium';
  }

  ngOnDestroy() {
    this.searchSubject.complete();
  }
}
