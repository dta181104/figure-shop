import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { AdminService, AdminUser } from '@/app/core/services/admin.service';
import { ProductService } from '@/app/core/services/product.service';
import { ProductItems } from '@/app/core/models/product-item.model';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';

type TabKey = 'users' | 'products';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ConfirmDialogComponent],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
})
export class AdminComponent implements OnInit {
  activeTab: TabKey = 'users';

  isBrowser = false;
  isAdmin = false;
  forbiddenMessage = '';

  isUsersLoading = false;
  isProductsLoading = false;
  isSavingUser = false;
  isSavingProduct = false;

  users: AdminUser[] = [];
  userQuery = '';
  editingUserCode = '';
  userMessage = '';
  userError = '';

  products: ProductItems[] = [];
  productQuery = '';
  editingProductCode = '';
  productMessage = '';
  productError = '';
  confirmVisible = false;
  confirmTitle = '';
  confirmMessage = '';
  confirmText = 'Xác nhận';
  confirmVariant: 'primary' | 'warning' | 'danger' = 'warning';
  private confirmAction: (() => void) | null = null;

  userForm: {
    username: string;
    password: string;
    name: string;
    email: string;
    phone: string;
    status: string;
  } = {
    username: '',
    password: '',
    name: '',
    email: '',
    phone: '',
    status: 'ACTIVE',
  };

  productForm: {
    code: string;
    name: string;
    description: string;
    price: number | null;
    quantity: number | null;
    status: number;
  } = {
    code: '',
    name: '',
    description: '',
    price: null,
    quantity: null,
    status: 1,
  };

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private route: ActivatedRoute,
    private adminService: AdminService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    const routeTab = this.route.snapshot.data['tab'];
    if (routeTab === 'users' || routeTab === 'products') {
      this.activeTab = routeTab;
    }

    this.isBrowser = isPlatformBrowser(this.platformId);

    if (!this.isBrowser) {
      this.forbiddenMessage = 'Không thể truy cập khu vực quản trị ở môi trường hiện tại.';
      return;
    }

    const token = localStorage.getItem('access_token');
    if (!token) {
      this.forbiddenMessage = 'Bạn chưa đăng nhập. Vui lòng đăng nhập tài khoản quản trị.';
      return;
    }

