import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

export type AdminUser = {
  id?: number;
  code?: string;
  username?: string;
  name?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  status?: string | number;
  roles?: Array<string | { code?: string; name?: string }>;
};

type ApiResponse<T> = {
  result?: T;
  code?: number;
  message?: string;
};

@Injectable({ providedIn: 'root' })
export class AdminService {
  private http = inject(HttpClient);

  getMyInfo(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>('users/myInfo');
  }

  getAccounts(): Observable<ApiResponse<AdminUser[]>> {
    return this.http.get<ApiResponse<AdminUser[]>>('admin/accounts');
  }

  createAccount(payload: {
    username: string;
    password?: string;
    pass?: string;
    name?: string;
    email?: string;
    phone?: string;
  }): Observable<ApiResponse<AdminUser>> {
    return this.http.post<ApiResponse<AdminUser>>('admin/create', payload);
  }

  updateAccount(
    code: string,
    payload: {
      name?: string;
      email?: string;
      phone?: string;
      status?: string;
      pass?: string;
    }
  ): Observable<ApiResponse<AdminUser>> {
    return this.http.put<ApiResponse<AdminUser>>(`admin/update/${code}`, payload);
  }

  deleteAccount(code: string): Observable<ApiResponse<AdminUser>> {
    return this.http.delete<ApiResponse<AdminUser>>(`admin/delete/${code}`);
  }
}
