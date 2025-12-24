import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiService, CrudService, ApiResponse, QueryParams } from './api.service';
import { environment } from '../../environments/environment';

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
  imageUrl?: string;       // optional - URL de la imagen
}
export interface VehicleEditRequest extends VehicleCreateRequest
{
  id: string;
  
}
export interface LabelValueDto{
  label: string;
  value: string;
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
  imageUrl?: string; // URL de la imagen desde el backend
}

@Injectable({
  providedIn: 'root'
})
export class VehicleService {
  private vehicleEditService: CrudService<VehicleEditRequest>;
  private vehicleService: CrudService<VehicleCreateRequest>;
  private vehicleGetService: CrudService<VehicleGetRequest>;
  private labelValueDtoService: CrudService<LabelValueDto>;
  constructor(
    private apiService: ApiService,
    private http: HttpClient
  ) {
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
        this.labelValueDtoService = this.apiService.createCrudService<LabelValueDto>({
          endpoint: 'vehicle/getall',
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
getByIdVehicle(id:string):Observable<ApiResponse<VehicleGetRequest>>
{
return this.vehicleGetService.getById(id)
}
createVehicle(data:VehicleCreateRequest):Observable<ApiResponse<VehicleCreateRequest>>
{
return this.vehicleService.create(data)
}

deleteVehicle(id: string): Observable<ApiResponse<any>> {
  return this.vehicleService.delete(id);
}
getAll(): Observable<ApiResponse<LabelValueDto[]>> {
  return this.labelValueDtoService.getAllWithoutParams();
}

/**
 * Create vehicle with images using FormData
 * NO Base64 - Uses multipart/form-data
 */
createVehicleWithImages(formData: FormData): Observable<ApiResponse<any>> {
  

  return this.vehicleService.createFormData(formData)
}

/**
 * Update vehicle with images using FormData
 */
updateVehicleWithImages(id: string, formData: FormData): Observable<ApiResponse<any>> {
 return this.vehicleService.updateWithFormData(id, formData) 
}

}

