import { Brand } from '../../../utils/models/brand';
import { Model } from '../../../utils/models/model';

export interface Vehicle {
  id: string;
  name: string;
  description: string;
  brandId: string;
  modelId: string;
  image: string;
  color: string;
  brand: Brand;
  model: Model;
}

export interface VehicleFormData {
  name: string;
  description: string;
  brandId: string;
  modelId: string;
  image: string;
  color: string;
}

export interface VehicleFilters {
  search?: string;
  name?: string;
  brandId?: string;
  modelId?: string;
  color?: string;
}

export interface VehicleQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  order?: 'asc' | 'desc';
  name?: string;
  brandId?: string;
  modelId?: string;
  color?: string;
} 