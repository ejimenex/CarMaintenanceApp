import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, retry, tap, map, timeout } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
  errors?: string[];
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
}

export interface QueryParams {
  globalSearch?: string;
  pageSize?: number;
  pageNumber?: number;
  search?: string;
  sortBy?: string;
  order?: 'asc' | 'desc';
  [key: string]: any;
}

export interface CrudOptions {
  endpoint: string;
  headers?: HttpHeaders;
  retryAttempts?: number;
  timeout?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = environment.apiUrl;
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * Generic CRUD Service for any entity type
   */
  createCrudService<T>(options: CrudOptions) {
    return new CrudService<T>(this.http, this.baseUrl, {...options, headers: options.headers});
  }

  /**
   * Set loading state
   */
  private setLoading(loading: boolean): void {
    this.loadingSubject.next(loading);
  }

  /**
   * Handle HTTP errors
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    
    console.error('API Error:', error);
    return throwError(() => new Error(errorMessage));
  }

  /**
   * Create HTTP headers
   */
  private createHeaders(customHeaders?: HttpHeaders): HttpHeaders {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${JSON.parse(localStorage.getItem('currentUser') || '{}').token}`
    });

    if (customHeaders) {
      customHeaders.keys().forEach(key => {
        headers = headers.set(key, customHeaders.get(key)!);
      });
    }

    return headers;
  }

  /**
   * Build query parameters
   */
  private buildQueryParams(params: QueryParams): HttpParams {
    let httpParams = new HttpParams();
    
    Object.keys(params).forEach(key => {
      const value = params[key];
      if (value !== undefined && value !== null && value !== '') {
        httpParams = httpParams.set(key, value.toString());
      }
    });
    
    return httpParams;
  }
}

/**
 * Generic CRUD Service Class
 */
export class CrudService<T> {
  private endpoint: string;
  private defaultHeaders: HttpHeaders;
  private retryAttempts: number;
  private timeout: number;

  constructor(
    private http: HttpClient,
    private baseUrl: string,
    options: CrudOptions
  ) {
    this.endpoint = options.endpoint;
    this.defaultHeaders = options.headers || new HttpHeaders();
    this.retryAttempts = options.retryAttempts || 3;
    this.timeout = options.timeout || 30000;
   
  }
  getAllWithoutParams(): Observable<ApiResponse<T[]>> {
    const token = JSON.parse(localStorage.getItem('currentUser') || '{}').token;
    if(token){
    this.defaultHeaders = this.defaultHeaders.set('Authorization', `Bearer ${token}`);}
    const url = `${this.baseUrl}/${this.endpoint}`;
    
    return this.http.get<ApiResponse<T[]>>(url, {
      headers: this.defaultHeaders
    }).pipe(
      timeout(this.timeout),
      retry(this.retryAttempts),
      catchError(this.handleError)
    );
  }
  /**
   * Get all items with pagination and filtering
   */
  getAll(params?: QueryParams): Observable<ApiResponse<T[]>> {
    const token = JSON.parse(localStorage.getItem('currentUser') || '{}').token;
    if(token){
    this.defaultHeaders = this.defaultHeaders.set('Authorization', `Bearer ${token}`);}
    const url = `${this.baseUrl}/${this.endpoint}`;
    const httpParams = params ? this.buildQueryParams(params) : new HttpParams();
    
    return this.http.get<ApiResponse<T[]>>(url, {
      params: httpParams,
      headers: this.defaultHeaders
    }).pipe(
      timeout(this.timeout),
      retry(this.retryAttempts),
      catchError(this.handleError)
    );
  }

  /**
   * Get item by ID
   */
  getById(id: string | number): Observable<ApiResponse<T>> {
    const url = `${this.baseUrl}/${this.endpoint}/${id}`;
    const token = JSON.parse(localStorage.getItem('currentUser') || '{}').token;
    if(token){
    this.defaultHeaders = this.defaultHeaders.set('Authorization', `Bearer ${token}`);}
    return this.http.get<ApiResponse<T>>(url, {
      headers: this.defaultHeaders
    }).pipe(
      timeout(this.timeout),
      retry(this.retryAttempts),
      catchError(this.handleError)
    );
  }
  getOneWithOutParams(): Observable<ApiResponse<T>> {
    const token = JSON.parse(localStorage.getItem('currentUser') || '{}').token;
    if(token){
    this.defaultHeaders = this.defaultHeaders.set('Authorization', `Bearer ${token}`);}
    const url = `${this.baseUrl}/${this.endpoint}`;
    
    return this.http.get<ApiResponse<T>>(url, {
      headers: this.defaultHeaders
    }).pipe(
      timeout(this.timeout),
      retry(this.retryAttempts),
      catchError(this.handleError)
    );
  }

  /**
   * Create new item
   */
  create(item: Partial<T>): Observable<ApiResponse<T>> {
    const url = `${this.baseUrl}/${this.endpoint}`;
    
    const token = JSON.parse(localStorage.getItem('currentUser') || '{}').token;
    if(token){
    this.defaultHeaders = this.defaultHeaders.set('Authorization', `Bearer ${token}`);}
   return this.http.post<ApiResponse<T>>(url, item, {
      headers: this.defaultHeaders
    }).pipe(
      timeout(this.timeout),
      retry(this.retryAttempts),
      catchError(this.handleError)
    );
  }

  /**
   * Create new item without authorization header (for login, register, etc.)
   */
  createWithoutAuth(item: Partial<T>): Observable<ApiResponse<T>> {
    const url = `${this.baseUrl}/${this.endpoint}`;
    
    // Headers básicos sin Authorization
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
    
    return this.http.post<ApiResponse<T>>(url, item, {
      headers: headers
    }).pipe(
      timeout(this.timeout),
      retry(this.retryAttempts),
      catchError(this.handleError)
    );
  }

  /**
   * Update item by ID
   */
  update(id: string | number, item: Partial<T>): Observable<ApiResponse<T>> {
    const url = `${this.baseUrl}/${this.endpoint}/${id}`;
    const token = JSON.parse(localStorage.getItem('currentUser') || '{}').token;
    if(token){
    this.defaultHeaders = this.defaultHeaders.set('Authorization', `Bearer ${token}`);}
    return this.http.put<ApiResponse<T>>(url, item, {
      headers: this.defaultHeaders
    }).pipe(
      timeout(this.timeout),
      retry(this.retryAttempts),
      catchError(this.handleError)
    );
  }
  updateWithoutBody(id: string | number): Observable<ApiResponse<T>> {
    const url = `${this.baseUrl}/${this.endpoint}/${id}`;
    const token = JSON.parse(localStorage.getItem('currentUser') || '{}').token;
    if(token){
    this.defaultHeaders = this.defaultHeaders.set('Authorization', `Bearer ${token}`);}
    return this.http.put<ApiResponse<T>>(url, {}, {
      headers: this.defaultHeaders
    }).pipe(
      timeout(this.timeout),
      retry(this.retryAttempts),
      catchError(this.handleError)
    );
  }
  /**
   * Patch item by ID (partial update)
   */
  patch(id: string | number, item: Partial<T>): Observable<ApiResponse<T>> {
    const url = `${this.baseUrl}/${this.endpoint}/${id}`;
    const token = JSON.parse(localStorage.getItem('currentUser') || '{}').token;
    if(token){
    this.defaultHeaders = this.defaultHeaders.set('Authorization', `Bearer ${token}`);}
    return this.http.patch<ApiResponse<T>>(url, item, {
      headers: this.defaultHeaders
    }).pipe(
      timeout(this.timeout),
      retry(this.retryAttempts),
      catchError(this.handleError)
    );
  }
  /**
   * Patch item by ID (partial update)
   */
  patchWithBodyOnly(item: Partial<T>): Observable<ApiResponse<T>> {
    const url = `${this.baseUrl}/${this.endpoint}`;
    const token = JSON.parse(localStorage.getItem('currentUser') || '{}').token;
    if(token){
    this.defaultHeaders = this.defaultHeaders.set('Authorization', `Bearer ${token}`);}
    return this.http.patch<ApiResponse<T>>(url, item, {
      headers: this.defaultHeaders
    }).pipe(
      timeout(this.timeout),
      retry(this.retryAttempts),
      catchError(this.handleError)
    );
  }
  /**
   * Delete item by ID
   */
  delete(id: string | number): Observable<ApiResponse<void>> {
    const url = `${this.baseUrl}/${this.endpoint}/${id}`;
    
    return this.http.delete<ApiResponse<void>>(url, {
      headers: this.defaultHeaders
    }).pipe(
      timeout(this.timeout),
      retry(this.retryAttempts),
      catchError(this.handleError)
    );
  }

  /**
   * Bulk delete items
   */
  bulkDelete(ids: (string | number)[]): Observable<ApiResponse<void>> {
    const url = `${this.baseUrl}/${this.endpoint}/bulk-delete`;
    
    return this.http.post<ApiResponse<void>>(url, { ids }, {
      headers: this.defaultHeaders
    }).pipe(
      timeout(this.timeout),
      retry(this.retryAttempts),
      catchError(this.handleError)
    );
  }

  /**
   * Search items
   */
  search(query: string, params?: QueryParams): Observable<ApiResponse<T[]>> {
    const searchParams = { ...params, search: query };
    return this.getAll(searchParams);
  }

  /**
   * Get items by custom endpoint
   */
  getByEndpoint(endpoint: string, params?: QueryParams): Observable<ApiResponse<T[]>> {
    const url = `${this.baseUrl}/${this.endpoint}/${endpoint}`;
    const token = JSON.parse(localStorage.getItem('currentUser') || '{}').token;
    if(token){
    this.defaultHeaders = this.defaultHeaders.set('Authorization', `Bearer ${token}`);}
    const httpParams = params ? this.buildQueryParams(params) : new HttpParams();
    
    return this.http.get<ApiResponse<T[]>>(url, {
      params: httpParams,
      headers: this.defaultHeaders
    }).pipe(
      timeout(this.timeout),
      retry(this.retryAttempts),
      catchError(this.handleError)
    );
  }

  /**
   * Post to custom endpoint
   */
  postToEndpoint(endpoint: string, data: any): Observable<ApiResponse<T>> {
    const url = `${this.baseUrl}/${this.endpoint}/${endpoint}`;
    
    return this.http.post<ApiResponse<T>>(url, data, {
      headers: this.defaultHeaders
    }).pipe(
      timeout(this.timeout),
      retry(this.retryAttempts),
      catchError(this.handleError)
    );
  }

  /**
   * Upload file
   */
  uploadFile(id: string | number, file: File, fieldName: string = 'file'): Observable<ApiResponse<T>> {
    const url = `${this.baseUrl}/${this.endpoint}/${id}/upload`;
    const formData = new FormData();
    formData.append(fieldName, file);
    
    return this.http.post<ApiResponse<T>>(url, formData, {
      headers: new HttpHeaders() // Let browser set Content-Type for FormData
    }).pipe(
      timeout(this.timeout),
      retry(this.retryAttempts),
      catchError(this.handleError)
    );
  }

  /**
   * Download file
   */
  downloadFile(id: string | number, filename?: string): Observable<Blob> {
    const url = `${this.baseUrl}/${this.endpoint}/${id}/download`;
    
    return this.http.get(url, {
      responseType: 'blob',
      headers: this.defaultHeaders
    }).pipe(
      timeout(this.timeout),
      retry(this.retryAttempts),
      catchError(this.handleError)
    );
  }

  /**
   * Build query parameters
   */
  private buildQueryParams(params: QueryParams): HttpParams {
    let httpParams = new HttpParams();
    
    Object.keys(params).forEach(key => {
      const value = params[key];
      if (value !== undefined && value !== null && value !== '') {
        httpParams = httpParams.set(key, value.toString());
      }
    });
    
    return httpParams;
  }

  /**
   * Handle HTTP errors
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    
    console.error('CRUD Service Error:', error);
    return throwError(() => new Error(errorMessage));
  }
}
