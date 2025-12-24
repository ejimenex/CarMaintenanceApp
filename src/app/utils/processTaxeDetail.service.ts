import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService, CrudService, ApiResponse, QueryParams } from './api.service';

// Example interfaces for different entities
export interface ProccessTaxeDetail
{
  processHeaderId: string;
  description: string; 
  amount: number; 
  currency: string;  
  id: string;
}



@Injectable({
  providedIn: 'root'
})
export class ProcessTaxeDetailService {
  private processTaxeDetailService: CrudService<ProccessTaxeDetail>;
  private getByProcessHeaderIdDetailService: CrudService<ProccessTaxeDetail>;
  constructor(private apiService: ApiService) {
    // Initialize CRUD services for different entities
            this.processTaxeDetailService = this.apiService.createCrudService<ProccessTaxeDetail>({
              endpoint: 'processTaxeDetail',
              retryAttempts: 3
            });
            this.getByProcessHeaderIdDetailService = this.apiService.createCrudService<ProccessTaxeDetail>({
              endpoint: 'processTaxeDetail/GteByHeader',
              retryAttempts: 3
            });
      
 
  }

  // User CRUD operations
  getByHeader(id:string): Observable<ApiResponse<ProccessTaxeDetail[]>> {
    return this.getByProcessHeaderIdDetailService.getByEndpoint(id);
  }  
  
editProcessHeader(id:string,data:ProccessTaxeDetail):Observable<ApiResponse<ProccessTaxeDetail>>
{
return this.processTaxeDetailService.update(id,data)
}
getByIdProcessHeader(id:string):Observable<ApiResponse<ProccessTaxeDetail>>
{
return this.processTaxeDetailService.getById(id)
}
createProcessHeader(data:ProccessTaxeDetail):Observable<ApiResponse<ProccessTaxeDetail>>
{
return this.processTaxeDetailService.create(data)
}

deleteProcessHeader(id: string): Observable<ApiResponse<any>> {
  return this.processTaxeDetailService.delete(id);
}

}

