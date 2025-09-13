import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService, CrudService, ApiResponse, QueryParams } from './api.service';

// Example interfaces for different entities
export interface UserPreference {
  id?: number;
  languageId: string;
  countryId: string;
  currencyId: string;
}


@Injectable({
  providedIn: 'root'
})
export class UserPreferenceService {

  private userPreferenceService: CrudService<UserPreference>;

  constructor(private apiService: ApiService) {
    // Initialize CRUD services for different entities
    this.userPreferenceService = this.apiService.createCrudService<UserPreference>({
      endpoint: 'userpreference',
      retryAttempts: 3
    });
   
  }
  // User CRUD operations
  getUserPreference(): Observable<ApiResponse<UserPreference>> {
    return this.userPreferenceService.getOneWithOutParams();
  }

  createUserPreference(user: Partial<UserPreference>): Observable<ApiResponse<UserPreference>> {
    return this.userPreferenceService.create(user);
  }

  
} 