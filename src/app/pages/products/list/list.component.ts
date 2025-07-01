import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ProductService } from "../../../services/producto.service";
import { Product } from "../../../shared/models/product.model";
import { AuthService } from "../../../services/auth.service";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-product-list",
  standalone: true,
  templateUrl: "./list.component.html",
  styleUrls: ["./list.component.scss"],
  imports: [CommonModule],
})
export class ListComponent implements OnInit {
  products: Product[] = [];

  constructor(
    private productService: ProductService,
    private router: Router,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getAll().subscribe((data) => {
      this.products = data;
    });
  }

  edit(id: number): void {
    this.router.navigate(["/products/edit", id]);
  }

  delete(id: number): void {
    if (confirm("¿Seguro que deseas eliminar este producto?")) {
      this.productService.delete(id).subscribe(() => {
        this.loadProducts();
      });
    }
  }

  isAdmin(): boolean {
    return this.authService.hasRole("SUPER-ADMIN-ROLE");
  }
}
