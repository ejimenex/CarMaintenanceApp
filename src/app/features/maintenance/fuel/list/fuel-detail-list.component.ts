import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { ProcessFuelDetailService, ProccessFuelDetail } from '../../../../utils/processFuelDetail.service';
import { AlertService } from '../../../../utils/alert.service';
import { catchError, finalize } from 'rxjs/operators';
import { of, Subject } from 'rxjs';

@Component({
  selector: 'app-fuel-detail-list',
  templateUrl: './fuel-detail-list.component.html',
  styleUrls: ['./fuel-detail-list.component.scss'],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule,
    TranslateModule,
    FormsModule
  ],
  providers: [
    ProcessFuelDetailService,
    AlertService
  ],
  standalone: true
})
export class FuelDetailListComponent implements OnInit, OnDestroy {
  fuelDetails: ProccessFuelDetail[] = [];
  loading = false;
  errorMessage = '';
  maintenanceId: string = '';

  // Delete confirmation properties
  showDeleteAlert = false;
  fuelDetailToDelete: ProccessFuelDetail | null = null;
  deleteAlertButtons = [
    {
      text: this.translateService.instant('common.cancel'),
      role: 'cancel',
      cssClass: 'alert-button-cancel'
    },
    {
      text: this.translateService.instant('fuel.actions.delete'),
      role: 'destructive',
      cssClass: 'alert-button-delete',
      handler: () => {
        this.deleteFuelDetail();
      }
    }
  ];

  // Dropdown menu properties
  openMenuId: string | null = null;
  menuEvent: any = null;

  constructor(
    private processFuelDetailService: ProcessFuelDetailService,
    private router: Router,
    private route: ActivatedRoute,
    private alertService: AlertService,
    private translateService: TranslateService
  ) {}

  ngOnInit() {
    // Get the maintenance ID from route parameters
    this.maintenanceId = this.route.snapshot.paramMap.get('id') || '';
    
    if (!this.maintenanceId) {
      this.alertService.showError(this.translateService.instant('fuel.error.invalidMaintenanceId'));
      this.router.navigate(['/maintenance']);
      return;
    }

    console.log('🚀 FuelDetailListComponent inicializado para maintenance ID:', this.maintenanceId);
    this.loadFuelDetails();
  }
  ionViewDidEnter() {
    this.loadFuelDetails();
  }
  loadFuelDetails() {
    this.loading = true;
    this.errorMessage = '';
    console.log('🔄 Cargando detalles de combustible para maintenance ID:', this.maintenanceId);
    
    this.processFuelDetailService.getByHeader(this.maintenanceId).pipe(
      catchError(error => {
        console.error('❌ Error loading fuel details:', error);
        this.errorMessage = this.translateService.instant('fuel.list.error');
        return of(null);
      }),
      finalize(() => {
        this.loading = false;
        console.log('✅ Carga de detalles de combustible finalizada');
      })
    ).subscribe({
      next: (response: any) => {
        console.log('📦 Respuesta del servidor:', response);
        
        if (response && response.success) {
          this.fuelDetails = response.data || [];
          console.log('✅ Detalles de combustible cargados:', this.fuelDetails.length);
          
          if (this.fuelDetails.length === 0) {
            console.log('ℹ️ No se encontraron detalles de combustible');
          }
        } else if (response === null) {
          this.fuelDetails = [];
        } else {
          console.error('❌ Respuesta inválida:', response);
          this.errorMessage = response?.message || this.translateService.instant('fuel.list.error');
          this.fuelDetails = [];
        }
      },
      error: (error) => {
        console.error('❌ Error en subscribe:', error);
        this.fuelDetails = [];
      }
    });
  }

  addFuelDetail() {
    this.router.navigate(['/maintenance/fuel/add', this.maintenanceId]);
  }

  editFuelDetail(fuelDetailId: string) {
    this.closeMenuWithDelay();
    setTimeout(() => {
      this.router.navigate(['/maintenance/fuel/edit', fuelDetailId]);
    }, 150);
  }

  viewFuelDetail(fuelDetailId: string) {
    this.closeMenuWithDelay();
    setTimeout(() => {
      this.router.navigate(['/maintenance/fuel/view', fuelDetailId]);
    }, 150);
  }

  confirmDelete(fuelDetail: ProccessFuelDetail) {
    this.closeMenu();
    this.fuelDetailToDelete = fuelDetail;
    this.showDeleteAlert = true;
  }

  onDeleteAlertDismiss() {
    this.showDeleteAlert = false;
    this.fuelDetailToDelete = null;
  }

  deleteFuelDetail() {
    if (!this.fuelDetailToDelete) {
      return;
    }

    this.loading = true;
    this.processFuelDetailService.deleteProcessHeader(this.fuelDetailToDelete.processHeaderId).pipe(
      catchError(error => {
        console.error('Error deleting fuel detail:', error);
        this.alertService.showError(this.translateService.instant('fuel.delete.error'));
        return of(null);
      }),
      finalize(() => {
        this.loading = false;
        this.showDeleteAlert = false;
        this.fuelDetailToDelete = null;
      })
    ).subscribe({
      next: (response: any) => {
        if (response && response.success) {
          this.alertService.showSuccess(this.translateService.instant('fuel.delete.success'));
          // Reload the list after deletion
          this.loadFuelDetails();
        } else {
          this.alertService.showError(response?.message || this.translateService.instant('fuel.delete.error'));
        }
      }
    });
  }

  // Dropdown menu methods
  toggleMenu(event: any, fuelDetailId: string) {
    event.stopPropagation();
    this.menuEvent = event;
    this.openMenuId = this.openMenuId === fuelDetailId ? null : fuelDetailId;
  }

  closeMenu() {
    this.openMenuId = null;
    this.menuEvent = null;
  }

  private closeMenuWithDelay() {
    this.closeMenu();
    setTimeout(() => {
      this.closeMenu();
    }, 100);
  }

  backToMaintenance() {
    this.router.navigate(['/maintenance']);
  }

  // Helper methods for display
  getFuelTypeLabel(fuelType: string): string {
    const types: { [key: string]: string } = {
      'GASOLINE': 'Gasolina',
      'DIESEL': 'Diésel',
      'LPG': 'Gas LP',
      'ELECTRIC': 'Eléctrico'
    };
    return types[fuelType] || fuelType;
  }

  calculateTotalCost(fuelAmount: number, fuelPrice: number): number {
    return fuelAmount * fuelPrice;
  }

  ngOnDestroy() {
    // Cleanup if needed
  }
}
