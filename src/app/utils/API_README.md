# Generic CRUD API Service

A comprehensive, type-safe generic CRUD service for Angular applications that provides full CRUD operations for any entity type.

## Features

- **Generic Type Support**: Works with any TypeScript interface
- **Full CRUD Operations**: Create, Read, Update, Delete
- **Advanced Querying**: Pagination, sorting, filtering, searching
- **File Upload/Download**: Built-in file handling
- **Error Handling**: Comprehensive error management with retry logic
- **TypeScript Support**: Fully typed interfaces and responses
- **Custom Endpoints**: Support for custom API endpoints
- **Bulk Operations**: Bulk delete and other batch operations

## Quick Start

### 1. Define Your Entity Interface

```typescript
export interface User {
  id?: number;
  name: string;
  email: string;
  role: string;
  createdAt?: Date;
  updatedAt?: Date;
}
```

### 2. Create CRUD Service

```typescript
import { Injectable } from '@angular/core';
import { ApiService, CrudService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userCrud: CrudService<User>;

  constructor(private apiService: ApiService) {
    this.userCrud = this.apiService.createCrudService<User>({
      endpoint: 'users',
      retryAttempts: 3
    });
  }

  // Use the CRUD service methods
  getUsers() {
    return this.userCrud.getAll();
  }

  createUser(user: Partial<User>) {
    return this.userCrud.create(user);
  }
}
```

## API Reference

### CrudService<T> Methods

#### Basic CRUD Operations

```typescript
// Get all items with optional query parameters
getAll(params?: QueryParams): Observable<ApiResponse<T[]>>

// Get item by ID
getById(id: string | number): Observable<ApiResponse<T>>

// Create new item
create(item: Partial<T>): Observable<ApiResponse<T>>

// Update item by ID
update(id: string | number, item: Partial<T>): Observable<ApiResponse<T>>

// Patch item by ID (partial update)
patch(id: string | number, item: Partial<T>): Observable<ApiResponse<T>>

// Delete item by ID
delete(id: string | number): Observable<ApiResponse<void>>
```

#### Advanced Operations

```typescript
// Bulk delete items
bulkDelete(ids: (string | number)[]): Observable<ApiResponse<void>>

// Search items
search(query: string, params?: QueryParams): Observable<ApiResponse<T[]>>

// Custom endpoint GET
getByEndpoint(endpoint: string, params?: QueryParams): Observable<ApiResponse<T[]>>

// Custom endpoint POST
postToEndpoint(endpoint: string, data: any): Observable<ApiResponse<T>>

// Upload file
uploadFile(id: string | number, file: File, fieldName?: string): Observable<ApiResponse<T>>

// Download file
downloadFile(id: string | number, filename?: string): Observable<Blob>
```

### Query Parameters

```typescript
interface QueryParams {
  page?: number;        // Page number for pagination
  limit?: number;       // Items per page
  search?: string;      // Search term
  sort?: string;        // Field to sort by
  order?: 'asc' | 'desc'; // Sort order
  [key: string]: any;   // Additional custom parameters
}
```

### API Response Format

```typescript
interface ApiResponse<T> {
  data: T;              // The actual data
  message?: string;     // Optional message
  success: boolean;     // Success flag
  errors?: string[];    // Error messages
  pagination?: {        // Pagination info
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
```

## Usage Examples

### Basic CRUD Operations

```typescript
export class UserService {
  private userCrud: CrudService<User>;

  constructor(private apiService: ApiService) {
    this.userCrud = this.apiService.createCrudService<User>({
      endpoint: 'users'
    });
  }

  // Get all users with pagination
  getUsers(page: number = 1, limit: number = 10) {
    return this.userCrud.getAll({
      page,
      limit,
      sort: 'name',
      order: 'asc'
    });
  }

  // Get user by ID
  getUser(id: number) {
    return this.userCrud.getById(id);
  }

  // Create new user
  createUser(user: Partial<User>) {
    return this.userCrud.create(user);
  }

  // Update user
  updateUser(id: number, updates: Partial<User>) {
    return this.userCrud.update(id, updates);
  }

  // Delete user
  deleteUser(id: number) {
    return this.userCrud.delete(id);
  }
}
```

