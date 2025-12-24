import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { AlertService } from '../../../../utils/alert.service';
import { catchError, finalize, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { of, Subject } from 'rxjs';
import { MaintenancePart, MaintenancePartService } from 'src/app/utils/maintenancePart.service';

@Component({
  selector: 'app-part-detail-list',
  templateUrl: './part-detail-list.component.html',
  styleUrls: ['./part-detail-list.component.scss'],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule,
    TranslateModule,
    FormsModule
  ],
  providers: [
    MaintenancePartService,
    AlertService
  ],
  standalone: true
})
export class PartDetailListComponent implements OnInit, OnDestroy {
  maintenanceParts: MaintenancePart[] = [];
  loading = false;
  errorMessage = '';
  globalSearch = '';
  maintenanceHeaderId: string = '';
  
  // Delete confirmation properties
  showDeleteAlert = false;
  partToDelete: string = '';
  deleteAlertButtons = [
    {
      text: this.translateService.instant('common_cancel'),
      role: 'cancel',
      cssClass: 'alert-button-cancel'
    },
    {
      text: this.translateService.instant('common_delete'),
      role: 'destructive',
      cssClass: 'alert-button-delete',
      handler: () => {
        this.deleteMaintenancePart();
      }
    }
  ];

  // Dropdown menu properties
  openMenuId: string | null = null;
  menuEvent: any = null;

  // Search debounce subject
  private searchSubject = new Subject<string>();

  constructor(
    private maintenancePartService: MaintenancePartService,
    private router: Router,
    private route: ActivatedRoute,
    private alertService: AlertService,
    private translateService: TranslateService
  ) {}

  ngOnInit() {
    console.log('🚀 PartDetailListComponent inicializado');
    this.route.params.subscribe(params => {
      this.maintenanceHeaderId = params['id'];
      if (this.maintenanceHeaderId) {
        this.loadMaintenanceParts();
      }
    });
    this.setupDebouncedSearch();
  }

  ionViewDidEnter() {
    this.setupDebouncedSearch();
    if (this.maintenanceHeaderId) {
      this.loadMaintenanceParts();
    }
  }

  loadMaintenanceParts() {
    if (!this.maintenanceHeaderId) {
      console.warn('⚠️ No maintenance header ID provided');
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    console.log('🔄 Cargando repuestos...', { headerId: this.maintenanceHeaderId });
    
    this.maintenancePartService.getByHeader(this.maintenanceHeaderId).pipe(
      catchError(error => {
        console.error('❌ Error loading parts:', error);
        this.errorMessage = this.translateService.instant('maintenance_parts_list_error');
        return of(null);
      }),
      finalize(() => {
        this.loading = false;
        console.log('✅ Carga de repuestos finalizada');
      })
    ).subscribe({
      next: (response: any) => {
        console.log('📦 Respuesta del servidor:', response);
        
        if (response && response.success) {
          this.maintenanceParts = response.data || [];
          console.log('✅ Repuestos cargados:', this.maintenanceParts.length);
          console.log('📋 Sample part structure:', this.maintenanceParts[0]);
          
          if (this.maintenanceParts.length === 0) {
            console.log('ℹ️ No se encontraron repuestos');
          }
        } else if (response === null) {
          // Error ya manejado en catchError
          this.maintenanceParts = [];
        } else {
          console.error('❌ Respuesta inválida:', response);
          this.errorMessage = response?.message || this.translateService.instant('maintenance_parts_list_error');
          this.maintenanceParts = [];
        }
      },
      error: (error) => {
        console.error('❌ Error en subscribe:', error);
        this.maintenanceParts = [];
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
        this.loadMaintenanceParts();
      });
  }

  onClearSearch() {
    this.globalSearch = '';
    this.searchSubject.next(this.globalSearch);
  }

  performSearch() {
    this.loadMaintenanceParts();
  }

  trackByMaintenancePart(index: number, part: MaintenancePart): string | number {
    return part.id || index;
  }

  addMaintenancePart() {
    this.router.navigate(['/maintenance/part/add', this.maintenanceHeaderId]);
  }

  editMaintenancePart(id: string) {
    this.closeMenuWithDelay(); // Close the dropdown menu before navigating
    setTimeout(() => {
      this.router.navigate(['/maintenance/part/edit', id]);
    }, 150);
  }

  viewMaintenancePart(id: string) {
    this.closeMenuWithDelay(); // Close the dropdown menu before navigating
    setTimeout(() => {
      this.router.navigate(['/maintenance/part/view', id]);
    }, 150);
  }

  confirmDelete(partId: string) {
    console.log('🗑️ Confirm delete for part:', partId);
    this.closeMenu(); // Close the dropdown menu before showing delete confirmation
    this.partToDelete = partId;
    this.showDeleteAlert = true;
  }

  onDeleteAlertDismiss() {
    this.showDeleteAlert = false;
    this.partToDelete = '';
  }

  deleteMaintenancePart() {
    if (!this.partToDelete) {
      this.alertService.showError(this.translateService.instant('maintenance_parts_delete_noSelection'));
      return;
    } 

    console.log('🗑️ Deleting maintenance part with ID:', this.partToDelete);
    this.loading = true;
    
    this.maintenancePartService.deleteMaintenancePart(this.partToDelete).pipe(
      catchError(error => {
        console.error('❌ Error deleting part:', error);
        this.alertService.showError(this.translateService.instant('maintenance_parts_delete_error'));
        return of(null);
      }),
      finalize(() => {
        this.loading = false;
        this.showDeleteAlert = false;
        this.partToDelete = '';
      })
    ).subscribe({
      next: (response: any) => {
        console.log('📦 Delete response:', response);
        if (response && response.success) {
          this.alertService.showSuccess(this.translateService.instant('maintenance_parts_delete_success'));
          // Remove the deleted part from the list
          this.maintenanceParts = this.maintenanceParts.filter(p => p.id !== this.partToDelete);
          console.log('✅ Part removed from list. Remaining items:', this.maintenanceParts.length);
        } else {
          console.error('❌ Delete failed:', response);
          this.alertService.showError(response?.message || this.translateService.instant('maintenance_parts_delete_error'));
        }
      },
      error: (error) => {
        console.error('❌ Delete subscription error:', error);
        this.alertService.showError(this.translateService.instant('maintenance_parts_delete_error'));
      }
    });
  }

  // Dropdown menu methods
  toggleMenu(event: any, partId: string) {
    event.stopPropagation();
    this.menuEvent = event;
    this.openMenuId = this.openMenuId === partId ? null : partId;
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

  getTotalCost(part: MaintenancePart): number {
    return part.quantity * part.cost;
  }

  ngOnDestroy() {
    this.searchSubject.complete();
  }
}
