import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService, CrudService, ApiResponse, QueryParams } from './api.service';
import { MaintenancePart } from './maintenancePart.service';

// Example interfaces for different entities
export interface MaintenanceDetail
{
  id: string;
  name: string;            
  description?: string;       
  diagnosis: string;
  mileage: string;  
  cost: number; 
  Technician?: string;         
  maintenanceTypeId: string; //select field from catalog.service getMaintenanceType()
  maintenanceTypeName:string  
  statusName:string  
  MaintenanceDetailId: string;  
  nextMaintenanceDate?: Date;
  maintenanceParts: MaintenancePart[];
  basicMaintenances:string[];
}



@Injectable({
  providedIn: 'root'
})
export class MaintenanceDetailService {
  private detailService: CrudService<MaintenanceDetail>;
  private getByMaintenanceDetailIdDetailService: CrudService<MaintenanceDetail>;
  constructor(private apiService: ApiService) {
    // Initialize CRUD services for different entities
            this.detailService = this.apiService.createCrudService<MaintenanceDetail>({
              endpoint: 'MaintenanceDetail',
              retryAttempts: 3
            });
            this.getByMaintenanceDetailIdDetailService = this.apiService.createCrudService<MaintenanceDetail>({
              endpoint: 'MaintenanceDetail/GteByHeader',
              retryAttempts: 3
            });
  }

  // User CRUD operations
  getByHeader(id:string): Observable<ApiResponse<MaintenanceDetail[]>> {
    return this.getByMaintenanceDetailIdDetailService.getByEndpoint(id);
  }  
  
editMaintenanceDetail(id:string,data:MaintenanceDetail):Observable<ApiResponse<MaintenanceDetail>>
{
return this.detailService.update(id,data)
}
getByIdMaintenanceDetail(id:string):Observable<ApiResponse<MaintenanceDetail>>
{
return this.detailService.getById(id)
}
createMaintenanceDetail(data:MaintenanceDetail):Observable<ApiResponse<MaintenanceDetail>>
{
return this.detailService.create(data)
}

deleteMaintenanceDetail(id: string): Observable<ApiResponse<any>> {
  return this.detailService.delete(id);
}

}