### Advanced Querying

```typescript
// Search users by name
searchUsers(query: string) {
  return this.userCrud.search(query, {
    limit: 20,
    sort: 'name'
  });
}

// Get users by role with pagination
getUsersByRole(role: string, page: number = 1) {
  return this.userCrud.getAll({
    role,
    page,
    limit: 20,
    sort: 'createdAt',
    order: 'desc'
  });
}

// Custom endpoint - get user orders
getUserOrders(userId: number) {
  return this.userCrud.getByEndpoint(`user/${userId}/orders`);
}
```

### File Operations

```typescript
// Upload user avatar
uploadAvatar(userId: number, file: File) {
  return this.userCrud.uploadFile(userId, file, 'avatar');
}

// Download user document
downloadDocument(userId: number) {
  return this.userCrud.downloadFile(userId, 'document.pdf');
}
```

### Bulk Operations

```typescript
// Bulk delete users
bulkDeleteUsers(userIds: number[]) {
  return this.userCrud.bulkDelete(userIds);
}
```

### Error Handling

```typescript
async loadUsers() {
  try {
    const response = await this.userService.getUsers().toPromise();
    
    if (response?.success) {
      console.log('Users loaded:', response.data);
    } else {
      console.error('Failed to load users:', response?.errors);
    }
  } catch (error) {
    console.error('Error loading users:', error);
  }
}
```

## Configuration

### Environment Setup

Update your environment files to include the API URL:

```typescript
// environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'
};

// environment.prod.ts
export const environment = {
  production: true,
  apiUrl: 'https://your-production-api.com/api'
};
```

### Service Configuration

```typescript
const crudService = this.apiService.createCrudService<YourType>({
  endpoint: 'your-endpoint',     // API endpoint
  headers: customHeaders,        // Custom HTTP headers
  retryAttempts: 3,             // Number of retry attempts
  timeout: 30000                // Request timeout in ms
});
```

## Best Practices

1. **Type Safety**: Always define interfaces for your entities
2. **Error Handling**: Always handle API responses and errors
3. **Loading States**: Use the loading$ observable for UI feedback
4. **Pagination**: Implement proper pagination for large datasets
5. **Search**: Use the search functionality for better UX
6. **File Uploads**: Handle file uploads with proper validation
7. **Custom Endpoints**: Use custom endpoints for complex operations

## Multiple Entity Services

You can create multiple CRUD services for different entities:

```typescript
@Injectable({
  providedIn: 'root'
})
export class DataService {
  private userService: CrudService<User>;
  private productService: CrudService<Product>;
  private orderService: CrudService<Order>;

  constructor(private apiService: ApiService) {
    this.userService = this.apiService.createCrudService<User>({
      endpoint: 'users'
    });

    this.productService = this.apiService.createCrudService<Product>({
      endpoint: 'products'
    });

    this.orderService = this.apiService.createCrudService<Order>({
      endpoint: 'orders'
    });
  }

  // User operations
  getUsers() { return this.userService.getAll(); }
  createUser(user: Partial<User>) { return this.userService.create(user); }

  // Product operations
  getProducts() { return this.productService.getAll(); }
  createProduct(product: Partial<Product>) { return this.productService.create(product); }

  // Order operations
  getOrders() { return this.orderService.getAll(); }
  createOrder(order: Partial<Order>) { return this.orderService.create(order); }
}
```

## Integration with Alert Service

Combine with the alert service for better user feedback:

```typescript
async createUser(user: Partial<User>) {
  try {
    const response = await this.userService.createUser(user).toPromise();
    
    if (response?.success) {
      await this.alertService.showSuccess('User created successfully!');
      return response.data;
    } else {
      await this.alertService.showError('Failed to create user');
    }
  } catch (error) {
    await this.alertService.showError('An error occurred while creating user');
    throw error;
  }
}
```

This generic CRUD service provides a robust, type-safe foundation for all your API operations while maintaining flexibility for custom requirements. 