import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MaintenancePart, MaintenancePartService } from '../../../../utils/maintenancePart.service';
import { CatalogService, Catalog } from '../../../../utils/catalog.service';
import { AlertService } from '../../../../utils/alert.service';
import { AppFooterComponent } from '../../../../shared/components/app-footer/app-footer.component';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-part-edit',
  templateUrl: './part-edit.component.html',
  styleUrls: ['./part-edit.component.scss'],
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    TranslateModule,
    AppFooterComponent
  ],
  providers: [
    MaintenancePartService,
    CatalogService,
    AlertService
  ],
  standalone: true
})
export class PartEditComponent implements OnInit {
  form: FormGroup;
  loading = false;
  loadingCatalogs = false;
  partId: string | null = null;
  part: MaintenancePart | null = null;
  maintenanceHeaderId: string = '';

  // Catalog data
  unitOfMeasures: Catalog[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private maintenancePartService: MaintenancePartService,
    private catalogService: CatalogService,
    private alertService: AlertService,
    private router: Router,
    private route: ActivatedRoute,
    private translateService: TranslateService
  ) {
    this.form = this.createForm();
  }

  ngOnInit() {
    this.partId = this.route.snapshot.paramMap.get('id');
    if (this.partId) {
      this.loadPartData();
    } else {
      this.alertService.showError(this.translateService.instant('maintenance_parts_edit_error_noId'));
      this.router.navigate(['/maintenance/list']);
    }
    this.loadCatalogData();
  }

  private createForm(): FormGroup {
    const form = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      quantity: [null, [Validators.required, Validators.min(0.01)]],
      cost: [null, [Validators.required, Validators.min(0)]],
      unitOfMeasure: ['', Validators.required]
    });

    // Calculate total cost when quantity or cost changes
    form.get('quantity')?.valueChanges.subscribe(() => {
      this.calculateTotalCost();
    });

    form.get('cost')?.valueChanges.subscribe(() => {
      this.calculateTotalCost();
    });

    return form;
  }

  private loadPartData() {
    if (!this.partId) return;

    this.loading = true;
    console.log('🔄 Loading part data for ID:', this.partId);

    this.maintenancePartService.getByIdMaintenancePart(this.partId).pipe(
      catchError(error => {
        console.error('Error loading part:', error);
        this.alertService.showError(this.translateService.instant('maintenance_parts_edit_error_load'));
        return of(null);
      }),
      finalize(() => {
        this.loading = false;
      })
    ).subscribe({
      next: (response: any) => {
        console.log('📦 Part data response:', response);
        if (response && response.success && response.data) {
          this.part = response.data;
          // Store maintenance header ID for navigation
          if ((response.data as any).maintenanceHeaderId) {
            this.maintenanceHeaderId = (response.data as any).maintenanceHeaderId;
          }
          this.populateForm(response.data);
        } else {
          this.alertService.showError(response?.message || this.translateService.instant('maintenance_parts_edit_error_load'));
        }
      }
    });
  }

  private populateForm(part: MaintenancePart) {
    this.form.patchValue({
      name: part.name,
      quantity: part.quantity,
      cost: part.cost,
      unitOfMeasure: part.unitOfMeasure
    });
    console.log('✅ Form populated with part data');
  }

  private loadCatalogData() {
    this.loadingCatalogs = true;

    this.catalogService.getUnitOfMeasure().pipe(
      catchError(error => {
        console.error('Error loading unit of measures:', error);
        this.alertService.showError(this.translateService.instant('maintenance_parts_edit_error_loadCatalogs'));
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
        }
      }
    });
  }

  calculateTotalCost(): number {
    const quantity = this.form.get('quantity')?.value || 0;
    const cost = this.form.get('cost')?.value || 0;
    return quantity * cost;
  }

  updatePart() {
    if (this.form.invalid || !this.partId) {
      this.markFormGroupTouched();
      this.alertService.showError(this.translateService.instant('maintenance_parts_edit_error_invalidForm'));
      return;
    }

    this.loading = true;
    const formData = this.form.value;
    
    const updateData: any = {
      id: this.partId,
      name: formData.name,
      quantity: formData.quantity,
      cost: formData.cost,
      unitOfMeasure: formData.unitOfMeasure,
      totalCost: this.calculateTotalCost()
    };

    // Add maintenanceHeaderId if available
    if (this.maintenanceHeaderId) {
      updateData.maintenanceHeaderId = this.maintenanceHeaderId;
    } else if (this.part && (this.part as any).maintenanceHeaderId) {
      updateData.maintenanceHeaderId = (this.part as any).maintenanceHeaderId;
      this.maintenanceHeaderId = (this.part as any).maintenanceHeaderId;
    }

    console.log('💾 Updating part:', updateData);

    this.maintenancePartService.editMaintenancePart(this.partId, updateData).pipe(
      catchError(error => {
        console.error('Error updating part:', error);
        this.alertService.showError(this.translateService.instant('maintenance_parts_edit_error_update'));
        return of(null);
      }),
      finalize(() => {
        this.loading = false;
      })
    ).subscribe({
      next: (response: any) => {
        console.log('📦 Update response:', response);
        if (response && response.success) {
          this.alertService.showSuccess(this.translateService.instant('maintenance_parts_edit_success'));
          if (this.maintenanceHeaderId) {
            this.router.navigate(['/maintenance/part/list', this.maintenanceHeaderId]);
          } else {
            this.router.navigate(['/maintenance/list']);
          }
        } else {
          this.alertService.showError(response?.message || this.translateService.instant('maintenance_parts_edit_error_update'), response?.errors);
        }
      }
    });
  }

  private markFormGroupTouched() {
    Object.keys(this.form.controls).forEach(key => {
      const control = this.form.get(key);
      control?.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string {
    const control = this.form.get(fieldName);
    if (control?.errors && control.touched) {
      if (control.errors['required']) {
        return this.translateService.instant('maintenance_parts_edit_error_required');
      }
      if (control.errors['minlength']) {
        return this.translateService.instant('maintenance.parts.edit.error.minLength', { 
          length: control.errors['minlength'].requiredLength 
        });
      }
      if (control.errors['min']) {
        return this.translateService.instant('maintenance.parts.edit.error.min', { 
          min: control.errors['min'].min 
        });
      }
    }
    return '';
  }

  cancelForm() {
    if (this.form.dirty) {
      this.alertService.showConfirm({
        message: this.translateService.instant('maintenance_parts_edit_cancelConfirm'),
        confirmText: this.translateService.instant('common_confirm'),
        cancelText: this.translateService.instant('common_cancel'),
        cssClass: 'alert-button-cancel'
      }).then((result) => {
        if (result) {
          this.navigateBack();
        }
      });
    } else {
      this.navigateBack();
    }
  }

  exitScreen() {
    if (this.form.dirty) {
      this.alertService.showConfirm({
        message: this.translateService.instant('maintenance_parts_edit_exitConfirm'),
        confirmText: this.translateService.instant('common_confirm'),
        cancelText: this.translateService.instant('common_cancel'),
        cssClass: 'alert-button-cancel'
      }).then((result) => {
        if (result) {
          this.navigateBack();
        }
      });
    } else {
      this.navigateBack();
    }
  }

  private navigateBack() {
    if (this.maintenanceHeaderId) {
      this.router.navigate(['/maintenance/part/list', this.maintenanceHeaderId]);
    } else {
      this.router.navigate(['/maintenance/list']);
    }
  }

  private resetForm() {
    this.form.reset();
    this.form.markAsPristine();
    this.form.markAsUntouched();
  }
}

