import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService, CrudService, ApiResponse, QueryParams } from './api.service';

// Example interfaces for different entities
export interface ProccessFuelDetail
{
  processHeaderId: string;            
  unitOfMeasureId: string;       
  unitOfMeasureName: string;
  fuelType: string;  
  fuelAmount: number; 
  fuelPrice?: number;         
  totalCost?: number;        
  notes: string;    
}



@Injectable({
  providedIn: 'root'
})
export class ProcessFuelDetailService {
  private processFuelDetailService: CrudService<ProccessFuelDetail>;
  private getByProcessHeaderIdDetailService: CrudService<ProccessFuelDetail>;
  constructor(private apiService: ApiService) {
    // Initialize CRUD services for different entities
            this.processFuelDetailService = this.apiService.createCrudService<ProccessFuelDetail>({
              endpoint: 'processDetailFuel',
              retryAttempts: 3
            });
            this.getByProcessHeaderIdDetailService = this.apiService.createCrudService<ProccessFuelDetail>({
              endpoint: 'processDetailFuel/GteByHeader',
              retryAttempts: 3
            });
      
 
  }

  // User CRUD operations
  getByHeader(id:string): Observable<ApiResponse<ProccessFuelDetail[]>> {
    return this.getByProcessHeaderIdDetailService.getByEndpoint(id);
  }  
  
editProcessHeader(id:string,data:ProccessFuelDetail):Observable<ApiResponse<ProccessFuelDetail>>
{
return this.processFuelDetailService.update(id,data)
}
getByIdProcessHeader(id:string):Observable<ApiResponse<ProccessFuelDetail>>
{
return this.processFuelDetailService.getById(id)
}
createProcessHeader(data:ProccessFuelDetail):Observable<ApiResponse<ProccessFuelDetail>>
{
return this.processFuelDetailService.create(data)
}

deleteProcessHeader(id: string): Observable<ApiResponse<any>> {
  return this.processFuelDetailService.delete(id);
}

}

