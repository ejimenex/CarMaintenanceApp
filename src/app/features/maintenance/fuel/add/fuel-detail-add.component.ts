import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ProcessFuelDetailService, ProccessFuelDetail } from '../../../../utils/processFuelDetail.service';
import { CatalogService, Catalog } from '../../../../utils/catalog.service';
import { AlertService } from '../../../../utils/alert.service';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-fuel-detail-add',
  templateUrl: './fuel-detail-add.component.html',
  styleUrls: ['./fuel-detail-add.component.scss'],
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    TranslateModule,
    RouterModule
  ],
  providers: [
    ProcessFuelDetailService,
    CatalogService,
    AlertService
  ],
  standalone: true
})
export class FuelDetailAddComponent implements OnInit {
  fuelDetailForm: FormGroup;
  loading = false;
  loadingCatalogs = false;
  maintenanceId: string = '';
  unitOfMeasures: Catalog[] = [];
  
  fuelTypes = [
    { value: 'GASOLINEPREMIUN', label: 'PremiumFuel' },
    { value: 'GASOLINEREGULAR', label: 'RegularFuel' },
    { value: 'DIESEL', label: 'Diésel' },
    { value: 'LPG', label: 'Gas LP' },
    { value: 'ELECTRIC', label: 'ElectricFuel' }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private processFuelDetailService: ProcessFuelDetailService,
    private catalogService: CatalogService,
    private router: Router,
    private route: ActivatedRoute,
    private alertService: AlertService,
    private translateService: TranslateService
  ) {
    this.fuelDetailForm = this.createForm();
  }

  ngOnInit() {
    // Get the maintenance ID from route parameters
    this.maintenanceId = this.route.snapshot.paramMap.get('id') || '';
    
    if (!this.maintenanceId) {
      this.alertService.showError(this.translateService.instant('fuel.add.error.invalidMaintenanceId'));
      this.router.navigate(['/maintenance']);
      return;
    }

    console.log('🚀 FuelDetailAddComponent inicializado para maintenance ID:', this.maintenanceId);
    this.loadUnitOfMeasures();
  }

  private createForm(): FormGroup {
    return this.formBuilder.group({
      fuelType: ['', Validators.required],
      unitOfMeasureId: ['', Validators.required],
      fuelAmount: ['', [Validators.required, Validators.min(0.01)]],
      fuelPrice: ['', [Validators.min(0)]],
      notes: ['']
    });
  }

  private loadUnitOfMeasures() {
    this.loadingCatalogs = true;
    console.log('🔄 Cargando unidades de medida...');

    this.catalogService.getUnitOfMeasure().pipe(
      catchError(error => {
        console.error('Error loading unit of measures:', error);
        this.alertService.showError(this.translateService.instant('fuel.form.errors.loadUnitMeasures'));
        return of(null);
      }),
      finalize(() => {
        this.loadingCatalogs = false;
      })
    ).subscribe({
      next: (response: any) => {
        if (response && response.success) {
          this.unitOfMeasures = response.data || [];
          console.log('✅ Unidades de medida cargadas:', this.unitOfMeasures);
        } else {
          this.alertService.showError(response?.message || this.translateService.instant('fuel.form.errors.loadUnitMeasures'));
        }
      }
    });
  }

  async saveFuelDetail() {
    if (this.fuelDetailForm.valid) {
      this.loading = true;
      
      const formValue = this.fuelDetailForm.value;
      
      // Find the selected unit of measure to get its name
      const selectedUnit = this.unitOfMeasures.find(unit => unit.id === formValue.unitOfMeasureId);
      
      // Calculate total cost if both amount and price are provided
      const totalCost = (formValue.fuelAmount && formValue.fuelPrice) 
        ? formValue.fuelAmount * formValue.fuelPrice 
        : undefined;

      const fuelDetailData: ProccessFuelDetail = {
        processHeaderId: this.maintenanceId,
        unitOfMeasureId: formValue.unitOfMeasureId,
        unitOfMeasureName: selectedUnit?.name || '',
        fuelType: formValue.fuelType,
        fuelAmount: parseFloat(formValue.fuelAmount),
        fuelPrice: formValue.fuelPrice ? parseFloat(formValue.fuelPrice) : undefined,
        totalCost: totalCost,
        notes: formValue.notes || ''
      };

      this.processFuelDetailService.createProcessHeader(fuelDetailData).pipe(
        catchError(error => {
          console.error('Error creating fuel detail:', error);
          this.alertService.showError(this.translateService.instant('fuel.add.error'));
          return of(null);
        }),
        finalize(() => {
          this.loading = false;
        })
      ).subscribe({
        next: (response: any) => {
          if (response && response.success) {
            this.alertService.showSuccess(this.translateService.instant('fuel.add.success'));
            this.router.navigate(['/maintenance/fuel/list', this.maintenanceId]);
          } else {
            this.alertService.showError(response.message || 'An error occurred', response.errors);
          }
        }
      });
    } else {
      this.markFormGroupTouched();
      this.alertService.showError(this.translateService.instant('fuel.form.errors.invalidForm'));
    }
  }

  private markFormGroupTouched() {
    Object.keys(this.fuelDetailForm.controls).forEach(field => {
      const control = this.fuelDetailForm.get(field);
      control?.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string {
    const field = this.fuelDetailForm.get(fieldName);
    if (field && field.errors && field.touched) {
      if (field.errors['required']) {
        return this.translateService.instant('fuel.form.errors.required');
      }
      if (field.errors['min']) {
        return this.translateService.instant('fuel.form.errors.minValue', { 
          min: field.errors['min'].min 
        });
      }
    }
    return '';
  }

  // Helper method to calculate total cost in real-time
  calculateTotalCost(): number {
    const fuelAmount = this.fuelDetailForm.get('fuelAmount')?.value;
    const fuelPrice = this.fuelDetailForm.get('fuelPrice')?.value;
    
    if (fuelAmount && fuelPrice && fuelAmount > 0 && fuelPrice > 0) {
      return fuelAmount * fuelPrice;
    }
    return 0;
  }

  cancelForm() {
    this.router.navigate(['/maintenance/fuel/list', this.maintenanceId]);
  }

  exitScreen() {
    this.router.navigate(['/maintenance']);
  }
}
