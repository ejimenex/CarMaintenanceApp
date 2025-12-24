import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService, CrudService, ApiResponse, QueryParams } from './api.service';

// Example interfaces for different entities
export interface DashboardVehicleModel
{
  
  totalMaintenances?: number;            
  totalCostPart?: number;       
  totalCostFuel?: number;
  totalCostTaxes?: number;
  totalCostInsurance?: number;//select field from catalog.service getUnitOfMeasure()
  totalCostMaintenance?: number;
  lastUpdate?:Date;
  vehicleName: string;
}

export interface DashboardVehicleFilter
{
  
 vehicleId: string;
 yearTo: number;
 yearFrom: number;
 monthTo: number;
 monthFrom: number;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardVehicleService {
  private getService: CrudService<DashboardVehicleModel>;
  constructor(private apiService: ApiService) {
    // Initialize CRUD services for different entities
            this.getService = this.apiService.createCrudService<DashboardVehicleModel>({
              endpoint: 'DashboardVehicle',
              retryAttempts: 3
            });
        
  }

  // User CRUD operations
  getDashBoard(filter: DashboardVehicleFilter): Observable<ApiResponse<DashboardVehicleModel>> {
    return this.getService.getOneWithParams({vehicleId: filter.vehicleId, yearTo: filter.yearTo, yearFrom: filter.yearFrom, monthTo: filter.monthTo, monthFrom: filter.monthFrom});
  }  
  


}

