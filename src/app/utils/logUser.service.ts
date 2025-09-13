import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService, CrudService, ApiResponse, QueryParams } from './api.service';

// Example interfaces for different entities
export interface LogUser {
  eventName: string;
  userId: string;
  description: string;
  icon: string;
  createdAt: Date;
}
export interface LogUserStats {
  quantity: number;
  lastLogin: Date;
  language: string;
}

@Injectable({
  providedIn: 'root'
})
export class logUserService {

  private logService: CrudService<LogUser>;
  private logServiceStats: CrudService<LogUserStats>;
  constructor(private apiService: ApiService) {
    // Initialize CRUD services for different entities
        this.logService = this.apiService.createCrudService<LogUser>({
          endpoint: 'LogUserActivity',
          retryAttempts: 3
        });
        this.logServiceStats = this.apiService.createCrudService<LogUserStats>({
          endpoint: 'Auth/GetLoginData',
          retryAttempts: 3
        });
 
  }

  // User CRUD operations
  getLogUser(page:number): Observable<ApiResponse<LogUser[]>> {
    return this.logService.getAll({
      pageNumber: page,
      pageSize: 10,
      sortBy: 'createdAt',
      order: 'desc'
    });
  }  
  getLogUserStats(): Observable<ApiResponse<LogUserStats>> {
    return this.logServiceStats.getOneWithOutParams();
  }

}

