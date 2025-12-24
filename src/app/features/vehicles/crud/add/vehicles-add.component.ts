import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { VehicleService, VehicleCreateRequest } from '../../../../utils/vehicle.service';
import { CatalogService, Catalog } from '../../../../utils/catalog.service';
import { AlertService } from '../../../../utils/alert.service';
import { AppFooterComponent } from '../../../../shared/components/app-footer';

@Component({
  selector: 'app-vehicles-add',
  templateUrl: './vehicles-add.component.html',
  styleUrls: ['./vehicles-add.component.scss'],
  imports: [
    CommonModule,
    IonicModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    AppFooterComponent
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
  vehicleMotorTypes: Catalog[] = [];
  
  // Image upload properties (single image only)
  selectedImage: File | null = null;
  imagePreview: string | null = null;
  maxImageSize = 5 * 1024 * 1024; // 5MB

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
      vehicleMotorTypeId: ['', Validators.required],
      year: [null],
      mileage: [null],
      image: [null] // Image field
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

    // Load vehicleTypesMotor
    this.catalogService.getVehicleMotorType().subscribe({
      next: (response) => {
        if (response.success) {
          this.vehicleMotorTypes = response.data || [];
        }
      },
      error: (error) => {
        console.error('Error loading vehicle motor types:', error);
      }
    });
  }

  async saveVehicle() {
    if (!this.form.valid) {
      this.markFormGroupTouched(this.form);
      alert(this.translateService.instant('vehicles_form_required'));
      return;
    }

    this.loading = true;

    // Create FormData with form fields + images
    const formData = new FormData();
    
    // Add regular form fields
    formData.append('name', this.form.get('name')?.value || '');
    formData.append('plateNumber', this.form.get('plateNumber')?.value || '');
    formData.append('brandCode', this.form.get('brandCode')?.value || '');
    formData.append('vehicleTypeId', this.form.get('vehicleTypeId')?.value || '');
    formData.append('color', this.form.get('color')?.value || '');
    formData.append('vehicleMotorTypeId', this.form.get('vehicleMotorTypeId')?.value || '');
    
    // Optional fields
    const model = this.form.get('model')?.value;
    if (model) formData.append('model', model);
    
    const year = this.form.get('year')?.value;
    if (year) formData.append('year', year.toString());
    
    const mileage = this.form.get('mileage')?.value;
    if (mileage) formData.append('mileage', mileage.toString());

    // Add single image to FormData
    if (this.selectedImage) {
      formData.append('image', this.selectedImage, this.selectedImage.name);
    }

    // Use new service method that sends FormData
    this.vehicleService.createVehicleWithImages(formData).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.success) {
          this.alertService.showSuccess(this.translateService.instant('vehicles_success_created'));
          this.router.navigate(['/vehicles']);
        } else {
          this.alertService.showError(response.message || 'An error occurred', response.errors);
        }
      },
      error: (error) => {
        this.loading = false;
        this.alertService.showError(this.translateService.instant('vehicles_list_error'));
        console.error('Error creating vehicle:', error);
      }
    });
  }

  getFieldError(fieldName: string): string {
    const control = this.form.get(fieldName);
    if (control?.errors) {
      if (control.errors['required']) {
        return this.translateService.instant('vehicles_form_required');
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
        message: this.translateService.instant('vehicles_form_cancelConfirm'),
        confirmText: this.translateService.instant('common_confirm'),
        cancelText: this.translateService.instant('common_cancel'),
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
        message: this.translateService.instant('vehicles_form_cancelConfirm'),
        confirmText: this.translateService.instant('common_confirm'),
        cancelText: this.translateService.instant('common_cancel'),
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
    this.clearImage();
  }

  /**
   * Handle single image file selection
   */
  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    
    if (input.files && input.files.length > 0) {
      const file = input.files[0]; // Solo tomar la primera imagen
      
      const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      
      // Validate file type
      if (!validImageTypes.includes(file.type)) {
        this.alertService.showError(
          this.translateService.instant('vehicles_form_invalidImageType')
        );
        input.value = '';
        return;
      }
      
      // Validate file size
      if (file.size > this.maxImageSize) {
        this.alertService.showError(
          this.translateService.instant('vehicles_form_imageTooLarge')
        );
        input.value = '';
        return;
      }
      
      // Store the file
      this.selectedImage = file;
      this.form.patchValue({ image: file });
      this.form.markAsDirty();
      
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
      
      // Show success message
      this.alertService.showSuccess(
        this.translateService.instant('vehicles_form_imageSelected')
      );
    }
  }

  /**
   * Trigger file input click
   */
  triggerFileInput() {
    const fileInput = document.getElementById('vehicleImageInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  /**
   * Clear selected image
   */
  clearImage() {
    this.selectedImage = null;
    this.imagePreview = null;
    this.form.patchValue({ image: null });
    
    // Clear file input
    const fileInput = document.getElementById('vehicleImageInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }
} 