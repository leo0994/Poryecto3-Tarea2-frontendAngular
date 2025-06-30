import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../../shared/services/product.service';
import { Product } from '../../../shared/models/product.model';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-product-list',
  imports: [CommonModule, RouterModule],
  templateUrl: './product-list.component.html',
})
export class ProductListComponent {
  private productService = inject(ProductService);
  products: Product[] = [];

  ngOnInit() {
    this.productService.getAll().subscribe({
      next: (res) => this.products = res.content,
      error: (err) => console.error(err),
    });
  }
}
