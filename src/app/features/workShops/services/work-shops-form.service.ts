import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WorkShopFormData } from '../interfaces/work-shop.interface';

@Injectable({
  providedIn: 'root'
})
export class WorkShopsFormService {

  constructor(private fb: FormBuilder) {}

  /**
   * Create workshop form with validation
   */
  createWorkShopForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      note: ['', [Validators.maxLength(500)]],
      address: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(200)]],
      phone: [null, [Validators.required, Validators.pattern(/^[\+]?[1-9][\d]{0,15}$/)]]
    });
  }

  /**
   * Create workshop form with existing data
   */
  createWorkShopFormWithData(data: Partial<WorkShopFormData>): FormGroup {
    return this.fb.group({
      name: [data.name || '', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      note: [data.note || '', [Validators.maxLength(500)]],
      address: [data.address || '', [Validators.required, Validators.minLength(5), Validators.maxLength(200)]],
      phone: [data.phone || null, [Validators.required, Validators.pattern(/^[\+]?[1-9][\d]{0,15}$/)]]
    });
  }

  /**
   * Get form validation errors
   */
  getFormErrors(form: FormGroup): { [key: string]: string } {
    const errors: { [key: string]: string } = {};

    Object.keys(form.controls).forEach(key => {
      const control = form.get(key);
      if (control && control.errors && control.touched) {
        errors[key] = this.getErrorMessage(key, control.errors);
      }
    });

    return errors;
  }

  /**
   * Get error message for specific field
   */
  getErrorMessage(fieldName: string, errors: any): string {
    if (errors.required) {
      return `${this.getFieldDisplayName(fieldName)} is required`;
    }
    if (errors.minlength) {
      return `${this.getFieldDisplayName(fieldName)} must be at least ${errors.minlength.requiredLength} characters`;
    }
    if (errors.maxlength) {
      return `${this.getFieldDisplayName(fieldName)} must not exceed ${errors.maxlength.requiredLength} characters`;
    }
    if (errors.email) {
      return `${this.getFieldDisplayName(fieldName)} must be a valid email address`;
    }
    if (errors.pattern) {
      return `${this.getFieldDisplayName(fieldName)} format is invalid`;
    }
    if (errors.min) {
      return `${this.getFieldDisplayName(fieldName)} must be at least ${errors.min.min}`;
    }
    if (errors.max) {
      return `${this.getFieldDisplayName(fieldName)} must not exceed ${errors.max.max}`;
    }
    if (errors.minLength) {
      return `${this.getFieldDisplayName(fieldName)} must have at least ${errors.minLength.requiredLength} items`;
    }

    return `${this.getFieldDisplayName(fieldName)} is invalid`;
  }

  /**
   * Get display name for field
   */
  private getFieldDisplayName(fieldName: string): string {
    const displayNames: { [key: string]: string } = {
      name: 'Name',
      note: 'Note',
      address: 'Address',
      phone: 'Phone'
    };

    return displayNames[fieldName] || fieldName;
  }

  /**
   * Validate form
   */
  isFormValid(form: FormGroup): boolean {
    return form.valid && form.dirty;
  }

  /**
   * Mark all fields as touched
   */
  markFormGroupTouched(form: FormGroup): void {
    Object.keys(form.controls).forEach(key => {
      const control = form.get(key);
      if (control) {
        control.markAsTouched();
        if (control instanceof FormGroup) {
          this.markFormGroupTouched(control);
        }
      }
    });
  }

  /**
   * Reset form
   */
  resetForm(form: FormGroup): void {
    form.reset();
    Object.keys(form.controls).forEach(key => {
      const control = form.get(key);
      if (control) {
        control.markAsUntouched();
        control.markAsPristine();
      }
    });
  }

  /**
   * Get form data
   */
  getFormData(form: FormGroup): WorkShopFormData {
    return form.value;
  }

  /**
   * Validate specific field
   */
  isFieldValid(form: FormGroup, fieldName: string): boolean {
    const field = form.get(fieldName);
    return field ? field.valid && (field.dirty || field.touched) : false;
  }

  /**
   * Get field error
   */
  getFieldError(form: FormGroup, fieldName: string): string {
    const field = form.get(fieldName);
    if (field && field.errors && field.touched) {
      return this.getErrorMessage(fieldName, field.errors);
    }
    return '';
  }

  /**
   * Available workshop types
   */
  getWorkShopTypes(): { value: string; label: string }[] {
    return [
      { value: 'repair', label: 'Repair' },
      { value: 'maintenance', label: 'Maintenance' },
      { value: 'inspection', label: 'Inspection' },
      { value: 'custom', label: 'Custom' }
    ];
  }

  /**
   * Available workshop statuses
   */
  getWorkShopStatuses(): { value: string; label: string }[] {
    return [
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' },
      { value: 'maintenance', label: 'Maintenance' }
    ];
  }

  /**
   * Available services
   */
  getAvailableServices(): string[] {
    return [
      'Engine Repair',
      'Transmission Repair',
      'Brake Service',
      'Oil Change',
      'Tire Service',
      'Electrical Repair',
      'Diagnostic Service',
      'Body Work',
      'Paint Service',
      'Glass Repair',
      'AC/Heating Service',
      'Exhaust System',
      'Suspension Service',
      'Battery Service',
      'Fuel System',
      'Custom Work'
    ];
  }

  /**
   * Available equipment
   */
  getAvailableEquipment(): string[] {
    return [
      'Lift',
      'Diagnostic Scanner',
      'Air Compressor',
      'Welding Equipment',
      'Paint Booth',
      'Alignment Machine',
      'Tire Balancer',
      'Brake Lathe',
      'Engine Hoist',
      'Transmission Jack',
      'Battery Charger',
      'AC Machine',
      'Pressure Washer',
      'Sandblaster',
      'Paint Gun',
      'Grinder',
      'Drill Press',
      'Lathe',
      'Milling Machine',
      'CNC Machine'
    ];
  }
} 