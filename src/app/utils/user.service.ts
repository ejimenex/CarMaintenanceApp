import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService, CrudService, ApiResponse, QueryParams } from './api.service';

// Example interfaces for different entities

export interface ChangePassword {
  oldPassword: string;
  newPassword: string;
}
export interface DeleteUser {
  reason: string;
}
@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userDeletesService: CrudService<DeleteUser>;
  private changePasswordService: CrudService<ChangePassword>;
  constructor(private apiService: ApiService) {
    // Initialize CRUD services for different entities
        this.userDeletesService = this.apiService.createCrudService<DeleteUser>({
          endpoint: 'User',
          retryAttempts: 3
        });
        this.changePasswordService = this.apiService.createCrudService<ChangePassword>({
          endpoint: 'User/ChangePassword',
          retryAttempts: 3
        });
 
  }
deleteUser(DeleteUser:DeleteUser): Observable<ApiResponse<DeleteUser>> {
  return this.userDeletesService.patchWithBodyOnly(DeleteUser);
}
changePassword(ChangePassword:ChangePassword): Observable<ApiResponse<ChangePassword>> {
  return this.changePasswordService.patchWithBodyOnly(ChangePassword);
}

}

