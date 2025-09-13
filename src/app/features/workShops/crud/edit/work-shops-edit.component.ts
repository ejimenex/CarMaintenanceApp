import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { WorkshopService, WorkshopEditRequest } from '../../../../utils/worksShop.service';
import { AlertService } from '../../../../utils/alert.service';
import { CatalogService, Catalog } from '../../../../utils/catalog.service';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-work-shops-edit',
  templateUrl: './work-shops-edit.component.html',
  styleUrls: ['./work-shops-edit.component.scss'],
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    TranslateModule
  ],
  providers: [
    WorkshopService,
    AlertService,
    CatalogService
  ],
  standalone: true
})
export class WorkShopsEditComponent implements OnInit {
  workshopForm: FormGroup;
  loading = false;
  workshopId: string | null = null;
  workShopTypes: Catalog[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private workshopService: WorkshopService,
    private router: Router,
    private route: ActivatedRoute,
    private alertService: AlertService,
    private translateService: TranslateService,
    private catalogService: CatalogService
  ) {
    this.workshopForm = this.createForm();
  }

  ngOnInit() {
    this.workshopId = this.route.snapshot.paramMap.get('id');
    this.loadWorkShopTypes();
    if (this.workshopId) {
      this.loadWorkshop();
    } else {
      this.alertService.showError(this.translateService.instant('workshops.edit.error.invalidId'));
      this.router.navigate(['/workshops']);
    }
  }

  private createForm(): FormGroup {
    return this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      address: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(200)]],
      phone: ['', [Validators.required, Validators.pattern(/^[\+]?[0-9\s\-\(\)]{7,15}$/)]],
      worksShopTypeId: ['', [Validators.required]]
    });
  }

  private loadWorkshop() {
    if (!this.workshopId) return;

    this.loading = true;
    this.workshopService.getByIdWorksShop(this.workshopId).pipe(
      catchError((error: any) => {
        console.error('Error loading workshop:', error);
        this.alertService.showError(this.translateService.instant('workshops.edit.error.load'));
        this.router.navigate(['/workshops']);
        return of(null);
      }),
      finalize(() => {
        this.loading = false;
      })
    ).subscribe({
      next: (response: any) => {
        if (response && response.success) {
          const workshop = response.data;
          this.workshopForm.patchValue({
            name: workshop.name || '',
            address: workshop.address || '',
            phone: workshop.phone || '',
            worksShopTypeId: workshop.worksShopTypeId || ''
          });
        } else {
          this.alertService.showError(response?.message || this.translateService.instant('workshops.edit.error.load'));
          this.router.navigate(['/workshops']);
        }
      }
    });
  }

  getFieldError(fieldName: string): string {
    const field = this.workshopForm.get(fieldName);
    if (!field || !field.errors || !field.touched) {
      return '';
    }

    const errors = field.errors;
    
    if (errors['required']) {
      return this.translateService.instant('workshops.form.errors.required', { field: this.translateService.instant(`workshops.form.${fieldName}.label`) });
    }
    
    if (errors['minlength']) {
      return this.translateService.instant('workshops.form.errors.minLength', { 
        field: this.translateService.instant(`workshops.form.${fieldName}.label`),
        min: errors['minlength'].requiredLength 
      });
    }
    
    if (errors['maxlength']) {
      return this.translateService.instant('workshops.form.errors.maxLength', { 
        field: this.translateService.instant(`workshops.form.${fieldName}.label`),
        max: errors['maxlength'].requiredLength 
      });
    }
    
    if (errors['pattern']) {
      return this.translateService.instant('workshops.form.errors.pattern', { field: this.translateService.instant(`workshops.form.${fieldName}.label`) });
    }

    return this.translateService.instant('workshops.form.errors.invalid', { field: this.translateService.instant(`workshops.form.${fieldName}.label`) });
  }

  updateWorkshop() {
    if (this.workshopForm.invalid || !this.workshopId) {
      this.markFormGroupTouched();
      this.alertService.showError(this.translateService.instant('workshops.form.errors.invalidForm'));
      return;
    }

    this.loading = true;
    const formData = this.workshopForm.value;

    this.workshopService.editWorksShop(this.workshopId, { ...formData, id: this.workshopId }).pipe(
      catchError((error: any) => {
        console.error('Error updating workshop:', error);
        this.alertService.showError(this.translateService.instant('workshops.edit.error.update'));
        return of(null);
      }),
      finalize(() => {
        this.loading = false;
      })
    ).subscribe({
      next: (response: any) => {
        if (response && response.success) {
          this.alertService.showSuccess(this.translateService.instant('workshops.edit.success'));
          this.router.navigate(['/workshops']);
        } else {
          this.alertService.showError(response.message,response.errors);
        }
      }
    });
  }

  private loadWorkShopTypes() {
    this.catalogService.getworkShopType().pipe(
      catchError(error => {
        console.error('Error loading workshop types:', error);
        this.alertService.showError(this.translateService.instant('workshops.form.errors.loadTypes'));
        return of(null);
      })
    ).subscribe({
      next: (response: any) => {
        if (response && response.success) {
          this.workShopTypes = response.data || [];
        } else {
          this.alertService.showError(response?.message || this.translateService.instant('workshops.form.errors.loadTypes'));
        }
      }
    });
  }

  private markFormGroupTouched() {
    Object.keys(this.workshopForm.controls).forEach(key => {
      const control = this.workshopForm.get(key);
      control?.markAsTouched();
    });
  }

  cancelForm() {
    this.alertService.showConfirm(
      this.translateService.instant('workshops.edit.cancelConfirm')
    ).then(result => {
      if (result) {
        this.router.navigate(['/workshops']);
      }
    });
  }

  exitScreen() {
    this.alertService.showConfirm(
      this.translateService.instant('workshops.edit.exitConfirm')
    ).then(result => {
      if (result) {
        this.router.navigate(['/workshops']);
      }
    });
  }
}