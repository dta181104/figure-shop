import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';

type UserProfile = {
  code?: string;
  name?: string;
  username?: string;
  email?: string;
  phone?: string;
  avatarUrl?: string;
  roles?: Array<{ code?: string; name?: string }>;
  createdDate?: string;
  createdAt?: string;
};

type ApiResponse<T> = {
  code?: number;
  message?: string;
  result?: T;
};

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css'],
})
export class AccountComponent implements OnInit {
  isBrowser = false;
  profile: UserProfile | null = null;
  isAdmin = false;
  isLoading = false;
  apiError = '';

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.isBrowser = isPlatformBrowser(this.platformId);

    if (!this.isBrowser) {
      return;
    }

    this.loadProfile();
    this.loadMyInfo();
  }

  get displayName(): string {
    return this.profile?.name || this.profile?.username || 'Người dùng';
  }

  get email(): string {
    return this.profile?.email || 'Chưa cập nhật email';
  }

  get phone(): string {
    return this.profile?.phone || 'Chưa cập nhật số điện thoại';
  }

  get createdAt(): string {
    return this.profile?.createdDate || this.profile?.createdAt || 'Không xác định';
  }

  get avatarLabel(): string {
    const source = this.displayName.trim() || 'User';
    return source
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join('');
  }

  private loadProfile(): void {
    try {
      const raw = localStorage.getItem('user_profile');
      if (!raw) {
        this.profile = null;
        this.isAdmin = false;
        return;
      }

      const parsed = JSON.parse(raw);
      this.profile = parsed?.result ?? parsed?.user ?? parsed;

      const roles = this.profile?.roles ?? [];
      this.isAdmin =
        Array.isArray(roles) &&
        roles.some((role) => {
          const code = (role?.code || role?.name || '').toString().toUpperCase();
          return code === 'ADMIN' || code.includes('ADMIN');
        });
    } catch {
      this.profile = null;
      this.isAdmin = false;
    }
  }

  private loadMyInfo(): void {
    this.isLoading = true;
    this.apiError = '';

    this.http.get<ApiResponse<UserProfile>>('users/myInfo').subscribe({
      next: (res) => {
        const payload = res?.result;
        if (!payload) {
          this.isLoading = false;
          return;
        }

        this.profile = {
          ...this.profile,
          ...payload,
        };

        this.isAdmin = this.hasAdminRole(this.profile?.roles || []);
        this.isLoading = false;
      },
      error: () => {
        this.apiError = 'Không tải được thông tin tài khoản từ server. Đang dùng dữ liệu cục bộ.';
        this.isLoading = false;
      },
    });
  }

  private hasAdminRole(roles: Array<{ code?: string; name?: string }>): boolean {
    return (
      Array.isArray(roles) &&
      roles.some((role) => {
        const code = (role?.code || role?.name || '').toString().toUpperCase();
        return code === 'ADMIN' || code.includes('ADMIN');
      })
    );
  }
}
