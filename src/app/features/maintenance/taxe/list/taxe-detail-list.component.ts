import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { ProcessTaxeDetailService, ProccessTaxeDetail } from '../../../../utils/processTaxeDetail.service';
import { AlertService } from '../../../../utils/alert.service';
import { catchError, finalize } from 'rxjs/operators';
import { of, Subject } from 'rxjs';

@Component({
  selector: 'app-taxe-detail-list',
  templateUrl: './taxe-detail-list.component.html',
  styleUrls: ['./taxe-detail-list.component.scss'],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule,
    TranslateModule,
    FormsModule
  ],
  providers: [
    TaxeDetailListComponent,
    AlertService
  ],
  standalone: true
})
export class TaxeDetailListComponent implements OnInit, OnDestroy {
  taxeDetails: ProccessTaxeDetail[] = [];
  loading = false;
  errorMessage = '';
  maintenanceId: string = '';

  // Delete confirmation properties
  showDeleteAlert = false;
  taxeDetailToDelete: ProccessTaxeDetail | null = null;
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
        this.deletetaxeDetail();
      }
    }
  ];

  // Dropdown menu properties
  openMenuId: string | null = null;
  menuEvent: any = null;

  constructor(
    private processtaxeDetailService: ProcessTaxeDetailService,
    private router: Router,
    private route: ActivatedRoute,
    private alertService: AlertService,
    private translateService: TranslateService
  ) {}

  ngOnInit() {
    // Get the maintenance ID from route parameters
    this.maintenanceId = this.route.snapshot.paramMap.get('id') || '';
    
    if (!this.maintenanceId) {
      this.alertService.showError(this.translateService.instant('taxe_error_invalidMaintenanceId'));
      this.router.navigate(['/maintenance']);
      return;
    }

    console.log('🚀 taxeDetailListComponent inicializado para maintenance ID:', this.maintenanceId);
    this.loadtaxeDetails();
  }
  ionViewDidEnter() {
    this.loadtaxeDetails();
  }
  loadtaxeDetails() {
    this.loading = true;
    this.errorMessage = '';
    console.log('🔄 Cargando detalles de seguros para maintenance ID:', this.maintenanceId);
    
    this.processtaxeDetailService.getByHeader(this.maintenanceId).pipe(
      catchError(error => {
        console.error('❌ Error loading taxe details:', error);
        this.errorMessage = this.translateService.instant('taxe_list_error');
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
          this.taxeDetails = response.data || [];
         
          
          if (this.taxeDetails.length === 0) {
            console.log('ℹ️ No se encontraron detalles de seguros');
          }
        } else if (response === null) {
          this.taxeDetails = [];
        } else {
          console.error('❌ Respuesta inválida:', response);
          this.errorMessage = response?.message || this.translateService.instant('taxe_list_error');
          this.taxeDetails = [];
        }
      },
      error: (error) => {
        console.error('❌ Error en subscribe:', error);
        this.taxeDetails = [];
      }
    });
  }

  addtaxeDetail() {
    this.router.navigate(['/maintenance/taxe/add', this.maintenanceId]);
  }

  edittaxeDetail(taxeDetailId: string) {
    this.closeMenuWithDelay();
    setTimeout(() => {
      this.router.navigate(['/maintenance/taxe/edit', taxeDetailId]);
    }, 150);
  }

  viewtaxeDetail(taxeDetailId: string) {
    this.closeMenuWithDelay();
    setTimeout(() => {
      this.router.navigate(['/maintenance/taxe/view', taxeDetailId]);
    }, 150);
  }

  confirmDelete(taxeDetail: ProccessTaxeDetail) {
    this.closeMenu();
    this.taxeDetailToDelete = taxeDetail;
    this.showDeleteAlert = true;
  }

  onDeleteAlertDismiss() {
    this.showDeleteAlert = false;
    this.taxeDetailToDelete = null;
  }

  deletetaxeDetail() {
    if (!this.taxeDetailToDelete) {
      return;
    }

    this.loading = true;
    this.processtaxeDetailService.deleteProcessHeader(this.taxeDetailToDelete.id).pipe(
      catchError(error => {
        console.error('Error deleting taxe detail:', error);
        this.alertService.showError(this.translateService.instant('taxe_delete_error'));
        return of(null);
      }),
      finalize(() => {
        this.loading = false;
        this.showDeleteAlert = false;
        this.taxeDetailToDelete = null;
      })
    ).subscribe({
      next: (response: any) => {
        if (response && response.success) {
          this.alertService.showSuccess(this.translateService.instant('taxe_delete_success'));
          // Reload the list after deletion
          this.loading = false;
          this.loadtaxeDetails();
        } else {
          this.alertService.showError(response?.message || this.translateService.instant('taxe_delete_error'));
        }
      }
    });
  }

  // Dropdown menu methods
  toggleMenu(event: any, taxeDetailId: string) {
    event.stopPropagation();
    this.menuEvent = event;
    this.openMenuId = this.openMenuId === taxeDetailId ? null : taxeDetailId;
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