    this.adminService.getMyInfo().subscribe({
      next: (res) => {
        const profile = res?.result ?? {};
        const roles = profile?.roles ?? [];
        this.isAdmin = this.hasAdminRole(roles);

        if (!this.isAdmin) {
          this.forbiddenMessage = 'Tài khoản hiện tại không có quyền quản trị.';
          return;
        }

        localStorage.setItem('user_profile', JSON.stringify(profile));
        this.loadUsers();
        this.loadProducts();
      },
      error: (err: any) => {
        const status = err?.status || 'unknown';
        this.forbiddenMessage = `[${status}] Không xác thực được quyền quản trị. Vui lòng đăng nhập lại.`;
      },
    });
  }

  setTab(tab: TabKey): void {
    this.activeTab = tab;
  }

  get filteredUsers(): AdminUser[] {
    const q = this.userQuery.trim().toLowerCase();
    if (!q) {
      return this.users;
    }

    return this.users.filter((u) => {
      const roleText = (u.roles || [])
        .map((role) => (typeof role === 'string' ? role : role?.code || role?.name || ''))
        .join(' ')
        .toLowerCase();

      return [u.username, u.name, u.fullName, u.email, u.phone, roleText]
        .join(' ')
        .toLowerCase()
        .includes(q);
    });
  }

  get filteredProducts(): ProductItems[] {
    const activeProducts = this.products.filter((product) => product.deleted === false);
    const q = this.productQuery.trim().toLowerCase();
    if (!q) {
      return activeProducts;
    }

    return activeProducts.filter((p) =>
      [p.code, p.name, p.description].join(' ').toLowerCase().includes(q)
    );
  }

  loadUsers(): void {
    this.isUsersLoading = true;
    this.userError = '';

    this.adminService
      .getAccounts()
      .pipe(finalize(() => (this.isUsersLoading = false)))
      .subscribe({
        next: (res) => {
          this.users = Array.isArray(res?.result) ? res.result : [];
        },
        error: (err: any) => {
          const status = err?.status || 'unknown';
          const message = err?.error?.message || 'Không tải được danh sách người dùng.';
          const suffix =
            status === 403 ? ' Token hiện tại chưa có quyền SHOW_USER hoặc ADMIN.' : '';
          this.userError = `[${status}] ${message}${suffix}`;
          this.users = [];
        },
      });
  }

  saveUser(): void {
    if (!this.userForm.username.trim()) {
      this.userError = 'Vui lòng nhập username.';
      return;
    }

    if (!this.editingUserCode && !this.userForm.password.trim()) {
      this.userError = 'Vui lòng nhập mật khẩu cho tài khoản mới.';
      return;
    }

    if (this.editingUserCode) {
      this.openConfirm({
        title: 'Xác nhận cập nhật người dùng',
        message: `Bạn có chắc chắn muốn cập nhật tài khoản ${this.userForm.username || this.editingUserCode}?`,
        confirmText: 'Cập nhật',
        variant: 'warning',
        action: () => this.proceedSaveUser(),
      });
      return;
    }

    this.proceedCreateUser();
  }

  private proceedSaveUser(): void {
    this.userError = '';
    this.userMessage = '';
    this.isSavingUser = true;

    const payload = {
      code: this.editingUserCode || undefined,
      name: this.userForm.name.trim() || undefined,
      sex: null,
      address: undefined,
      email: this.userForm.email.trim() || undefined,
      phone: this.userForm.phone.trim() || undefined,
      status: this.userForm.status,
      date: undefined,
      pass: this.userForm.password || undefined,
      avatar: undefined,
      roles: undefined,
    };

    this.adminService
      .updateAccount(this.editingUserCode, payload)
      .pipe(finalize(() => (this.isSavingUser = false)))
      .subscribe({
        next: () => {
          this.userMessage = 'Cập nhật người dùng thành công.';
          this.resetUserForm();
          this.loadUsers();
        },
        error: () => {
          this.userError = 'Không thể cập nhật người dùng.';
        },
      });
  }

  private proceedCreateUser(): void {
    this.userError = '';
    this.userMessage = '';
    this.isSavingUser = true;

    this.adminService
      .createAccount({
        username: this.userForm.username.trim(),
        pass: this.userForm.password,
        name: this.userForm.name.trim() || undefined,
        email: this.userForm.email.trim() || undefined,
        phone: this.userForm.phone.trim() || undefined,
      })
      .pipe(finalize(() => (this.isSavingUser = false)))
      .subscribe({
        next: () => {
          this.userMessage = 'Tạo tài khoản thành công.';
          this.resetUserForm();
          this.loadUsers();
        },
        error: () => {
          this.userError = 'Không thể tạo tài khoản.';
        },
      });
  }

  editUser(user: AdminUser): void {
    this.editingUserCode = user.code || '';
    this.userForm = {
      username: user.username || '',
      password: '',
      name: user.name || user.fullName || '',
      email: user.email || '',
      phone: user.phone || '',
      status: (user.status?.toString() || 'ACTIVE').toUpperCase(),
    };
  }

  deleteUser(user: AdminUser): void {
    const code = user.code;
    if (!code) {
      this.userError = 'Không tìm thấy mã người dùng để xoá.';
      return;
    }

    this.openConfirm({
      title: 'Xác nhận xóa người dùng',
      message: `Bạn có chắc chắn muốn xóa người dùng ${user.username || code}?`,
      confirmText: 'Xóa',
      variant: 'danger',
      action: () => this.proceedDeleteUser(code),
    });
  }

  private proceedDeleteUser(code: string): void {
    this.userError = '';
    this.userMessage = '';

    this.adminService.deleteAccount(code).subscribe({
      next: () => {
        this.userMessage = 'Đã xóa người dùng.';
        this.loadUsers();
      },
      error: () => {
        this.userError = 'Xóa người dùng thất bại.';
      },
    });
  }

  resetUserForm(): void {
    this.editingUserCode = '';
    this.userForm = {
      username: '',
      password: '',
      name: '',
      email: '',
      phone: '',
      status: 'ACTIVE',
    };
  }

  loadProducts(): void {
    this.isProductsLoading = true;
    this.productError = '';

    this.productService
      .getProducts({ page: 0, size: 100 })
      .pipe(finalize(() => (this.isProductsLoading = false)))
      .subscribe({
        next: (res) => {
          const content = res?.result?.content;
          this.products = Array.isArray(content)
            ? content.filter((product) => product.deleted === false)
            : [];
        },
        error: (err: any) => {
          const status = err?.status || 'unknown';
          const message = err?.error?.message || 'Không tải được danh sách sản phẩm.';
          this.productError = `[${status}] ${message}`;
          this.products = [];
        },
      });
  }

  saveProduct(): void {
    if (!this.productForm.name.trim() || this.productForm.price === null) {
      this.productError = 'Vui lòng nhập tên và giá sản phẩm.';
      return;
    }

    if (this.editingProductCode) {
      this.openConfirm({
        title: 'Xác nhận cập nhật sản phẩm',
        message: `Bạn có chắc chắn muốn cập nhật sản phẩm ${this.productForm.name || this.editingProductCode}?`,
        confirmText: 'Cập nhật',
        variant: 'warning',
        action: () => this.proceedSaveProduct(),
      });
      return;
    }

    this.proceedCreateProduct();
  }

  private proceedSaveProduct(): void {
    this.productError = '';
    this.productMessage = '';
    this.isSavingProduct = true;

    const payload: Partial<ProductItems> = {
      code: this.productForm.code.trim() || undefined,
      name: this.productForm.name.trim(),
      description: this.productForm.description.trim() || undefined,
      height: undefined,
      weight: undefined,
      price: Number(this.productForm.price),
      quantity: this.productForm.quantity !== null ? Number(this.productForm.quantity) : undefined,
      status: Number(this.productForm.status),
      images: undefined,
    };
    this.productService
      .updateProduct(this.editingProductCode, payload)
      .pipe(finalize(() => (this.isSavingProduct = false)))
      .subscribe({
        next: () => {
          this.productMessage = 'Cập nhật sản phẩm thành công.';
          this.resetProductForm();
          this.loadProducts();
        },
        error: () => {
          this.productError = 'Không thể cập nhật sản phẩm.';
        },
      });
  }

  private proceedCreateProduct(): void {
    this.productError = '';
    this.productMessage = '';
    this.isSavingProduct = true;

    const payload: Partial<ProductItems> = {
      code: this.productForm.code.trim() || undefined,
      name: this.productForm.name.trim(),
      description: this.productForm.description.trim() || undefined,
      height: undefined,
      weight: undefined,
      price: this.productForm.price === null ? undefined : Number(this.productForm.price),
      quantity: this.productForm.quantity === null ? undefined : Number(this.productForm.quantity),
      status: this.productForm.status,
      images: undefined,
    };

    this.productService
      .createProduct(payload)
      .pipe(finalize(() => (this.isSavingProduct = false)))
      .subscribe({
        next: () => {
          this.productMessage = 'Tạo sản phẩm thành công.';
          this.resetProductForm();
          this.loadProducts();
        },
        error: () => {
          this.productError = 'Không thể tạo sản phẩm.';
        },
      });
  }

  editProduct(product: ProductItems): void {
    this.editingProductCode = product.code || '';
    this.productForm = {
      code: product.code || '',
      name: product.name || '',
      description: product.description || '',
      price: typeof product.price === 'number' ? product.price : null,
      quantity: typeof product.quantity === 'number' ? product.quantity : null,
      status: typeof product.status === 'number' ? product.status : 1,
    };
  }

  deleteProduct(product: ProductItems): void {
    const code = product.code;
    if (!code) {
      this.productError = 'Không tìm thấy mã sản phẩm để xoá.';
      return;
    }

    this.openConfirm({
      title: 'Xác nhận xóa sản phẩm',
      message: `Bạn có chắc chắn muốn xóa sản phẩm ${product.name || code}?`,
      confirmText: 'Xóa',
      variant: 'danger',
      action: () => this.proceedDeleteProduct(code),
    });
  }

  private proceedDeleteProduct(code: string): void {
    this.productError = '';
    this.productMessage = '';

    this.productService.deleteProduct(code).subscribe({
      next: () => {
        this.productMessage = 'Đã xóa sản phẩm.';
        this.loadProducts();
      },
      error: () => {
        this.productError = 'Xóa sản phẩm thất bại.';
      },
    });
  }

  resetProductForm(): void {
    this.editingProductCode = '';
    this.productForm = {
      code: '',
      name: '',
      description: '',
      price: null,
      quantity: null,
      status: 1,
    };
  }

  formatRoles(roles?: Array<string | { code?: string; name?: string }>): string {
    if (!Array.isArray(roles) || roles.length === 0) {
      return 'USER';
    }

    return roles
      .map((role) => (typeof role === 'string' ? role : role.code || role.name || ''))
      .filter(Boolean)
      .join(', ');
  }

  private hasAdminRole(roles: any[]): boolean {
    return (
      Array.isArray(roles) &&
      roles.some((role) => {
        const code = (role?.code || role?.name || role || '').toString().toUpperCase();
        return code === 'ADMIN' || code.includes('ADMIN');
      })
    );
  }

  private openConfirm(options: {
    title: string;
    message: string;
    confirmText: string;
    variant: 'primary' | 'warning' | 'danger';
    action: () => void;
  }): void {
    this.confirmTitle = options.title;
    this.confirmMessage = options.message;
    this.confirmText = options.confirmText;
    this.confirmVariant = options.variant;
    this.confirmAction = options.action;
    this.confirmVisible = true;
  }

  confirmActionNow(): void {
    const action = this.confirmAction;
    this.closeConfirm();
    action?.();
  }

  closeConfirm(): void {
    this.confirmVisible = false;
    this.confirmAction = null;
  }
}
