import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService, CrudService, ApiResponse, QueryParams } from './api.service';

// Example interfaces for different entities
export interface WorkshopCreateRequest 
{
  name: string;            // required
  address: string;           // Guid as string
  phone: string;       // Guid as string
  workshopTypeId: string;   // Guid as string
}
export interface WorkshopEditRequest extends WorkshopCreateRequest
{
  id: string;
  
}
export interface WorkshopGetRequest {
  id: string;              
  name: string;            // required
  address: string;          
  phone: string;       // Guid as string
  workshopTypeId: string; 
  worksShopTypeName: string;
}

@Injectable({
  providedIn: 'root'
})
export class WorkshopService {
  private workshopEditService: CrudService<WorkshopEditRequest>;
  private workShopCreateService: CrudService<WorkshopCreateRequest>;
  private workshopGetService: CrudService<WorkshopGetRequest>;
  constructor(private apiService: ApiService) {
    // Initialize CRUD services for different entities
        this.workShopCreateService = this.apiService.createCrudService<WorkshopCreateRequest>({
          endpoint: 'worksShop',
          retryAttempts: 3
        });
        this.workshopEditService = this.apiService.createCrudService<WorkshopEditRequest>({
          endpoint: 'worksShop',
          retryAttempts: 3
        });
        this.workshopGetService = this.apiService.createCrudService<WorkshopGetRequest>({
          endpoint: 'worksShop',
          retryAttempts: 3
        });
 
  }

  // User CRUD operations
  getWorksShopPaged(page:number, globalSearch:string): Observable<ApiResponse<WorkshopGetRequest[]>> {
    return this.workshopGetService.getAll({
      pageNumber: page,
      pageSize: 10,
      sortBy: 'createdAt',
      order: 'desc',
      globalSearch: globalSearch
    });
  }  
  
editWorksShop(id:string,data:WorkshopEditRequest):Observable<ApiResponse<WorkshopEditRequest>>
{
return this.workshopEditService.update(id,data)
}
getByIdWorksShop(id:string):Observable<ApiResponse<WorkshopEditRequest>>
{
return this.workshopEditService.getById(id)
}
createWorksShop(data:WorkshopCreateRequest):Observable<ApiResponse<WorkshopCreateRequest>>
{
return this.workShopCreateService.create(data)
}

deleteWorksShop(id: string): Observable<ApiResponse<any>> {
  return this.workShopCreateService.delete(id);
}

}

