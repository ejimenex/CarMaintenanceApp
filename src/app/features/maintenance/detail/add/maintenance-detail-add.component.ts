import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController } from '@ionic/angular';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MaintenanceDetailService, MaintenanceDetail } from '../../../../utils/maintenanceDetail.service';
import { MaintenancePart } from '../../../../utils/maintenancePart.service';
import { AlertService } from '../../../../utils/alert.service';
import { AppFooterComponent } from '../../../../shared/components/app-footer/app-footer.component';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import { Catalog, CatalogService } from 'src/app/utils/catalog.service';
import { AddPartModalComponent } from './add-part-modal.component';

@Component({
  selector: 'app-maintenance-detail-add',
  templateUrl: './maintenance-detail-add.component.html',
  styleUrls: ['./maintenance-detail-add.component.scss'],
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
export class MaintenanceDetailAddComponent implements OnInit {
  maintenanceDetailForm: FormGroup;
  loading = false;
  errorMessage = '';
  maintenanceHeaderId: string = '';
  maintenanceTypes: Catalog[] = [];
  unitOfMeasures: Catalog[] = [];
  basicMaintenancesCatalog: Catalog[] = [];
  basicMaintenances:string[] = [];
  maintenanceParts: MaintenancePart[] = [];
  showAddPartForm = false;
    basicMaintenancesSelected: { id: string; name: string }[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private maintenanceDetailService: MaintenanceDetailService,
    private catalogService: CatalogService,
    private router: Router,
    private route: ActivatedRoute,
    private alertService: AlertService,
    private translateService: TranslateService,
    private modalController: ModalController
  ) {
    this.maintenanceDetailForm = this.createForm();
  }

  ngOnInit() {
    console.log('🚀 MaintenanceDetailAddComponent inicializado');
    this.route.params.subscribe(params => {
      this.maintenanceHeaderId = params['id'];
      if (this.maintenanceHeaderId) {
        this.loadCatalogData();
      }
    });
  }

  ionViewDidEnter() {
    if (this.maintenanceHeaderId) {
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
      processHeaderId: [this.maintenanceHeaderId],
      nextMaintenanceDate: [''],
      maintenanceParts: [[]],
      basicMaintenances: [[]]
    });
  }

  loadCatalogData() {
    this.loading = true;
    this.errorMessage = '';

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

    // Load unit of measures
    this.catalogService.getUnitOfMeasure().pipe(
      catchError(error => {
        console.error('Error loading unit of measures:', error);
        return of(null);
      }),
      finalize(() => {
        this.loading = false;
      })
    ).subscribe({
      next: (response: any) => {
        if (response && response.success) {
          this.unitOfMeasures = response.data || [];
          console.log('✅ Unit of measures loaded:', this.unitOfMeasures.length);
        }
      }
    });
  
  // Load unit of measures
  this.catalogService.getBasicMaintenance().pipe(
    catchError(error => {
      console.error('Error loading unit of measures:', error);
      return of(null);
    }),
    finalize(() => {
      this.loading = false;
    })
  ).subscribe({
    next: (response: any) => {
      if (response && response.success) {
        this.basicMaintenancesCatalog = response.data || [];
        console.log('✅ Unit of measures loaded:', this.basicMaintenancesCatalog.length);
      }
    }
  });
}
  onSubmit() {
    if (this.maintenanceDetailForm.valid) {
      this.loading = true;
      this.errorMessage = '';

      const formData = this.maintenanceDetailForm.value;
      const maintenanceDetail: MaintenanceDetail = {
        ...formData,
        processHeaderId: this.maintenanceHeaderId,
        MaintenanceDetailId: '', // Will be generated by the server
        maintenanceTypeName: this.getMaintenanceTypeName(formData.maintenanceTypeId),
        statusName: 'Pending', // Default status
        maintenanceParts: this.maintenanceParts,
        basicMaintenances: this.basicMaintenances
      };

      console.log('🔄 Creating maintenance detail...', maintenanceDetail);

      this.maintenanceDetailService.createMaintenanceDetail(maintenanceDetail).pipe(
        catchError(error => {
          console.error('❌ Error creating maintenance detail:', error);
          this.errorMessage = this.translateService.instant('maintenance_detail_add_error');
          return of(null);
        }),
        finalize(() => {
          this.loading = false;
        })
      ).subscribe({
        next: (response: any) => {
          console.log('📦 Server response:', response);
          
          if (response && response.success) {
            this.alertService.showSuccess(this.translateService.instant('maintenance_detail_add_success'));
            this.router.navigate(['/maintenance/detail/list', this.maintenanceHeaderId]);
          } else {
            debugger;
            this.errorMessage = response?.message || this.translateService.instant('maintenance_detail_add_error');
          }
        },
        error: (error) => {
          debugger;
          console.error('❌ Error in subscribe:', error);
          this.errorMessage = this.translateService.instant('maintenance_detail_add_error');
        }
      });
    } else {
      debugger;
      this.markFormGroupTouched();
      this.alertService.showError(this.translateService.instant('maintenance_detail_add_form_invalid'));
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
    this.router.navigate(['/maintenance/detail/list', this.maintenanceHeaderId]);
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
        return this.translateService.instant('maintenance_detail_add_form_errors_required');
      }
      if (field.errors['minlength']) {
        return this.translateService.instant('maintenance.detail.add.form.errors.minlength', { 
          min: field.errors['minlength'].requiredLength 
        });
      }
      if (field.errors['pattern']) {
        return this.translateService.instant('maintenance_detail_add_form_errors_pattern');
      }
      if (field.errors['min']) {
        return this.translateService.instant('maintenance.detail.add.form.errors.min', { 
          min: field.errors['min'].min 
        });
      }
    }
    return '';
  }

  // Maintenance Parts methods
  async toggleAddPartForm() {
    const modal = await this.modalController.create({
      component: AddPartModalComponent,
      componentProps: {
        unitOfMeasures: this.unitOfMeasures
      }
    });

    modal.onDidDismiss().then((result) => {
    
      console.log('📦 Modal dismissed with data:', result.data);
      if (result.data) {
        this.addMaintenancePart(result.data);
      }
    });

    await modal.present();
  }

    async openBasicMaintenanceModal() {
      const modal = await this.modalController.create({
        component: (await import('./basic-maintenance-modal.component')).BasicMaintenanceModalComponent,
        componentProps: {
          basicMaintenancesCatalog: this.basicMaintenancesCatalog
        }
      });

      modal.onDidDismiss().then((result) => {
        if (result.data && Array.isArray(result.data)) {
          // Prevent duplicates
          const newItems = result.data.filter((item: any) =>
            !this.basicMaintenancesSelected.some(sel => sel.id === item.id)
          );
          this.basicMaintenancesSelected = [...this.basicMaintenancesSelected, ...newItems];
          this.basicMaintenances = this.basicMaintenancesSelected.map(item => item.id);
          console.log(this.basicMaintenances);
        }
      });

      await modal.present();
    }

  addMaintenancePart(part: MaintenancePart) {
    // Generate a temporary ID for new parts
    const newPart: MaintenancePart = {
      ...part,
      id: 'temp_' + Date.now(),
      totalCost: part.quantity * part.cost
    };
    
    this.maintenanceParts.push(newPart);
    console.log('✅ Part added:', newPart);
  }

  removeMaintenancePart(index: number) {
    this.maintenanceParts.splice(index, 1);
    console.log('🗑️ Part removed at index:', index);
  }

    removeBasicMaintenance(index: number) {
      this.basicMaintenancesSelected.splice(index, 1);
      console.log('🗑️ Basic maintenance removed at index:', index);
    }

  getUnitOfMeasureName(unitId: string): string {
    const unit = this.unitOfMeasures.find(u => u.id === unitId);
    return unit ? unit.name : '';
  }
}
