import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { VehicleService, VehicleEditRequest, VehicleGetRequest } from '../../../../utils/vehicle.service';
import { CatalogService } from '../../../../utils/catalog.service';
import { AlertService } from '../../../../utils/alert.service';
import { AppFooterComponent } from '../../../../shared/components/app-footer/app-footer.component';
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
    FormsModule,
    TranslateModule,
    AppFooterComponent
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
  vehicleMotorTypes: any[] = [];

  // Image properties
  currentImageUrl: string | null = null; // Imagen actual desde el backend
  selectedImage: File | null = null;     // Nueva imagen seleccionada
  imagePreview: string | null = null;    // Preview de la nueva imagen
  maxImageSize = 5 * 1024 * 1024;        // 5MB
  imageChanged = false;                  // Flag para saber si cambió la imagen

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
      this.alertService.showError(this.translateService.instant('vehicles_edit_error_noId'));
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
      vehicleMotorTypeId: ['', Validators.required],
      model: [''],
      id: [''],
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
        this.alertService.showError(this.translateService.instant('vehicles_edit_error_load'));
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
          this.alertService.showError(response?.message || this.translateService.instant('vehicles_edit_error_load'));
        }
      }
    });
  }

  private populateForm(vehicle: VehicleGetRequest) {
   
    this.form.patchValue({
      name: vehicle.name,
      id: vehicle.id,
      plateNumber: vehicle.plateNumber,
      brandCode: vehicle.brandCode,
      vehicleTypeId: vehicle.vehicleTypeId,
      vehicleMotorTypeId: vehicle.vehicleMotorTypeId,
      model: vehicle.model || '',
      color: vehicle.color,
      year: vehicle.year,
      mileage: vehicle.mileage
    });
    
    // Guardar URL de imagen actual
    this.currentImageUrl = vehicle.imageUrl || null;
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

    // Load vehicle motor types
    this.catalogService.getVehicleMotorType().subscribe({
      next: (response: any) => {
        if (response && response.success) {
          this.vehicleMotorTypes = response.data || [];
        }
      },
      error: (error: any) => {
        console.error('Error loading vehicle motor types:', error);
      }
    });
  }

  updateVehicle() {
    if (this.form.invalid || !this.vehicleId) {
      this.markFormGroupTouched();
      return;
    }

    this.loading = true;

    const formDataToSend = new FormData();
    const formValue = this.form.value;

    // Add regular form fields
    formDataToSend.append('id', formValue.id || '');
    formDataToSend.append('name', formValue.name || '');
    formDataToSend.append('plateNumber', formValue.plateNumber || '');
    formDataToSend.append('brandCode', formValue.brandCode || '');
    formDataToSend.append('vehicleTypeId', formValue.vehicleTypeId || '');
    formDataToSend.append('color', formValue.color || '');
    formDataToSend.append('vehicleMotorTypeId', formValue.vehicleMotorTypeId || '');
    
    if (formValue.model) formDataToSend.append('model', formValue.model);
    if (formValue.year) formDataToSend.append('year', formValue.year.toString());
    if (formValue.mileage) formDataToSend.append('mileage', formValue.mileage.toString());

    // Add new image if selected
    if (this.selectedImage) {
      formDataToSend.append('image', this.selectedImage, this.selectedImage.name);
    }

    // Always use FormData method
    this.vehicleService.updateVehicleWithImages(this.vehicleId, formDataToSend).pipe(
      catchError(error => {
        console.error('Error updating vehicle:', error);
        this.alertService.showError(this.translateService.instant('vehicles_edit_error_update'));
        return of(null);
      }),
      finalize(() => {
        this.loading = false;
      })
    ).subscribe({
      next: (response: any) => {
        if (response && response.success) {
          this.alertService.showSuccess(this.translateService.instant('vehicles_edit_success'));
          this.router.navigate(['/vehicles']);
        } else {
          this.alertService.showError(response.message, response.errors);
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
        return this.translateService.instant('vehicles_form_validation_required');
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
        this.translateService.instant('vehicles_form_cancelConfirm')
      );
    } else {
      this.router.navigate(['/vehicles']);
    }
  }

  exitScreen() {
    if (this.form.dirty) {
      this.alertService.showConfirm(
        this.translateService.instant('vehicles_form_exitConfirm')
      );
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
   * Handle image file selection
   */
  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      
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
      this.imageChanged = true;
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
   * Clear selected image and restore to current
   */
  clearImage() {
    this.selectedImage = null;
    this.imagePreview = null;
    this.imageChanged = false;
    
    // Clear file input
    const fileInput = document.getElementById('vehicleImageInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  /**
   * Delete current image
   */
  deleteCurrentImage() {
    this.alertService.showConfirm({
      message: '¿Estás seguro de que quieres eliminar la imagen actual?',
      confirmText: 'Eliminar',
      cancelText: 'Cancelar',
      cssClass: 'alert-button-delete'
    }).then((confirmed) => {
      if (confirmed) {
        this.currentImageUrl = null;
        this.imageChanged = true;
        this.form.markAsDirty();
        this.alertService.showSuccess('Imagen marcada para eliminación');
      }
    });
  }

  /**
   * Handle image loading error
   */
  onImageError(event: any) {
    event.target.style.display = 'none';
  }
}
