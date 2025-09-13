import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { VehicleService, VehicleCreateRequest } from '../../../../utils/vehicle.service';
import { CatalogService, Catalog } from '../../../../utils/catalog.service';
import { AlertService } from '../../../../utils/alert.service';

@Component({
  selector: 'app-vehicles-add',
  templateUrl: './vehicles-add.component.html',
  styleUrls: ['./vehicles-add.component.scss'],
  imports: [
    CommonModule,
    IonicModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    VehicleService,
    CatalogService
  ],
  standalone: true
})
export class VehiclesAddComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  brands: Catalog[] = [];
  vehicleTypes: Catalog[] = [];
  colors: Catalog[] = [];

  constructor(
    private vehicleService: VehicleService,
    private catalogService: CatalogService,
    private formBuilder: FormBuilder,
    private router: Router,
    private alertService: AlertService,
    private translateService: TranslateService
  ) {}

  ngOnInit() {
    this.initializeForm();
    this.loadCatalogs();
  }

  initializeForm() {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      plateNumber: ['', [Validators.required, Validators.minLength(3)]],
      brandCode: ['', Validators.required],
      vehicleTypeId: ['', Validators.required],
      model: [''],
      color: ['', Validators.required],
      year: [null],
      mileage: [null]
    });
  }

  loadCatalogs() {
    // Load brands
    this.catalogService.getBrand().subscribe({
      next: (response) => {
        if (response.success) {
          this.brands = response.data || [];
        }
      },
      error: (error) => {
        console.error('Error loading brands:', error);
      }
    });

    // Load vehicle types
    this.catalogService.getVehicleType().subscribe({
      next: (response) => {
        if (response.success) {
          this.vehicleTypes = response.data || [];
        }
      },
      error: (error) => {
        console.error('Error loading vehicle types:', error);
      }
    });

    // Load colors
    this.catalogService.getColor().subscribe({
      next: (response) => {
        if (response.success) {
          this.colors = response.data || [];
        }
      },
      error: (error) => {
        console.error('Error loading colors:', error);
      }
    });
  }

  async saveVehicle() {
    if (!this.form.valid) {
      this.markFormGroupTouched(this.form);
      alert(this.translateService.instant('vehicles.form.required'));
      return;
    }

    this.loading = true;
    const formData: VehicleCreateRequest = this.form.value;

    this.vehicleService.createVehicle(formData).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.success) {
          this.alertService.showSuccess(this.translateService.instant('vehicles.success.created'));
          this.router.navigate(['/vehicles']);
        } else {
          this.alertService.showError(response.message || 'An error occurred', response.errors);
        }
      },
      error: (error) => {
        this.loading = false;
        this.alertService.showError(this.translateService.instant('vehicles.list.error'));
        console.error('Error creating vehicle:', error);
      }
    });
  }

  getFieldError(fieldName: string): string {
    const control = this.form.get(fieldName);
    if (control?.errors) {
      if (control.errors['required']) {
        return this.translateService.instant('vehicles.form.required');
      }
      if (control.errors['minlength']) {
        const requiredLength = control.errors['minlength'].requiredLength;
        return this.translateService.instant('vehicles.form.minLength', { field: fieldName, length: requiredLength });
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
    // Check if form has changesADDEQUIPMENTvehic
    if (this.form.dirty) {
      this.alertService.showConfirm({
        message: this.translateService.instant('vehicles.form.cancelConfirm'),
        confirmText: this.translateService.instant('common.confirm'),
        cancelText: this.translateService.instant('common.cancel'),
        cssClass: 'alert-button-cancel'
      }).then((result) => {
        if (result) {
          this.resetForm();
          this.router.navigate(['/vehicles']);
        }
      });
    } else {
      this.router.navigate(['/vehicles']);
    }    
  }

  exitScreen() {
    // Check if form has changes
    if (this.form.dirty) {
      this.alertService.showConfirm({
        message: this.translateService.instant('vehicles.form.cancelConfirm'),
        confirmText: this.translateService.instant('common.confirm'),
        cancelText: this.translateService.instant('common.cancel'),
        cssClass: 'alert-button-cancel'
      }).then((result) => {
        if (result) {
          this.resetForm();
          this.router.navigate(['/vehicles']);
        }
      });
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