import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  login(username: string, password: string) {
    return this.http.post<{ token: string }>(`auth/login`, { username, password }).pipe(
      tap((response) => {
        if (response?.token) {
          localStorage.setItem('access_token', response.token);
        }
      })
    );
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_profile');
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }
}
