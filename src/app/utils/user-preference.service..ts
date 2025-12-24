import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService, CrudService, ApiResponse, QueryParams } from './api.service';

export interface UserPreference {
  id?: number;
  languageId: string;
  countryId: string;
  currencyId: string;
  themeColor?: string;
  pushEnabled: boolean;
  emailEnabled: boolean;
  notifyBeforeDays: boolean;
  notifyBeforeKm: boolean;
}

// Interface para actualizar solo las preferencias de notificación
export interface NotificationPreferences {
  pushEnabled?: boolean;
  emailEnabled?: boolean;
  notifyBeforeDays?: boolean;
  notifyBeforeKm?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class UserPreferenceService {

  private userPreferenceService: CrudService<UserPreference>;

  constructor(private apiService: ApiService) {
    this.userPreferenceService = this.apiService.createCrudService<UserPreference>({
      endpoint: 'userpreference',
      retryAttempts: 3
    });
  }

  // Obtener preferencias del usuario
  getUserPreference(): Observable<ApiResponse<UserPreference>> {
    return this.userPreferenceService.getOneWithOutParams();
  }

  // Crear preferencias del usuario
  createUserPreference(preference: Partial<UserPreference>): Observable<ApiResponse<UserPreference>> {
    return this.userPreferenceService.create(preference);
  }

  // Actualizar preferencias del usuario por ID
  updateUserPreference(id: number, preference: Partial<UserPreference>): Observable<ApiResponse<UserPreference>> {
    return this.userPreferenceService.update(id, preference);
  }

  // Actualizar solo las preferencias de notificación (PATCH parcial)
  updateNotificationPreferences(preferences: NotificationPreferences): Observable<ApiResponse<UserPreference>> {
    return this.userPreferenceService.patchWithBodyOnly(preferences);
  }
} 