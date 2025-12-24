import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ProcessHeaderService, ProccessHeaderModel } from '../../../utils/processHeader.service';
import { VehicleService, LabelValueDto } from '../../../utils/vehicle.service';
import { WorkshopService, LabelValueDto as TradeLabelValueDto } from '../../../utils/worksShop.service';
import { AlertService } from '../../../utils/alert.service';
import { AppFooterComponent } from '../../../shared/components/app-footer/app-footer.component';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-maintenance-edit',
  templateUrl: './maintenance-edit.component.html',
  styleUrls: ['./maintenance-edit.component.scss'],
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    TranslateModule,
    RouterModule,
    AppFooterComponent
  ],
  providers: [
    ProcessHeaderService,
    VehicleService,
    WorkshopService,
    AlertService
  ],
  standalone: true
})
export class MaintenanceEditComponent implements OnInit {
  maintenanceForm: FormGroup;
  loading = false;
  loadingData = false;
  vehicles: LabelValueDto[] = [];
  workshops: TradeLabelValueDto[] = [];
  maintenanceId: string = '';
  
  processTypes = [
    { value: 'FUEL', label: 'Combustible' },
    { value: 'PART', label: 'Repuestos' },
    { value: 'TALL', label: 'Taller' },
    { value: 'INSU', label: 'Insumos' }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private processHeaderService: ProcessHeaderService,
    private vehicleService: VehicleService,
    private workshopService: WorkshopService,
    private router: Router,
    private route: ActivatedRoute,
    private alertService: AlertService,
    private translateService: TranslateService
  ) {
    this.maintenanceForm = this.createForm();
  }

  ngOnInit() {
    // Get the maintenance ID from route parameters
    this.maintenanceId = this.route.snapshot.paramMap.get('id') || '';
    
    if (!this.maintenanceId) {
      this.alertService.showError(this.translateService.instant('maintenance_edit_error_invalidId'));
      this.router.navigate(['/maintenance']);
      return;
    }

    // Load initial data
    this.loadVehicles();
    this.loadWorkshops();
    this.loadMaintenanceData();
  }

  private createForm(): FormGroup {
    return this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      vehicleId: ['', Validators.required],
      processType: ['', Validators.required],
      startDate: [''],
      endDate: [''],
      note: [''],
      tradeId: ['', Validators.required]
    });
  }

  private loadMaintenanceData() {
    this.loadingData = true;
    console.log('🔄 Cargando datos del mantenimiento ID:', this.maintenanceId);

    this.processHeaderService.getByIdProcessHeader(this.maintenanceId).pipe(
      catchError(error => {
        console.error('Error loading maintenance data:', error);
        this.alertService.showError(this.translateService.instant('maintenance_edit_error_load'));
        return of(null);
      }),
      finalize(() => {
        this.loadingData = false;
      })
    ).subscribe({
      next: (response: any) => {
        if (response && response.success && response.data) {
          this.populateForm(response.data);
          console.log('✅ Datos del mantenimiento cargados:', response.data);
        } else {
          this.alertService.showError(response?.message || this.translateService.instant('maintenance_edit_error_load'));
          this.router.navigate(['/maintenance']);
        }
      }
    });
  }

  private populateForm(maintenanceData: any) {
    // Format dates for input fields (YYYY-MM-DD format)
    const formatDateForInput = (date: any) => {
      if (!date) return '';
      const d = new Date(date);
      return d.toISOString().split('T')[0];
    };

    this.maintenanceForm.patchValue({
      id: this.maintenanceId || '',
      name: maintenanceData.name || '',
      vehicleId: maintenanceData.vehicleId || '',
      processType: maintenanceData.processType || '',
      startDate: formatDateForInput(maintenanceData.startDate),
      endDate: formatDateForInput(maintenanceData.endDate),
      note: maintenanceData.note || '',
      tradeId: maintenanceData.tradeId || ''
    });

    console.log('✅ Formulario poblado con datos:', this.maintenanceForm.value);
  }

  private loadVehicles() {
    this.vehicleService.getAll().pipe(
      catchError(error => {
        console.error('Error loading vehicles:', error);
        this.alertService.showError(this.translateService.instant('maintenance_form_errors_loadVehicles'));
        return of(null);
      })
    ).subscribe({
      next: (response: any) => {
        if (response && response.success) {
          this.vehicles = response.data || [];
          console.log('✅ Vehículos cargados para dropdown:', this.vehicles);
        } else {
          this.alertService.showError(response?.message || this.translateService.instant('maintenance_form_errors_loadVehicles'));
        }
      }
    });
  }

  private loadWorkshops() {
    this.workshopService.getAll().pipe(
      catchError(error => {
        console.error('Error loading workshops:', error);
        this.alertService.showError(this.translateService.instant('maintenance_form_errors_loadWorkshops'));
        return of(null);
      })
    ).subscribe({
      next: (response: any) => {
        if (response && response.success) {
          this.workshops = response.data || [];
          console.log('✅ Talleres cargados para dropdown:', this.workshops);
        } else {
          this.alertService.showError(response?.message || this.translateService.instant('maintenance_form_errors_loadWorkshops'));
        }
      }
    });
  }

  async updateMaintenance() {
    if (this.maintenanceForm.valid) {
      this.loading = true;
      
      const formValue = this.maintenanceForm.value;
      const maintenanceData: ProccessHeaderModel = {
        name: formValue.name,
        id:this.maintenanceId,
        vehicleId: formValue.vehicleId,
        processType: formValue.processType,
        startDate: formValue.startDate ? new Date(formValue.startDate) : new Date(),
        endDate: formValue.endDate ? new Date(formValue.endDate) : new Date(),
        note: formValue.note || '',
        tradeId: formValue.tradeId
      };

      console.log('🔄 Actualizando mantenimiento:', maintenanceData);

      this.processHeaderService.editProcessHeader(this.maintenanceId, maintenanceData).pipe(
        catchError(error => {
        
          console.error('Error updating maintenance:', error);
          this.alertService.showError(this.translateService.instant('maintenance_edit_error_update'));
          return of(null);
        }),
        finalize(() => {
          this.loading = false;
        })
      ).subscribe({
        next: (response: any) => {
          if (response && response.success) {
            this.alertService.showSuccess(this.translateService.instant('maintenance_edit_success'));
            this.router.navigate(['/maintenance']);
          } else {
            this.alertService.showError(response?.message || this.translateService.instant('maintenance_edit_error_update'));
          }
        }
      });
    } else {
      this.markFormGroupTouched();
      this.alertService.showError(this.translateService.instant('maintenance_form_errors_invalidForm'));
    }
  }

  private markFormGroupTouched() {
    Object.keys(this.maintenanceForm.controls).forEach(field => {
      const control = this.maintenanceForm.get(field);
      control?.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string {
    const field = this.maintenanceForm.get(fieldName);
    if (field && field.errors && field.touched) {
      if (field.errors['required']) {
        return this.translateService.instant('maintenance_form_errors_required');
      }
      if (field.errors['minlength']) {
        return this.translateService.instant('maintenance.form.errors.minLength', { 
          min: field.errors['minlength'].requiredLength 
        });
      }
      if (field.errors['min']) {
        return `El valor mínimo es ${field.errors['min'].min}`;
      }
    }
    return '';
  }

  cancelForm() {
    this.router.navigate(['/maintenance']);
  }

  exitScreen() {
    this.router.navigate(['/']);
  }
}
