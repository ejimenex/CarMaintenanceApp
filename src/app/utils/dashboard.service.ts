import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService, CrudService, ApiResponse, QueryParams } from './api.service';

// Example interfaces for different entities
export interface DashboardModel
{
  
  totalMaintenances: number;            
  totalCostPart: number;       
  totalCostFuel: number;
  totalCostTaxes: number;
  totalCostInsurance: number;//select field from catalog.service getUnitOfMeasure()
  totalCostMaintenance: number;
  lastUpdate?:Date;
}



@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private getService: CrudService<DashboardModel>;
  constructor(private apiService: ApiService) {
    // Initialize CRUD services for different entities
            this.getService = this.apiService.createCrudService<DashboardModel>({
              endpoint: 'Dashboard',
              retryAttempts: 3
            });
        
  }

  // User CRUD operations
  getDashBoard(): Observable<ApiResponse<DashboardModel>> {
    return this.getService.getOneWithoutParams();
  }  
  


}

