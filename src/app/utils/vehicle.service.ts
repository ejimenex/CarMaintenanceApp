import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService, CrudService, ApiResponse, QueryParams } from './api.service';

// Example interfaces for different entities
export interface VehicleCreateRequest 
{
  name: string;            // required
  color: string;           // Guid as string
  brandCode: string;       // Guid as string
  vehicleTypeId: string;   // Guid as string
  vehicleMotorTypeId: string; // Guid as string
  model?: string;          // optional (nullable in C#)
  mileage?: number;        // decimal → number
  plateNumber: string;     // required
  year?: number | null;    // nullable int
}
export interface VehicleEditRequest extends VehicleCreateRequest
{
  id: string;
  
}
export interface VehicleGetRequest {
  id: string;              
  color: string;
  brand: string;
  vehicleType: string;
  vehicleMotorType: string;
  name: string;        
  brandCode: string;       
  vehicleTypeId: string;
  vehicleMotorTypeId: string;
  model?: string;
  mileage?: number;
  plateNumber: string;
  year?: number | null;
  image?: string;
}

@Injectable({
  providedIn: 'root'
})
export class VehicleService {
  private vehicleEditService: CrudService<VehicleEditRequest>;
  private vehicleService: CrudService<VehicleCreateRequest>;
  private vehicleGetService: CrudService<VehicleGetRequest>;
  constructor(private apiService: ApiService) {
    // Initialize CRUD services for different entities
        this.vehicleService = this.apiService.createCrudService<VehicleCreateRequest>({
          endpoint: 'vehicle',
          retryAttempts: 3
        });
        this.vehicleEditService = this.apiService.createCrudService<VehicleEditRequest>({
          endpoint: 'vehicle',
          retryAttempts: 3
        });
        this.vehicleGetService = this.apiService.createCrudService<VehicleGetRequest>({
          endpoint: 'vehicle',
          retryAttempts: 3
        });
 
  }

  // User CRUD operations
  getVehiclePaged(page:number, globalSearch:string): Observable<ApiResponse<VehicleGetRequest[]>> {
    return this.vehicleGetService.getAll({
      pageNumber: page,
      pageSize: 10,
      sortBy: 'createdAt',
      order: 'desc',
      globalSearch: globalSearch
    });
  }  
  
editVehicle(id:string,data:VehicleEditRequest):Observable<ApiResponse<VehicleEditRequest>>
{
return this.vehicleEditService.update(id,data)
}
getByIdVehicle(id:string):Observable<ApiResponse<VehicleEditRequest>>
{
return this.vehicleEditService.getById(id)
}
createVehicle(data:VehicleCreateRequest):Observable<ApiResponse<VehicleCreateRequest>>
{
return this.vehicleService.create(data)
}

deleteVehicle(id: string): Observable<ApiResponse<any>> {
  return this.vehicleService.delete(id);
}

}

