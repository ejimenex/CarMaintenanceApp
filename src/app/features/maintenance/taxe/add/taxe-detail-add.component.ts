import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ProcessTaxeDetailService, ProccessTaxeDetail } from '../../../../utils/processTaxeDetail.service';
import { AppFooterComponent } from '../../../../shared/components/app-footer/app-footer.component';
import { AlertService } from '../../../../utils/alert.service';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import { Catalog, CatalogService } from 'src/app/utils/catalog.service';

@Component({
  selector: 'app-taxe-detail-add',
  templateUrl: './taxe-detail-add.component.html',
  styleUrls: ['./taxe-detail-add.component.scss'],
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    TranslateModule,
    RouterModule,
    AppFooterComponent
  ],
  providers: [
    ProcessTaxeDetailService,
    CatalogService,
    AlertService
  ],
  standalone: true
})
export class taxeDetailAddComponent implements OnInit {
  taxeDetailForm: FormGroup;
  loading = false;
  loadingCatalogs = false;
  maintenanceId: string = '';
  currencies: Catalog[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private processtaxeDetailService: ProcessTaxeDetailService,
    private catalogService: CatalogService,
    private router: Router,
    private route: ActivatedRoute,
    private alertService: AlertService,
    private translateService: TranslateService
  ) {
    this.taxeDetailForm = this.createForm();
  }

  ngOnInit() {
    // Get the maintenance ID from route parameters
    this.maintenanceId = this.route.snapshot.paramMap.get('id') || '';
    
    if (!this.maintenanceId) {
      this.alertService.showError(this.translateService.instant('taxe_add_error_invalidMaintenanceId'));
      this.router.navigate(['/maintenance']);
      return;
    }
    this.loadCurrencies()
  }

  private createForm(): FormGroup {
    return this.formBuilder.group({
     
      description: ['',[Validators.required,]],
      amount: ['', [Validators.required, Validators.min(0.01)]],
      currency: ['USD', Validators.required]
    });
  }

  private loadCurrencies() {
    this.loadingCatalogs = true;
    console.log('🔄 Cargando monedas...');

    this.catalogService.getCurrency().pipe(
      catchError(error => {
        console.error('Error loading currencies:', error);
        this.alertService.showError(this.translateService.instant('taxe_form_errors_loadCurrencies'));
        return of(null);
      }),
      finalize(() => {
        this.loadingCatalogs = false;
      })
    ).subscribe({
      next: (response: any) => {
        if (response && response.success) {
          this.currencies = response.data || [];
          console.log('✅ Monedas cargadas:', this.currencies);
          
          // Set default currency if available
          if (this.currencies.length > 0) {
            const defaultCurrency = this.currencies.find(c => c.code === 'USD') || this.currencies[0];
            this.taxeDetailForm.patchValue({
              currency: defaultCurrency.code
            });
          }
        } else {
          this.alertService.showError(response?.message || this.translateService.instant('taxe_form_errors_loadCurrencies'));
        }
      }
    });
  }

  async savetaxeDetail() {
    if (this.taxeDetailForm.valid) {
      this.loading = true;
      
      const formValue = this.taxeDetailForm.value;

      const taxeDetailData: ProccessTaxeDetail = {
        id: '',
        processHeaderId: this.maintenanceId,
        description: formValue.description,       
        amount: formValue.amount ? parseFloat(formValue.amount) : 0,       
        currency: formValue.currency
      };

      this.processtaxeDetailService.createProcessHeader(taxeDetailData).pipe(
        catchError(error => {
          console.error('Error creating taxe detail:', error);
          this.alertService.showError(this.translateService.instant('taxe_add_error'));
          return of(null);
        }),
        finalize(() => {
          this.loading = false;
        })
      ).subscribe({
        next: (response: any) => {
          if (response && response.success) {
            this.alertService.showSuccess(this.translateService.instant('taxe_add_success'));
            this.router.navigate(['/maintenance/taxe/list', this.maintenanceId]);
          } else {
            this.alertService.showError(response.message || 'An error occurred', response.errors);
          }
        }
      });
    } else {
      this.markFormGroupTouched();
      this.alertService.showError(this.translateService.instant('taxe_form_errors_invalidForm'));
    }
  }

  private markFormGroupTouched() {
    Object.keys(this.taxeDetailForm.controls).forEach(field => {
      const control = this.taxeDetailForm.get(field);
      control?.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string {
    const field = this.taxeDetailForm.get(fieldName);
    if (field && field.errors && field.touched) {
      if (field.errors['required']) {
        return this.translateService.instant('taxe_form_errors_required');
      }
      if (field.errors['min']) {
        return this.translateService.instant('taxe.form.errors.minValue', { 
          min: field.errors['min'].min 
        });
      }
    }
    return '';
  }

  // Helper method to calculate coverage duration
  calculateCoverageDuration(): number {
    const startDate = this.taxeDetailForm.get('coverageStartDate')?.value;
    const endDate = this.taxeDetailForm.get('coverageEndDate')?.value;
    
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
    return 0;
  }

  // Helper method to format currency display
  formatCurrencyDisplay(amount: number, currency: string): string {
    return `${currency} ${amount.toFixed(2)}`;
  }

  cancelForm() {
    this.router.navigate(['/maintenance/taxe/list', this.maintenanceId]);
  }

  exitScreen() {
    this.router.navigate(['/maintenance']);
  }
}
