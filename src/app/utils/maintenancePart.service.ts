import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService, CrudService, ApiResponse, QueryParams } from './api.service';

// Example interfaces for different entities
export interface MaintenancePart
{
  id: string;
  name: string;            
  quantity: number;       
  cost: number;
  unitOfMeasure: string;//select field from catalog.service getUnitOfMeasure()
  totalCost: number;
  processHeaderId?:string;
}



@Injectable({
  providedIn: 'root'
})
export class MaintenancePartService {
  private detailService: CrudService<MaintenancePart>;
  private getByMaintenancePartIdDetailService: CrudService<MaintenancePart>;
  constructor(private apiService: ApiService) {
    // Initialize CRUD services for different entities
            this.detailService = this.apiService.createCrudService<MaintenancePart>({
              endpoint: 'MaintenancePart',
              retryAttempts: 3
            });
            this.getByMaintenancePartIdDetailService = this.apiService.createCrudService<MaintenancePart>({
              endpoint: 'MaintenancePart/GteByHeader',
              retryAttempts: 3
            });
  }

  // User CRUD operations
  getByHeader(id:string): Observable<ApiResponse<MaintenancePart[]>> {
    return this.getByMaintenancePartIdDetailService.getByEndpoint(id);
  }  
  
editMaintenancePart(id:string,data:MaintenancePart):Observable<ApiResponse<MaintenancePart>>
{
return this.detailService.update(id,data)
}
getByIdMaintenancePart(id:string):Observable<ApiResponse<MaintenancePart>>
{
return this.detailService.getById(id)
}
createMaintenancePart(data:MaintenancePart):Observable<ApiResponse<MaintenancePart>>
{
return this.detailService.create(data)
}

deleteMaintenancePart(id: string): Observable<ApiResponse<any>> {
  return this.detailService.delete(id);
}

}

