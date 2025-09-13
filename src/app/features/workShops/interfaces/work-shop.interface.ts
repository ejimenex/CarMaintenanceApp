// Import interfaces from the service
import { WorkshopGetRequest, WorkshopCreateRequest } from '../../../utils/worksShop.service';

// Re-export with different names
export type WorkShop = WorkshopGetRequest;
export type WorkShopFormData = WorkshopCreateRequest;

export interface WorkShopFilters {
  search?: string;
  name?: string;
  address?: string;
}

export interface WorkShopQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  order?: 'asc' | 'desc';
  name?: string;
  address?: string;
}