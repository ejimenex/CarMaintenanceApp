import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ProcessHeaderService, ProccessHeaderModel } from '../../../utils/processHeader.service';
import { VehicleService, VehicleGetRequest, LabelValueDto } from '../../../utils/vehicle.service';
import { WorkshopService, WorkshopGetRequest, LabelValueDto as TradeLabelValueDto } from '../../../utils/worksShop.service';
import { AlertService } from '../../../utils/alert.service';
import { AppFooterComponent } from '../../../shared/components/app-footer/app-footer.component';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';

export interface MaintenanceDetail {
  description: string;
  cost: number;
  quantity: number;
  note?: string;
}

@Component({
  selector: 'app-maintenance-add',
  templateUrl: './maintenance-add.component.html',
  styleUrls: ['./maintenance-add.component.scss'],
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
export class MaintenanceAddComponent implements OnInit {
  maintenanceForm: FormGroup;
  loading = false;
  vehicles: LabelValueDto[] = [];
  workshops: TradeLabelValueDto[] = [];
  
  processTypes = [
    { value: 'FUEL', label: 'Combustible' },
    { value: 'PART', label: 'Repuestos' },
    { value: 'TALL', label: 'Taller' },
    { value: 'INSU', label: 'Seguros' },
    { value: 'RETA', label: 'Taller & Repuestos' },
    { value: 'TAXE', label: 'Impuestos' },
  ];

  constructor(
    private formBuilder: FormBuilder,
    private processHeaderService: ProcessHeaderService,
    private vehicleService: VehicleService,
    private workshopService: WorkshopService,
    private router: Router,
    private alertService: AlertService,
    private translateService: TranslateService
  ) {
    this.maintenanceForm = this.createForm();
  }

  ngOnInit() {
    this.loadVehicles();
    this.loadWorkshops();
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

  async saveMaintenance() {
    if (this.maintenanceForm.valid) {
      this.loading = true;
      
      const formValue = this.maintenanceForm.value;
      const maintenanceData: ProccessHeaderModel = {
        name: formValue.name,
        vehicleId: formValue.vehicleId,
        processType: formValue.processType,
        startDate: new Date(formValue.startDate),
        endDate: new Date(formValue.endDate),
        model: formValue.model || undefined,
        note: formValue.note || '',
        tradeId: formValue.tradeId
      };

      this.processHeaderService.createProcessHeader(maintenanceData).pipe(
        catchError(error => {
          console.error('Error creating maintenance:', error);
          this.alertService.showError(this.translateService.instant('maintenance_add_error'));
          return of(null);
        }),
        finalize(() => {
          this.loading = false;
        })
      ).subscribe({
        next: (response: any) => {
          if (response && response.success) {
            this.alertService.showSuccess(this.translateService.instant('maintenance_add_success'));
           // this.router.navigate(['/maintenance']);
             this.goToDetail(response.data.id);
          } else {
            this.alertService.showError(response?.message || this.translateService.instant('maintenance_add_error'));
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
  goToDetail(maintenanceId: string) {
    const processType = this.maintenanceForm.get('processType')?.value;
  
    const routes: Record<string, string> = {
      'FUEL': `/maintenance/fuel/add`,
      'INSU': `/maintenance/insurance/add`,
      'RETA': `/maintenance/detail/add`,
      'TAXE': `/maintenance/taxe/add`
    };
  debugger;
    const targetRoute = routes[processType];
  
    if (targetRoute) {
      this.router.navigate([targetRoute, maintenanceId]);
    } else {
      console.warn('Tipo de proceso no reconocido:', processType);
    }
  }
  exitScreen() {
    this.router.navigate(['/']);
  }
}
