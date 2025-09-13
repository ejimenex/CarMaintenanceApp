import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService, CrudService, ApiResponse, QueryParams } from './api.service';

// Example interfaces for different entities
export interface User {
  id?: number;
  name: string;
  email: string;
  role: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Product {
  id?: number;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Order {
  id?: number;
  userId: number;
  products: number[];
  total: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  createdAt?: Date;
  updatedAt?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class ExampleService {

  private userService: CrudService<User>;
  private productService: CrudService<Product>;
  private orderService: CrudService<Order>;

  constructor(private apiService: ApiService) {
    // Initialize CRUD services for different entities
    this.userService = this.apiService.createCrudService<User>({
      endpoint: 'users',
      retryAttempts: 3
    });

    this.productService = this.apiService.createCrudService<Product>({
      endpoint: 'products',
      retryAttempts: 3
    });

    this.orderService = this.apiService.createCrudService<Order>({
      endpoint: 'orders',
      retryAttempts: 3
    });
  }

  // User CRUD operations
  getUsers(params?: QueryParams): Observable<ApiResponse<User[]>> {
    return this.userService.getAll(params);
  }

  getUserById(id: number): Observable<ApiResponse<User>> {
    return this.userService.getById(id);
  }

  createUser(user: Partial<User>): Observable<ApiResponse<User>> {
    return this.userService.create(user);
  }

  updateUser(id: number, user: Partial<User>): Observable<ApiResponse<User>> {
    return this.userService.update(id, user);
  }

  deleteUser(id: number): Observable<ApiResponse<void>> {
    return this.userService.delete(id);
  }

  searchUsers(query: string): Observable<ApiResponse<User[]>> {
    return this.userService.search(query);
  }

  // Product CRUD operations
  getProducts(params?: QueryParams): Observable<ApiResponse<Product[]>> {
    return this.productService.getAll(params);
  }

  getProductById(id: number): Observable<ApiResponse<Product>> {
    return this.productService.getById(id);
  }

  createProduct(product: Partial<Product>): Observable<ApiResponse<Product>> {
    return this.productService.create(product);
  }

  updateProduct(id: number, product: Partial<Product>): Observable<ApiResponse<Product>> {
    return this.productService.update(id, product);
  }

  patchProduct(id: number, product: Partial<Product>): Observable<ApiResponse<Product>> {
    return this.productService.patch(id, product);
  }

  deleteProduct(id: number): Observable<ApiResponse<void>> {
    return this.productService.delete(id);
  }

  bulkDeleteProducts(ids: number[]): Observable<ApiResponse<void>> {
    return this.productService.bulkDelete(ids);
  }

  uploadProductImage(id: number, file: File): Observable<ApiResponse<Product>> {
    return this.productService.uploadFile(id, file, 'image');
  }

  // Order CRUD operations
  getOrders(params?: QueryParams): Observable<ApiResponse<Order[]>> {
    return this.orderService.getAll(params);
  }

  getOrderById(id: number): Observable<ApiResponse<Order>> {
    return this.orderService.getById(id);
  }

  createOrder(order: Partial<Order>): Observable<ApiResponse<Order>> {
    return this.orderService.create(order);
  }

  updateOrder(id: number, order: Partial<Order>): Observable<ApiResponse<Order>> {
    return this.orderService.update(id, order);
  }

  deleteOrder(id: number): Observable<ApiResponse<void>> {
    return this.orderService.delete(id);
  }

  // Custom endpoint examples
  getUserOrders(userId: number): Observable<ApiResponse<Order[]>> {
    return this.orderService.getByEndpoint(`user/${userId}/orders`);
  }

  getProductsByCategory(category: string): Observable<ApiResponse<Product[]>> {
    return this.productService.getByEndpoint('category', { category });
  }

  processOrder(orderId: number): Observable<ApiResponse<Order>> {
    return this.orderService.postToEndpoint(`${orderId}/process`, {});
  }

  // Advanced query examples
  getProductsWithPagination(page: number = 1, limit: number = 10): Observable<ApiResponse<Product[]>> {
    return this.productService.getAll({
      page,
      limit,
      sort: 'createdAt',
      order: 'desc'
    });
  }

  searchProductsByName(name: string, category?: string): Observable<ApiResponse<Product[]>> {
    const params: QueryParams = { search: name };
    if (category) {
      params.category = category;
    }
    return this.productService.search(name, params);
  }

  getUsersByRole(role: string, page: number = 1): Observable<ApiResponse<User[]>> {
    return this.userService.getAll({
      role,
      page,
      limit: 20,
      sort: 'name',
      order: 'asc'
    });
  }
}

// Example component usage
export class ExampleComponent {
  constructor(private exampleService: ExampleService) {}

  async loadUsers() {
    try {
      const response = await this.exampleService.getUsers({
        page: 1,
        limit: 10,
        sort: 'name',
        order: 'asc'
      }).toPromise();

      if (response?.success) {
        console.log('Users loaded:', response.data);
      }
    } catch (error) {
      console.error('Error loading users:', error);
    }
  }

  async createNewUser() {
    const newUser: Partial<User> = {
      name: 'John Doe',
      email: 'john@example.com',
      role: 'user'
    };

    try {
      const response = await this.exampleService.createUser(newUser).toPromise();
      if (response?.success) {
        console.log('User created:', response.data);
      }
    } catch (error) {
      console.error('Error creating user:', error);
    }
  }

  async updateUserInfo(userId: number) {
    const updates: Partial<User> = {
      name: 'Jane Doe',
      role: 'admin'
    };

    try {
      const response = await this.exampleService.updateUser(userId, updates).toPromise();
      if (response?.success) {
        console.log('User updated:', response.data);
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  }

  async deleteUser(userId: number) {
    try {
      const response = await this.exampleService.deleteUser(userId).toPromise();
      if (response?.success) {
        console.log('User deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  }

  async searchProducts(query: string) {
    try {
      const response = await this.exampleService.searchProductsByName(query).toPromise();
      if (response?.success) {
        console.log('Search results:', response.data);
      }
    } catch (error) {
      console.error('Error searching products:', error);
    }
  }
} 