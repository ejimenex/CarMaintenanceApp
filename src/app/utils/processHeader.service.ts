import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService, CrudService, ApiResponse, QueryParams } from './api.service';

// Example interfaces for different entities
export interface ProccessHeaderModel 
{
  name: string;            
  vehicleId: string;           
  processType: string;       
  startDate: Date;  
  endDate: Date; 
  model?: string;         
  note?: number;        
  tradeId: string;    
}

export interface ProcessHeaderGetRequest {
  id: string;          
  name: string;
  vehicleId: string;
  vehicleName: string;
  processType: string;
  processNumber: string;
  startDate?: Date;        
  endDate?: Date;       
  notes: string;
  tradeId: string;
  tradeName?: string;
  totalAmount?: number;
 
}

@Injectable({
  providedIn: 'root'
})
export class ProcessHeaderService {
  private processHeaderService: CrudService<ProccessHeaderModel>;
  private processHeaderGetService: CrudService<ProcessHeaderGetRequest>;
  constructor(private apiService: ApiService) {
    // Initialize CRUD services for different entities
        this.processHeaderService = this.apiService.createCrudService<ProccessHeaderModel>({
          endpoint: 'processheader',
          retryAttempts: 3
        });
        this.processHeaderGetService = this.apiService.createCrudService<ProcessHeaderGetRequest>({
          endpoint: 'processheader',
          retryAttempts: 3
        });
 
  }

  // User CRUD operations
  getProcessHeaderPaged(page:number, globalSearch:string): Observable<ApiResponse<ProcessHeaderGetRequest[]>> {
    return this.processHeaderGetService.getAll({
      pageNumber: page,
      pageSize: 10,
      sortBy: 'createdAt',
      order: 'desc',
      globalSearch: globalSearch
    });
  }  
  
editProcessHeader(id:string,data:ProccessHeaderModel):Observable<ApiResponse<ProccessHeaderModel>>
{
return this.processHeaderService.update(id,data)
}
getByIdProcessHeader(id:string):Observable<ApiResponse<ProccessHeaderModel>>
{
return this.processHeaderService.getById(id)
}
createProcessHeader(data:ProccessHeaderModel):Observable<ApiResponse<ProccessHeaderModel>>
{
return this.processHeaderService.create(data)
}

deleteProcessHeader(id: string): Observable<ApiResponse<any>> {
  return this.processHeaderService.delete(id);
}

}

