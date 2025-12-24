import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject, from, switchMap } from 'rxjs';
import { catchError, retry, tap, map, timeout } from 'rxjs/operators';
import { Storage } from '@ionic/storage-angular';
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
  private _storage: Storage | null = null;
  private readonly USER_STORAGE_KEY = 'currentUser';

  constructor(
    private http: HttpClient,
    private storage: Storage
  ) {
    this.initStorage();
  }

  private async initStorage(): Promise<void> {
    this._storage = await this.storage.create();
  }

  /**
   * Obtiene el token del usuario desde Ionic Storage
   */
  async getToken(): Promise<string | null> {
    if (!this._storage) {
      await this.initStorage();
    }
    
    try {
      const userData = await this._storage!.get(this.USER_STORAGE_KEY);
      return userData?.token || null;
    } catch (error) {
      console.error('Error getting token from storage:', error);
      return null;
    }
  }

  /**
   * Generic CRUD Service for any entity type
   */
  createCrudService<T>(options: CrudOptions) {
    return new CrudService<T>(this.http, this.baseUrl, this, {...options, headers: options.headers});
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
   * Create HTTP headers (deprecated - use async version)
   */
  private createHeaders(customHeaders?: HttpHeaders): HttpHeaders {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
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
    private apiService: ApiService,
    options: CrudOptions
  ) {
    this.endpoint = options.endpoint;
    this.defaultHeaders = options.headers || new HttpHeaders();
    this.retryAttempts = options.retryAttempts || 3;
    this.timeout = options.timeout || 30000;
  }

  /**
   * Crea headers con el token del usuario
   */
  private async createAuthHeaders(): Promise<HttpHeaders> {
    const token = await this.apiService.getToken();
    let headers = this.defaultHeaders;
    
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    
    return headers;
  }

  getAllWithoutParams(): Observable<ApiResponse<T[]>> {
    return from(this.createAuthHeaders()).pipe(
      switchMap(headers => {
        const url = `${this.baseUrl}/${this.endpoint}`;
        return this.http.get<ApiResponse<T[]>>(url, { headers }).pipe(
          timeout(this.timeout),
          retry(this.retryAttempts),
          catchError(this.handleError)
        );
      })
    );
  }
  getOneWithoutParams(): Observable<ApiResponse<T>> {
    return from(this.createAuthHeaders()).pipe(
      switchMap(headers => {
        const url = `${this.baseUrl}/${this.endpoint}`;
        return this.http.get<ApiResponse<T>>(url, { headers }).pipe(
          timeout(this.timeout),
          retry(this.retryAttempts),
          catchError(this.handleError)
        );
      })
    );
  }

  /**
   * Get all items with pagination and filtering
   */
  getAll(params?: QueryParams): Observable<ApiResponse<T[]>> {
    return from(this.createAuthHeaders()).pipe(
      switchMap(headers => {
        const url = `${this.baseUrl}/${this.endpoint}`;
        const httpParams = params ? this.buildQueryParams(params) : new HttpParams();
        
        return this.http.get<ApiResponse<T[]>>(url, {
          headers: headers,
          params: httpParams
        }).pipe(
          timeout(this.timeout),
          retry(this.retryAttempts),
          catchError(this.handleError)
        );
      })
    );
  }
  getOneWithParams(params?: QueryParams): Observable<ApiResponse<T>> {
    return from(this.createAuthHeaders()).pipe(
      switchMap(headers => {
        const url = `${this.baseUrl}/${this.endpoint}`;
        const httpParams = params ? this.buildQueryParams(params) : new HttpParams();
        
        return this.http.get<ApiResponse<T>>(url, {
          headers: headers,
          params: httpParams
        }).pipe(
          timeout(this.timeout),
          retry(this.retryAttempts),
          catchError(this.handleError)
        );
      })
    );
  }
  /**
   * Get item by ID
   */
  getById(id: string | number): Observable<ApiResponse<T>> {
    return from(this.createAuthHeaders()).pipe(
      switchMap(headers => {
        const url = `${this.baseUrl}/${this.endpoint}/${id}`;
        return this.http.get<ApiResponse<T>>(url, { headers }).pipe(
          timeout(this.timeout),
          retry(this.retryAttempts),
          catchError(this.handleError)
        );
      })
    );
  }

  getOneWithOutParams(): Observable<ApiResponse<T>> {
    return from(this.createAuthHeaders()).pipe(
      switchMap(headers => {
        const url = `${this.baseUrl}/${this.endpoint}`;
        return this.http.get<ApiResponse<T>>(url, { headers }).pipe(
          timeout(this.timeout),
          retry(this.retryAttempts),
          catchError(this.handleError)
        );
      })
    );
  }

  /**
   * Create new item
   */
  create(item: Partial<T>): Observable<ApiResponse<T>> {
    return from(this.createAuthHeaders()).pipe(
      switchMap(headers => {
        const url = `${this.baseUrl}/${this.endpoint}`;
        return this.http.post<ApiResponse<T>>(url, item, { headers }).pipe(
          timeout(this.timeout),
          catchError(this.handleError)
        );
      })
    );
  }
  createFormData(item: Partial<FormData>): Observable<ApiResponse<T>> {
    return from(this.createAuthHeaders()).pipe(
      switchMap(headers => {
        const url = `${this.baseUrl}/${this.endpoint}`;
        return this.http.post<ApiResponse<T>>(url, item, { headers }).pipe(
          timeout(this.timeout),
          catchError(this.handleError)
        );
      })
    );
  }
  updateWithFormData(id: string | number, item: Partial<FormData>): Observable<ApiResponse<T>> {
    return from(this.createAuthHeaders()).pipe(
      switchMap(headers => {
        const url = `${this.baseUrl}/${this.endpoint}/${id}`;
        return this.http.put<ApiResponse<T>>(url, item, { headers }).pipe(
          timeout(this.timeout),
          catchError(this.handleError)
        );
      })
    );
  }
  /**
   * Create without authentication
   */
  createWithoutAuth(item: Partial<T>): Observable<ApiResponse<T>> {
    const url = `${this.baseUrl}/${this.endpoint}`;
    return this.http.post<ApiResponse<T>>(url, item, {
      headers: this.defaultHeaders
    }).pipe(
      timeout(this.timeout),
      catchError(this.handleError)
    );
  }

  /**
   * Create with custom body structure
   */
  createWithBody(body: any): Observable<ApiResponse<T>> {
    return from(this.createAuthHeaders()).pipe(
      switchMap(headers => {
        const url = `${this.baseUrl}/${this.endpoint}`;
        return this.http.post<ApiResponse<T>>(url, body, { headers }).pipe(
          timeout(this.timeout),
          catchError(this.handleError)
        );
      })
    );
  }

  /**
   * Update item by ID
   */
  update(id: string | number, item: Partial<T>): Observable<ApiResponse<T>> {
    return from(this.createAuthHeaders()).pipe(
      switchMap(headers => {
        const url = `${this.baseUrl}/${this.endpoint}/${id}`;
        return this.http.put<ApiResponse<T>>(url, item, { headers }).pipe(
          timeout(this.timeout),
          catchError(this.handleError)
        );
      })
    );
  }

  updateWithoutBody(id: string | number): Observable<ApiResponse<T>> {
    return from(this.createAuthHeaders()).pipe(
      switchMap(headers => {
        const url = `${this.baseUrl}/${this.endpoint}/${id}`;
        return this.http.put<ApiResponse<T>>(url, {}, { headers }).pipe(
          timeout(this.timeout),
          catchError(this.handleError)
        );
      })
    );
  }

  /**
   * Patch item by ID (partial update)
   */
  patch(id: string | number, item: Partial<T>): Observable<ApiResponse<T>> {
    return from(this.createAuthHeaders()).pipe(
      switchMap(headers => {
        const url = `${this.baseUrl}/${this.endpoint}/${id}`;
        return this.http.patch<ApiResponse<T>>(url, item, { headers }).pipe(
          timeout(this.timeout),
          catchError(this.handleError)
        );
      })
    );
  }

  /**
   * Patch item by ID (partial update)
   */
  patchWithBodyOnly(item: Partial<T>): Observable<ApiResponse<T>> {
    return from(this.createAuthHeaders()).pipe(
      switchMap(headers => {
        const url = `${this.baseUrl}/${this.endpoint}`;
        return this.http.patch<ApiResponse<T>>(url, item, { headers }).pipe(
          timeout(this.timeout),
          catchError(this.handleError)
        );
      })
    );
  }

  /**
   * Delete item by ID
   */
  delete(id: string | number): Observable<ApiResponse<void>> {
    return from(this.createAuthHeaders()).pipe(
      switchMap(headers => {
        const url = `${this.baseUrl}/${this.endpoint}/${id}`;
        return this.http.delete<ApiResponse<void>>(url, { headers }).pipe(
          timeout(this.timeout),
          catchError(this.handleError)
        );
      })
    );
  }

  /**
   * Delete without ID in URL
   */
  deleteWithoutId(body: any): Observable<ApiResponse<void>> {
    return from(this.createAuthHeaders()).pipe(
      switchMap(headers => {
        const url = `${this.baseUrl}/${this.endpoint}`;
        return this.http.request<ApiResponse<void>>('delete', url, {
          body: body,
          headers: headers
        }).pipe(
          timeout(this.timeout),
          catchError(this.handleError)
        );
      })
    );
  }

  /**
   * Search items
   */
  search(searchTerm: string, params?: QueryParams): Observable<ApiResponse<T[]>> {
    return from(this.createAuthHeaders()).pipe(
      switchMap(headers => {
        const url = `${this.baseUrl}/${this.endpoint}/search`;
        let httpParams = new HttpParams().set('q', searchTerm);
        
        if (params) {
          const queryParams = this.buildQueryParams(params);
          queryParams.keys().forEach(key => {
            httpParams = httpParams.set(key, queryParams.get(key)!);
          });
        }
        
        return this.http.get<ApiResponse<T[]>>(url, {
          headers: headers,
          params: httpParams
        }).pipe(
          timeout(this.timeout),
          retry(this.retryAttempts),
          catchError(this.handleError)
        );
      })
    );
  }

  /**
   * Get items by custom endpoint
   */
  getByEndpoint(endpoint: string, params?: QueryParams): Observable<ApiResponse<T[]>> {
    return from(this.createAuthHeaders()).pipe(
      switchMap(headers => {
        const url = `${this.baseUrl}/${this.endpoint}/${endpoint}`;
        const httpParams = params ? this.buildQueryParams(params) : new HttpParams();
        
        return this.http.get<ApiResponse<T[]>>(url, {
          headers: headers,
          params: httpParams
        }).pipe(
          timeout(this.timeout),
          retry(this.retryAttempts),
          catchError(this.handleError)
        );
      })
    );
  }

  /**
   * Custom POST to a specific endpoint
   */
  postToEndpoint(endpoint: string, body: any): Observable<ApiResponse<T>> {
    return from(this.createAuthHeaders()).pipe(
      switchMap(headers => {
        const url = `${this.baseUrl}/${this.endpoint}/${endpoint}`;
        return this.http.post<ApiResponse<T>>(url, body, { headers }).pipe(
          timeout(this.timeout),
          catchError(this.handleError)
        );
      })
    );
  }

  /**
   * Custom PUT to a specific endpoint
   */
  putToEndpoint(endpoint: string, body: any): Observable<ApiResponse<T>> {
    return from(this.createAuthHeaders()).pipe(
      switchMap(headers => {
        const url = `${this.baseUrl}/${this.endpoint}/${endpoint}`;
        return this.http.put<ApiResponse<T>>(url, body, { headers }).pipe(
          timeout(this.timeout),
          catchError(this.handleError)
        );
      })
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
    
    console.error('API Error:', error);
    return throwError(() => new Error(errorMessage));
  }
}
