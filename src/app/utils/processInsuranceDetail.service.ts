import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService, CrudService, ApiResponse, QueryParams } from './api.service';

// Example interfaces for different entities
export interface ProccessInsuranceDetail
{
  policyNumber: string;       
  coverageStartDate?: Date;
  coverageEndDate?: Date;
  amount: number;  
  InsuranceAmount: number; 
  currency: string;         
  processHeaderId: string;    
}



@Injectable({
  providedIn: 'root'
})
export class ProcessInsuranceDetailService {
  private processInsuranceDetailService: CrudService<ProccessInsuranceDetail>;
  private getByProcessHeaderIdDetailService: CrudService<ProccessInsuranceDetail>;
  constructor(private apiService: ApiService) {
    // Initialize CRUD services for different entities
            this.processInsuranceDetailService = this.apiService.createCrudService<ProccessInsuranceDetail>({
              endpoint: 'processDetailInsurance',
              retryAttempts: 3
            });
            this.getByProcessHeaderIdDetailService = this.apiService.createCrudService<ProccessInsuranceDetail>({
              endpoint: 'processDetailInsurance/GteByHeader',
              retryAttempts: 3
            });
      
 
  }

  // User CRUD operations
  getByHeader(id:string): Observable<ApiResponse<ProccessInsuranceDetail[]>> {
    return this.getByProcessHeaderIdDetailService.getByEndpoint(id);
  }  
  
editProcessHeader(id:string,data:ProccessInsuranceDetail):Observable<ApiResponse<ProccessInsuranceDetail>>
{
return this.processInsuranceDetailService.update(id,data)
}
getByIdProcessHeader(id:string):Observable<ApiResponse<ProccessInsuranceDetail>>
{
return this.processInsuranceDetailService.getById(id)
}
createProcessHeader(data:ProccessInsuranceDetail):Observable<ApiResponse<ProccessInsuranceDetail>>
{
return this.processInsuranceDetailService.create(data)
}

deleteProcessHeader(id: string): Observable<ApiResponse<any>> {
  return this.processInsuranceDetailService.delete(id);
}

}

