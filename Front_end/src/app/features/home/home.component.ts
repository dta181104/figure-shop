import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Subscription, map } from 'rxjs';
import { ProductItems } from '@/app/core/models/product-item.model';
import { ProductService } from '@/app/core/services/product.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, OnDestroy {
  products: ProductItems[] = [];
  getProductApi!: Subscription;

  router = inject(Router);

  currentYear: number = new Date().getFullYear();

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.getProductApi = this.productService
      .getProducts({ page: 0, size: 10 })
      .pipe(map((res) => res.result.content.filter((item) => item.deleted === false)))
      .subscribe({
        next: (data) => {
          this.products = data.map((item) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            images: item.images,
          }));
        },
        error: (err) => {
          console.error('Load products failed', err);
        },
      });
  }

  getMainImage(product: ProductItems): string {
    const mainImg = product.images?.find((img) => img.imageMain);
    return mainImg ? mainImg.imageUrl! : 'assets/images/default.png';
  }

  ngOnDestroy(): void {
    if (this.getProductApi) {
      this.getProductApi.unsubscribe();
    }
  }

  viewDetail(productId: number) {
    this.router.navigate(['/product', productId]);
  }
}
