import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MaintenanceDetailService, MaintenanceDetail } from '../../../../utils/maintenanceDetail.service';
import { AppFooterComponent } from '../../../../shared/components/app-footer/app-footer.component';
import { AlertService } from '../../../../utils/alert.service';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import { Catalog, CatalogService } from 'src/app/utils/catalog.service';

@Component({
  selector: 'app-maintenance-detail-edit',
  templateUrl: './maintenance-detail-edit.component.html',
  styleUrls: ['./maintenance-detail-edit.component.scss'],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    AppFooterComponent
  ],
  providers: [
    MaintenanceDetailService,
    CatalogService,
    AlertService
  ],
  standalone: true
})
export class MaintenanceDetailEditComponent implements OnInit {
  maintenanceDetailForm: FormGroup;
  loading = false;
  errorMessage = '';
  maintenanceDetailId: string = '';
  maintenanceDetail: MaintenanceDetail | null = null;
  maintenanceTypes: Catalog[] = [];
  statusOptions: Catalog[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private maintenanceDetailService: MaintenanceDetailService,
    private catalogService: CatalogService,
    private router: Router,
    private route: ActivatedRoute,
    private alertService: AlertService,
    private translateService: TranslateService
  ) {
    this.maintenanceDetailForm = this.createForm();
  }

  ngOnInit() {
    console.log('🚀 MaintenanceDetailEditComponent inicializado');
    this.route.params.subscribe(params => {
      this.maintenanceDetailId = params['id'];
      if (this.maintenanceDetailId) {
        this.loadMaintenanceDetail();
        this.loadCatalogData();
      }
    });
  }

  ionViewDidEnter() {
    if (this.maintenanceDetailId) {
      this.loadMaintenanceDetail();
      this.loadCatalogData();
    }
  }

  createForm(): FormGroup {
    return this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: [''],
      diagnosis: ['', [Validators.required, Validators.minLength(5)]],
      mileage: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      cost: [0, [Validators.required, Validators.min(0)]],
      Technician: [''],
      maintenanceTypeId: ['', [Validators.required]],
      nextMaintenanceDate: ['']
    });
  }

  loadMaintenanceDetail() {
    this.loading = true;
    this.errorMessage = '';

    console.log('🔄 Loading maintenance detail...', this.maintenanceDetailId);

    this.maintenanceDetailService.getByIdMaintenanceDetail(this.maintenanceDetailId).pipe(
      catchError(error => {
        console.error('❌ Error loading maintenance detail:', error);
        this.errorMessage = this.translateService.instant('maintenance_detail_edit_load_error');
        return of(null);
      }),
      finalize(() => {
        this.loading = false;
      })
    ).subscribe({
      next: (response: any) => {
        console.log('📦 Server response:', response);
        
        if (response && response.success) {
          this.maintenanceDetail = response.data;
          this.populateForm(this.maintenanceDetail as MaintenanceDetail);
          console.log('✅ Maintenance detail loaded:', this.maintenanceDetail);
        } else {
          this.errorMessage = response?.message || this.translateService.instant('maintenance_detail_edit_load_error');
        }
      },
      error: (error) => {
        console.error('❌ Error in subscribe:', error);
        this.errorMessage = this.translateService.instant('maintenance_detail_edit_load_error');
      }
    });
  }

  loadCatalogData() {
    // Load maintenance types
    this.catalogService.getMaintenanceType().pipe(
      catchError(error => {
        console.error('Error loading maintenance types:', error);
        return of(null);
      })
    ).subscribe({
      next: (response: any) => {
        if (response && response.success) {
          this.maintenanceTypes = response.data || [];
          console.log('✅ Maintenance types loaded:', this.maintenanceTypes.length);
        }
      }
    });

  }
  populateForm(maintenanceDetail: MaintenanceDetail) {
    this.maintenanceDetailForm.patchValue({
      name: maintenanceDetail.name,
      description: maintenanceDetail.description || '',
      diagnosis: maintenanceDetail.diagnosis,
      mileage: maintenanceDetail.mileage,
      cost: maintenanceDetail.cost,
      Technician: maintenanceDetail.Technician || '',
      maintenanceTypeId: maintenanceDetail.maintenanceTypeId,
      nextMaintenanceDate: maintenanceDetail.nextMaintenanceDate ? new Date(maintenanceDetail.nextMaintenanceDate).toISOString() : ''
    });
  }

  onSubmit() {
    if (this.maintenanceDetailForm.valid && this.maintenanceDetail) {
      this.loading = true;
      this.errorMessage = '';

      const formData = this.maintenanceDetailForm.value;
      const updatedMaintenanceDetail: MaintenanceDetail = {
        ...this.maintenanceDetail,
        ...formData,
        maintenanceTypeName: this.getMaintenanceTypeName(formData.maintenanceTypeId)
      };

      console.log('🔄 Updating maintenance detail...', updatedMaintenanceDetail);

      this.maintenanceDetailService.editMaintenanceDetail(this.maintenanceDetailId, updatedMaintenanceDetail).pipe(
        catchError(error => {
          console.error('❌ Error updating maintenance detail:', error);
          this.errorMessage = this.translateService.instant('maintenance_detail_edit_error');
          return of(null);
        }),
        finalize(() => {
          this.loading = false;
        })
      ).subscribe({
        next: (response: any) => {
          console.log('📦 Server response:', response);
          
          if (response && response.success) {
            this.alertService.showSuccess(this.translateService.instant('maintenance_detail_edit_success'));
            this.router.navigate(['/maintenance/detail/list', this.maintenanceDetail?.MaintenanceDetailId]);
          } else {
            this.errorMessage = response?.message || this.translateService.instant('maintenance_detail_edit_error');
          }
        },
        error: (error) => {
          console.error('❌ Error in subscribe:', error);
          this.errorMessage = this.translateService.instant('maintenance_detail_edit_error');
        }
      });
    } else {
      this.markFormGroupTouched();
      this.alertService.showError(this.translateService.instant('maintenance_detail_edit_form_invalid'));
    }
  }

  getMaintenanceTypeName(typeId: string): string {
    const type = this.maintenanceTypes.find(t => t.id === typeId);
    return type ? type.name : '';
  }

  markFormGroupTouched() {
    Object.keys(this.maintenanceDetailForm.controls).forEach(key => {
      const control = this.maintenanceDetailForm.get(key);
      control?.markAsTouched();
    });
  }

  onCancel() {
    this.router.navigate(['/maintenance/detail/list', this.maintenanceDetail?.MaintenanceDetailId]);
  }

  // Form validation helpers
  isFieldInvalid(fieldName: string): boolean {
    const field = this.maintenanceDetailForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.maintenanceDetailForm.get(fieldName);
    if (field && field.errors) {
      if (field.errors['required']) {
        return this.translateService.instant('maintenance_detail_edit_form_errors_required');
      }
      if (field.errors['minlength']) {
        return this.translateService.instant('maintenance.detail.edit.form.errors.minlength', { 
          min: field.errors['minlength'].requiredLength 
        });
      }
      if (field.errors['pattern']) {
        return this.translateService.instant('maintenance_detail_edit_form_errors_pattern');
      }
      if (field.errors['min']) {
        return this.translateService.instant('maintenance.detail.edit.form.errors.min', { 
          min: field.errors['min'].min 
        });
      }
    }
    return '';
  }
}
