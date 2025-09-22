import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService, CrudService, ApiResponse, QueryParams } from './api.service';

// Example interfaces for different entities
export interface Catalog {
  id?: string;
  name: string;
  code: string;  
  translateValue: string;
}

@Injectable({
  providedIn: 'root'
})
export class CatalogService {

  private workShopTypeService: CrudService<Catalog>;
  private languageService: CrudService<Catalog>;
  private countryService: CrudService<Catalog>;
  private currencyService: CrudService<Catalog>;
  private vehicleTypeService: CrudService<Catalog>;
  private colorService: CrudService<Catalog>;
  private brandService: CrudService<Catalog>;
  private vehicleMotorTypeService: CrudService<Catalog>;
  private tradeTypeService: CrudService<Catalog>;

  constructor(private apiService: ApiService) {
    // Initialize CRUD services for different entities
    this.workShopTypeService = this.apiService.createCrudService<Catalog>({
      endpoint: 'workShopType',
      retryAttempts: 3
    });
    this.vehicleMotorTypeService = this.apiService.createCrudService<Catalog>({
      endpoint: 'vehicleMotorType',
      retryAttempts: 3
    });
    this.languageService = this.apiService.createCrudService<Catalog>({
      endpoint: 'language',
      retryAttempts: 3
    });
    this.vehicleTypeService = this.apiService.createCrudService<Catalog>({
      endpoint: 'vehicleType',
      retryAttempts: 3
    });
    this.currencyService = this.apiService.createCrudService<Catalog>({
      endpoint: 'currency',
      retryAttempts: 3
    });

    this.countryService = this.apiService.createCrudService<Catalog>({
      endpoint: 'AvalaibleCountry',
      retryAttempts: 3
    });
    this.colorService = this.apiService.createCrudService<Catalog>({
      endpoint: 'color',
      retryAttempts: 3
    });
        this.brandService = this.apiService.createCrudService<Catalog>({
          endpoint: 'brand',
          retryAttempts: 3
        });
    this.tradeTypeService = this.apiService.createCrudService<Catalog>({
      endpoint: 'tradeType',
      retryAttempts: 3
    });
  }

  // User CRUD operations
  getworkShopType(): Observable<ApiResponse<Catalog[]>> {
    return this.workShopTypeService.getAllWithoutParams();
  }
  getVehicleMotorType(): Observable<ApiResponse<Catalog[]>> {
    return this.vehicleMotorTypeService.getAllWithoutParams();
  }
  getLanguage(): Observable<ApiResponse<Catalog[]>> {
    return this.languageService.getAllWithoutParams();
  }
  getVehicleType(): Observable<ApiResponse<Catalog[]>> {
    return this.vehicleTypeService.getAllWithoutParams();
  }

  getCountry(): Observable<ApiResponse<Catalog[]>> {
    return this.countryService.getAllWithoutParams();
  }
  getCurrency(): Observable<ApiResponse<Catalog[]>> {
    return this.currencyService.getAllWithoutParams();
  }
  getColor(): Observable<ApiResponse<Catalog[]>> {
    return this.colorService.getAllWithoutParams();
  }
  getBrand(): Observable<ApiResponse<Catalog[]>> {
    return this.brandService.getAllWithoutParams();
  }
  getTradeType(): Observable<ApiResponse<Catalog[]>> {
    return this.tradeTypeService.getAllWithoutParams();
  }
  }
