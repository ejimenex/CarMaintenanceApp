import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { VehicleService, VehicleEditRequest, VehicleGetRequest } from '../../../../utils/vehicle.service';
import { CatalogService } from '../../../../utils/catalog.service';
import { AlertService } from '../../../../utils/alert.service';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-vehicles-edit',
  templateUrl: './vehicles-edit.component.html',
  styleUrls: ['./vehicles-edit.component.scss'],
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    TranslateModule
  ],
  standalone: true
})
export class VehiclesEditComponent implements OnInit {
  form: FormGroup;
  loading = false;
  vehicleId: string | null = null;
  vehicle: VehicleGetRequest | null = null;

  // Catalog data
  brands: any[] = [];
  colors: any[] = [];
  vehicleTypes: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private vehicleService: VehicleService,
    private catalogService: CatalogService,
    private alertService: AlertService,
    private router: Router,
    private route: ActivatedRoute,
    private translateService: TranslateService
  ) {
    this.form = this.createForm();
  }

  ngOnInit() {
    this.vehicleId = this.route.snapshot.paramMap.get('id');
    if (this.vehicleId) {
      this.loadVehicleData();
    } else {
      this.alertService.showError(this.translateService.instant('vehicles.edit.error.noId'));
      this.router.navigate(['/vehicles']);
    }
    this.loadCatalogData();
  }

  private createForm(): FormGroup {
    return this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      plateNumber: ['', [Validators.required, Validators.minLength(3)]],
      brandCode: ['', Validators.required],
      vehicleTypeId: ['', Validators.required],
      model: [''],
      color: ['', Validators.required],
      year: [null, [Validators.min(1900), Validators.max(new Date().getFullYear() + 1)]],
      mileage: [null, [Validators.min(0)]]
    });
  }

  private loadVehicleData() {
    if (!this.vehicleId) return;

    this.loading = true;
    this.vehicleService.getByIdVehicle(this.vehicleId).pipe(
      catchError(error => {
        console.error('Error loading vehicle:', error);
        this.alertService.showError(this.translateService.instant('vehicles.edit.error.load'));
        return of(null);
      }),
      finalize(() => {
        this.loading = false;
      })
    ).subscribe({
      next: (response: any) => {
        if (response && response.success && response.data) {
          this.vehicle = response.data;
          this.populateForm(response.data);
        } else {
          this.alertService.showError(response?.message || this.translateService.instant('vehicles.edit.error.load'));
        }
      }
    });
  }

  private populateForm(vehicle: VehicleGetRequest) {
    this.form.patchValue({
      name: vehicle.name,
      plateNumber: vehicle.plateNumber,
      brandCode: vehicle.brandCode,
      vehicleTypeId: vehicle.vehicleTypeId,
      model: vehicle.model || '',
      color: vehicle.color,
      year: vehicle.year,
      mileage: vehicle.mileage
    });
  }

  private loadCatalogData() {
    // Load brands
    this.catalogService.getBrand().subscribe({
      next: (response: any) => {
        if (response && response.success) {
          this.brands = response.data || [];
        }
      },
      error: (error: any) => {
        console.error('Error loading brands:', error);
      }
    });

    // Load colors
    this.catalogService.getColor().subscribe({
      next: (response: any) => {
        if (response && response.success) {
          this.colors = response.data || [];
        }
      },
      error: (error: any) => {
        console.error('Error loading colors:', error);
      }
    });

    // Load vehicle types
    this.catalogService.getVehicleType().subscribe({
      next: (response: any) => {
        if (response && response.success) {
          this.vehicleTypes = response.data || [];
        }
      },
      error: (error: any) => {
        console.error('Error loading vehicle types:', error);
      }
    });
  }

  updateVehicle() {
    if (this.form.invalid || !this.vehicleId) {
      this.markFormGroupTouched();
      return;
    }

    this.loading = true;
    const formData = this.form.value;
    
    const updateData: VehicleEditRequest = {
      id: this.vehicleId,
      name: formData.name,
      plateNumber: formData.plateNumber,
      brandCode: formData.brandCode,
      vehicleTypeId: formData.vehicleTypeId,
      model: formData.model || null,
      color: formData.color,
      year: formData.year || null,
      mileage: formData.mileage || null
    };

    this.vehicleService.editVehicle(this.vehicleId, updateData).pipe(
      catchError(error => {
        console.error('Error updating vehicle:', error);
        this.alertService.showError(this.translateService.instant('vehicles.edit.error.update'));
        return of(null);
      }),
      finalize(() => {
        this.loading = false;
      })
    ).subscribe({
      next: (response: any) => {
        if (response && response.success) {
          this.alertService.showSuccess(this.translateService.instant('vehicles.edit.success'));
          this.router.navigate(['/vehicles']);
        } else {
          this.alertService.showError(response.message,response.errors);
          
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
        return this.translateService.instant('vehicles.form.validation.required');
      }
      if (control.errors['minlength']) {
        return this.translateService.instant('vehicles.form.validation.minLength', { 
          minLength: control.errors['minlength'].requiredLength 
        });
      }
      if (control.errors['min']) {
        return this.translateService.instant('vehicles.form.validation.min', { 
          min: control.errors['min'].min 
        });
      }
      if (control.errors['max']) {
        return this.translateService.instant('vehicles.form.validation.max', { 
          max: control.errors['max'].max 
        });
      }
    }
    return '';
  }

  cancelForm() {
    if (this.form.dirty) {
      this.alertService.showConfirm(
        this.translateService.instant('vehicles.form.cancelConfirm')
      );
    } else {
      this.router.navigate(['/vehicles']);
    }
  }

  exitScreen() {
    if (this.form.dirty) {
      this.alertService.showConfirm(
        this.translateService.instant('vehicles.form.exitConfirm')
      );
    } else {
      this.router.navigate(['/vehicles']);
    }
  }

  private resetForm() {
    this.form.reset();
    this.form.markAsPristine();
    this.form.markAsUntouched();
  }
}
