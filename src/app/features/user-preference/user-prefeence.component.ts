import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from '../../utils/alert.service';
import { ApiResponse } from '../../utils/api.service';
import { Catalog, CatalogService } from 'src/app/utils/catalog.service';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { 
  IonHeader, 
  IonToolbar, 
  IonButtons, 
  IonMenuButton, 
  IonTitle, 
  IonContent, 
  IonButton, 
  IonIcon, 
  IonSelect, 
  IonSelectOption, 
  IonSpinner, 
  IonFooter 
} from '@ionic/angular/standalone';
import { UserPreference, UserPreferenceService } from 'src/app/utils/user-preference.service.';

@Component({
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    ReactiveFormsModule, 
    TranslateModule,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonMenuButton,
    IonTitle,
    IonContent,
    IonButton,
    IonIcon,
    IonSelect,
    IonSelectOption,
    IonSpinner,
    IonFooter
  ],
  selector: 'app-user-preference',
  templateUrl: './user-preference.component.html',
  styleUrls: ['./user-preference.component.scss']
})
export class UserPreferenceComponent implements OnInit {
  preferenceForm: FormGroup;
  languages: Catalog[] = [];
  countries: Catalog[] = [];
  currencies: Catalog[] = [];
  isLoading = false;
  showSuccessMessage = false;

  constructor(
    private formBuilder: FormBuilder,
    private catalogService: CatalogService,
    private userPreferenceService: UserPreferenceService,
    private alertService: AlertService,
    private translateService: TranslateService,
    private router: Router
  ) {
    this.preferenceForm = this.formBuilder.group({
      languageId: ['', Validators.required],
      countryId: ['', Validators.required],
      currencyId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadCatalogs();
    this.loadUserPreferences();
  }

  loadCatalogs(): void {
    // Load languages
    this.catalogService.getLanguage().subscribe({
      next: (response: ApiResponse<Catalog[]>) => {
        if (response.success && response.data) {
          this.languages = response.data;
        }
      },
      error: (error: any) => {
        console.error('Error loading languages:', error);
        this.alertService.showError('Failed to load languages');
      }
    });

    // Load countries
    this.catalogService.getCountry().subscribe({
      next: (response: ApiResponse<Catalog[]>) => {
        if (response.success && response.data) {
          this.countries = response.data;
        }
      },
      error: (error: any) => {
        console.error('Error loading countries:', error);
        this.alertService.showError('Failed to load countries');
      }
    });

    // Load currencies
    this.catalogService.getCurrency().subscribe({
      next: (response: ApiResponse<Catalog[]>) => {
        if (response.success && response.data) {
          this.currencies = response.data;
        }
      },
      error: (error: any) => {
        console.error('Error loading currencies:', error);
        this.alertService.showError('Failed to load currencies');
      }
    });
  }

  loadUserPreferences(): void {
    // Load existing user preferences from localStorage or API
    this.userPreferenceService.getUserPreference().subscribe({
        next: (response: ApiResponse<UserPreference>) => {
          if (response.success && response.data) {
            this.preferenceForm.patchValue({
              languageId: response.data.languageId,
              countryId: response.data.countryId,
              currencyId: response.data.currencyId
            });
          }
        },
        error: (error: any) => {
          console.error('Error loading currencies:', error);
          this.alertService.showError('Failed to load currencies');
        }
      });
  }

  savePreferences(): void {
    if (this.preferenceForm.valid) {
      this.isLoading = true;
      this.showSuccessMessage = false;

      const preferences = this.preferenceForm.value;

      // Save to localStorage (you can replace this with API call)
     

        this.userPreferenceService.createUserPreference(preferences).subscribe({
          next: (response: ApiResponse<UserPreference>) => {
            if(response.success){
            this.alertService.showSuccess('Preferences saved successfully!');
            this.isLoading = false;}
            else{
              this.alertService.showError(response.message || 'Failed to save preferences');
              this.isLoading = false;
            }
          },
          error: (error: any) => {
            this.alertService.showError('Failed to save preferences');
            this.isLoading = false;
          }
        // Simulate API call delay
       
      })
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.preferenceForm.controls).forEach(key => {
      const control = this.preferenceForm.get(key);
      control?.markAsTouched();
    });
  }

  cancelForm(): void {
    if (this.preferenceForm.dirty) {
      this.alertService.showConfirm(
        this.translateService.instant('common.unsavedChanges')
      ).then((confirmed) => {
        if (confirmed) {
          this.resetForm();
          this.router.navigate(['/']);
        }
      });
    } else {
      this.router.navigate(['/']);
    }
  }

  exitScreen(): void {
    if (this.preferenceForm.dirty) {
      this.alertService.showConfirm(
        this.translateService.instant('common.unsavedChanges')
      ).then((confirmed) => {
        if (confirmed) {
          this.resetForm();
          this.router.navigate(['/']);
        }
      });
    } else {
      this.router.navigate(['/']);
    }
  }

  private resetForm(): void {
    this.preferenceForm.reset();
    this.showSuccessMessage = false;
  }
}
