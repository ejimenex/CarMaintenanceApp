import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MaintenancePart, MaintenancePartService } from '../../../../utils/maintenancePart.service';
import { CatalogService, Catalog } from '../../../../utils/catalog.service';
import { AlertService } from '../../../../utils/alert.service';
import { AppFooterComponent } from '../../../../shared/components/app-footer';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-part-add',
  templateUrl: './part-add.component.html',
  styleUrls: ['./part-add.component.scss'],
  imports: [
    CommonModule,
    IonicModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    AppFooterComponent
  ],
  providers: [
    MaintenancePartService,
    CatalogService,
    AlertService
  ],
  standalone: true
})
export class PartAddComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  loadingCatalogs = false;
  maintenanceHeaderId: string = '';
  unitOfMeasures: Catalog[] = [];

  constructor(
    private maintenancePartService: MaintenancePartService,
    private catalogService: CatalogService,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private alertService: AlertService,
    private translateService: TranslateService
  ) {}

  ngOnInit() {
    // Get maintenance header ID from route
    this.route.params.subscribe(params => {
      this.maintenanceHeaderId = params['id'];
      if (!this.maintenanceHeaderId) {
        this.alertService.showError(this.translateService.instant('maintenance_parts_add_error_noMaintenanceId'));
        this.router.navigate(['/maintenance/list']);
      }
    });

    this.initializeForm();
    this.loadCatalogs();
  }

  initializeForm() {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      quantity: [null, [Validators.required, Validators.min(0.01)]],
      cost: [null, [Validators.required, Validators.min(0)]],
      unitOfMeasure: ['', Validators.required]
    });

    // Calculate total cost when quantity or cost changes
    this.form.get('quantity')?.valueChanges.subscribe(() => {
      this.calculateTotalCost();
    });

    this.form.get('cost')?.valueChanges.subscribe(() => {
      this.calculateTotalCost();
    });
  }

  loadCatalogs() {
    this.loadingCatalogs = true;
    
    this.catalogService.getUnitOfMeasure().pipe(
      catchError(error => {
        console.error('Error loading unit of measures:', error);
        this.alertService.showError(this.translateService.instant('maintenance_parts_add_error_loadCatalogs'));
        return of(null);
      }),
      finalize(() => {
        this.loadingCatalogs = false;
      })
    ).subscribe({
      next: (response: any) => {
        if (response && response.success) {
          this.unitOfMeasures = response.data || [];
          console.log('✅ Unit of measures loaded:', this.unitOfMeasures.length);
        } else {
          this.alertService.showError(response?.message || this.translateService.instant('maintenance_parts_add_error_loadCatalogs'));
        }
      }
    });
  }

  calculateTotalCost(): number {
    const quantity = this.form.get('quantity')?.value || 0;
    const cost = this.form.get('cost')?.value || 0;
    return quantity * cost;
  }

  async savePart() {
    if (!this.form.valid) {
      this.markFormGroupTouched(this.form);
      this.alertService.showError(this.translateService.instant('maintenance_parts_add_error_invalidForm'));
      return;
    }

    if (!this.maintenanceHeaderId) {
      this.alertService.showError(this.translateService.instant('maintenance_parts_add_error_noMaintenanceId'));
      return;
    }

    this.loading = true;
    const formData = this.form.value;
    
    const partData: any = {
      name: formData.name,
      quantity: formData.quantity,
      cost: formData.cost,
      unitOfMeasure: formData.unitOfMeasure,
      totalCost: this.calculateTotalCost(),
      processHeaderId: this.maintenanceHeaderId
    };

    console.log('💾 Saving part:', partData);

    this.maintenancePartService.createMaintenancePart(partData).pipe(
      catchError(error => {
        console.error('Error creating part:', error);
        this.alertService.showError(this.translateService.instant('maintenance_parts_add_error_create'));
        return of(null);
      }),
      finalize(() => {
        this.loading = false;
      })
    ).subscribe({
      next: (response: any) => {
        if (response && response.success) {
          this.alertService.showSuccess(this.translateService.instant('maintenance_parts_add_success'));
          this.router.navigate(['/maintenance/part/list', this.maintenanceHeaderId]);
        } else {
          this.alertService.showError(response?.message || this.translateService.instant('maintenance_parts_add_error_create'), response?.errors);
        }
      }
    });
  }

  getFieldError(fieldName: string): string {
    const control = this.form.get(fieldName);
    if (control?.errors && control.touched) {
      if (control.errors['required']) {
        return this.translateService.instant('maintenance_parts_add_error_required');
      }
      if (control.errors['minlength']) {
        const requiredLength = control.errors['minlength'].requiredLength;
        return this.translateService.instant('maintenance.parts.add.error.minLength', { length: requiredLength });
      }
      if (control.errors['min']) {
        const min = control.errors['min'].min;
        return this.translateService.instant('maintenance.parts.add.error.min', { min: min });
      }
    }
    return '';
  }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      } else {
        control?.markAsTouched();
      }
    });
  }

  cancelForm() {
    if (this.form.dirty) {
      this.alertService.showConfirm({
        message: this.translateService.instant('maintenance_parts_add_cancelConfirm'),
        confirmText: this.translateService.instant('common_confirm'),
        cancelText: this.translateService.instant('common_cancel'),
        cssClass: 'alert-button-cancel'
      }).then((result) => {
        if (result) {
          this.resetForm();
          this.router.navigate(['/maintenance/part/list', this.maintenanceHeaderId]);
        }
      });
    } else {
      this.router.navigate(['/maintenance/part/list', this.maintenanceHeaderId]);
    }
  }

  exitScreen() {
    if (this.form.dirty) {
      this.alertService.showConfirm({
        message: this.translateService.instant('maintenance_parts_add_exitConfirm'),
        confirmText: this.translateService.instant('common_confirm'),
        cancelText: this.translateService.instant('common_cancel'),
        cssClass: 'alert-button-cancel'
      }).then((result) => {
        if (result) {
          this.resetForm();
          this.router.navigate(['/maintenance/part/list', this.maintenanceHeaderId]);
        }
      });
    } else {
      this.router.navigate(['/maintenance/part/list', this.maintenanceHeaderId]);
    }
  }

  private resetForm() {
    this.form.reset();
    this.form.markAsPristine();
    this.form.markAsUntouched();
  }
}

