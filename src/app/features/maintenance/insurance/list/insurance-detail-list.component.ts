import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { ProcessInsuranceDetailService, ProccessInsuranceDetail } from '../../../../utils/processInsuranceDetail.service';
import { AlertService } from '../../../../utils/alert.service';
import { catchError, finalize } from 'rxjs/operators';
import { of, Subject } from 'rxjs';

@Component({
  selector: 'app-insurance-detail-list',
  templateUrl: './insurance-detail-list.component.html',
  styleUrls: ['./insurance-detail-list.component.scss'],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule,
    TranslateModule,
    FormsModule
  ],
  providers: [
    ProcessInsuranceDetailService,
    AlertService
  ],
  standalone: true
})
export class InsuranceDetailListComponent implements OnInit, OnDestroy {
  insuranceDetails: ProccessInsuranceDetail[] = [];
  loading = false;
  errorMessage = '';
  maintenanceId: string = '';

  // Delete confirmation properties
  showDeleteAlert = false;
  insuranceDetailToDelete: ProccessInsuranceDetail | null = null;
  deleteAlertButtons = [
    {
      text: this.translateService.instant('common.cancel'),
      role: 'cancel',
      cssClass: 'alert-button-cancel'
    },
    {
      text: this.translateService.instant('insurance.actions.delete'),
      role: 'destructive',
      cssClass: 'alert-button-delete',
      handler: () => {
        this.deleteInsuranceDetail();
      }
    }
  ];

  // Dropdown menu properties
  openMenuId: string | null = null;
  menuEvent: any = null;

  constructor(
    private processInsuranceDetailService: ProcessInsuranceDetailService,
    private router: Router,
    private route: ActivatedRoute,
    private alertService: AlertService,
    private translateService: TranslateService
  ) {}

  ngOnInit() {
    // Get the maintenance ID from route parameters
    this.maintenanceId = this.route.snapshot.paramMap.get('id') || '';
    
    if (!this.maintenanceId) {
      this.alertService.showError(this.translateService.instant('insurance.error.invalidMaintenanceId'));
      this.router.navigate(['/maintenance']);
      return;
    }

    console.log('🚀 InsuranceDetailListComponent inicializado para maintenance ID:', this.maintenanceId);
    this.loadInsuranceDetails();
  }
  ionViewDidEnter() {
    this.loadInsuranceDetails();
  }
  loadInsuranceDetails() {
    this.loading = true;
    this.errorMessage = '';
    console.log('🔄 Cargando detalles de seguros para maintenance ID:', this.maintenanceId);
    
    this.processInsuranceDetailService.getByHeader(this.maintenanceId).pipe(
      catchError(error => {
        console.error('❌ Error loading insurance details:', error);
        this.errorMessage = this.translateService.instant('insurance.list.error');
        return of(null);
      }),
      finalize(() => {
        this.loading = false;
        console.log('✅ Carga de detalles de seguros finalizada');
      })
    ).subscribe({
      next: (response: any) => {
        console.log('📦 Respuesta del servidor:', response);
        
        if (response && response.success) {
          this.insuranceDetails = response.data || [];
          console.log('✅ Detalles de seguros cargados:', this.insuranceDetails.length);
          
          if (this.insuranceDetails.length === 0) {
            console.log('ℹ️ No se encontraron detalles de seguros');
          }
        } else if (response === null) {
          this.insuranceDetails = [];
        } else {
          console.error('❌ Respuesta inválida:', response);
          this.errorMessage = response?.message || this.translateService.instant('insurance.list.error');
          this.insuranceDetails = [];
        }
      },
      error: (error) => {
        console.error('❌ Error en subscribe:', error);
        this.insuranceDetails = [];
      }
    });
  }

  addInsuranceDetail() {
    this.router.navigate(['/maintenance/insurance/add', this.maintenanceId]);
  }

  editInsuranceDetail(insuranceDetailId: string) {
    this.closeMenuWithDelay();
    setTimeout(() => {
      this.router.navigate(['/maintenance/insurance/edit', insuranceDetailId]);
    }, 150);
  }

  viewInsuranceDetail(insuranceDetailId: string) {
    this.closeMenuWithDelay();
    setTimeout(() => {
      this.router.navigate(['/maintenance/insurance/view', insuranceDetailId]);
    }, 150);
  }

  confirmDelete(insuranceDetail: ProccessInsuranceDetail) {
    this.closeMenu();
    this.insuranceDetailToDelete = insuranceDetail;
    this.showDeleteAlert = true;
  }

  onDeleteAlertDismiss() {
    this.showDeleteAlert = false;
    this.insuranceDetailToDelete = null;
  }

  deleteInsuranceDetail() {
    if (!this.insuranceDetailToDelete) {
      return;
    }

    this.loading = true;
    this.processInsuranceDetailService.deleteProcessHeader(this.insuranceDetailToDelete.processHeaderId).pipe(
      catchError(error => {
        console.error('Error deleting insurance detail:', error);
        this.alertService.showError(this.translateService.instant('insurance.delete.error'));
        return of(null);
      }),
      finalize(() => {
        this.loading = false;
        this.showDeleteAlert = false;
        this.insuranceDetailToDelete = null;
      })
    ).subscribe({
      next: (response: any) => {
        if (response && response.success) {
          this.alertService.showSuccess(this.translateService.instant('insurance.delete.success'));
          // Reload the list after deletion
          this.loadInsuranceDetails();
        } else {
          this.alertService.showError(response?.message || this.translateService.instant('insurance.delete.error'));
        }
      }
    });
  }

  // Dropdown menu methods
  toggleMenu(event: any, insuranceDetailId: string) {
    event.stopPropagation();
    this.menuEvent = event;
    this.openMenuId = this.openMenuId === insuranceDetailId ? null : insuranceDetailId;
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
  formatCurrency(amount: number, currency: string): string {
    return `${currency} ${amount.toFixed(2)}`;
  }

  formatDate(date: Date | undefined): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString();
  }

  calculateCoverageDays(startDate: Date | undefined, endDate: Date | undefined): number {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  ngOnDestroy() {
    // Cleanup if needed
  }
}
