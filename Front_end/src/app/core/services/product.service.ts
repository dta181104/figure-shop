import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse, Page } from '../models/product.model';
import { ProductItems } from '../models/product-item.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private http = inject(HttpClient);

  getProducts(params?: any): Observable<ApiResponse<Page<ProductItems>>> {
    return this.http.get<ApiResponse<Page<ProductItems>>>(`product`, { params });
  }

  getProductById(id: string): Observable<ApiResponse<ProductItems>> {
    return this.http.get<ApiResponse<ProductItems>>(`product/${id}`);
  }

  createProduct(payload: Partial<ProductItems>): Observable<ApiResponse<ProductItems>> {
    return this.http.post<ApiResponse<ProductItems>>('product', payload);
  }

  updateProduct(
    code: string,
    payload: Partial<ProductItems>
  ): Observable<ApiResponse<ProductItems>> {
    return this.http.put<ApiResponse<ProductItems>>(`product/${code}`, payload);
  }

  deleteProduct(code: string): Observable<ApiResponse<ProductItems>> {
    return this.http.delete<ApiResponse<ProductItems>>(`product/${code}`);
  }
}
