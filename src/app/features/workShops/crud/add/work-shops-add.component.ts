import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { WorkshopService, WorkshopCreateRequest } from '../../../../utils/worksShop.service';
import { AlertService } from '../../../../utils/alert.service';
import { CatalogService, Catalog } from '../../../../utils/catalog.service';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-work-shops-add',
  templateUrl: './work-shops-add.component.html',
  styleUrls: ['./work-shops-add.component.scss'],
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
export class WorkShopsAddComponent implements OnInit {
  workshopForm: FormGroup;
  loading = false;
  workShopTypes: Catalog[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private workshopService: WorkshopService,
    private router: Router,
    private alertService: AlertService,
    private translateService: TranslateService,
    private catalogService: CatalogService
  ) {
    this.workshopForm = this.createForm();
  }

  ngOnInit() {
    this.loadWorkShopTypes();
  }

  private createForm(): FormGroup {
    return this.formBuilder.group({
      // name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      // address: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(200)]],
      name: [''],
      address: [''],
      phone: ['', [ Validators.pattern(/^[\+]?[0-9\s\-\(\)]{7,15}$/)]],
      worksShopTypeId: ['', [Validators.required]]
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

  saveWorkshop() {
    if (this.workshopForm.invalid) {
      this.markFormGroupTouched();
      this.alertService.showError(this.translateService.instant('workshops.form.errors.invalidForm'));
      return;
    }

    this.loading = true;
    const formData = this.workshopForm.value;

    this.workshopService.createWorksShop(formData).pipe(
      catchError(error => {
        console.error('Error creating workshop:', error);
        this.alertService.showError(this.translateService.instant('workshops.add.error'));
        return of(null);
      }),
      finalize(() => {
        this.loading = false;
      })
    ).subscribe({
      next: (response: any) => {
        debugger
        if (response && response.success) {
          this.alertService.showSuccess(this.translateService.instant('workshops.add.success'));
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
      this.translateService.instant('workshops.add.cancelConfirm')
    ).then(result => {
      if (result) {
        this.router.navigate(['/workshops']);
      }
    });
  }

  exitScreen() {
    this.alertService.showConfirm(
      this.translateService.instant('workshops.add.exitConfirm')
    ).then(result => {
      if (result) {
        this.router.navigate(['/workshops']);
      }
    });
  }
}