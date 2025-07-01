import { Component, OnInit } from "@angular/core";
import { CommonModule, NgIf, NgFor } from "@angular/common";
import { RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { AuthService } from "../../services/auth.service";
import { ProductService } from "../../services/producto.service";
import { CategoryService } from "../../services/category.service";

import { Product } from "@models/product.model";
import { Category } from "@models/category.model";

@Component({
  selector: "app-dashboard",
  standalone: true,
  imports: [CommonModule, NgIf, NgFor, RouterModule, FormsModule],
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent implements OnInit {
  productos: Product[] = [];
  categorias: Category[] = [];
  isSuperAdmin: boolean = false;

  nuevaCategoria: Category = { id: 0, name: "", description: "" };
  categoriaSeleccionada: Category | null = null;

  nuevoProducto: Product = {
    id: 0,
    name: "",
    price: 0,
    description: "",
    stock: 0,
    categoryId: 0,
  };

  constructor(
    private authService: AuthService,
    private productService: ProductService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.isSuperAdmin = this.authService.hasRole("SUPER_ADMIN");
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.productService.getAll().subscribe({
      next: (res: Product[]) => {
        console.log("Productos cargados:", res); // debug productos
        this.productos = res;
      },
      error: (err: any) => console.error("Error cargando productos:", err),
    });

    this.categoryService.getAll().subscribe({
      next: (res: Category[]) => {
        console.log("Categorías cargadas:", res); // debug categorías
        this.categorias = res;
      },
      error: (err: any) => console.error("Error cargando categorías:", err),
    });
  }

  crearProducto(): void {
    if (!this.nuevoProducto.name || this.nuevoProducto.price <= 0) {
      alert("Por favor, ingresa un nombre y precio válidos.");
      return;
    }

    this.productService.create(this.nuevoProducto).subscribe({
      next: () => {
        this.cargarDatos();
        this.nuevoProducto = {
          id: 0,
          name: "",
          price: 0,
          description: "",
          stock: 0,
          categoryId: 0,
        };
      },
      error: (err: any) => console.error("Error al crear producto:", err),
    });
  }

  editarProducto(producto: Product): void {
    console.log("Editar producto:", producto);
  }

  eliminarProducto(id: number): void {
    if (confirm("¿Estás seguro de eliminar este producto?")) {
      this.productService.delete(id).subscribe({
        next: () => this.cargarDatos(),
        error: (err: any) => console.error("Error eliminando producto:", err),
      });
    }
  }

  abrirModalEditarCategoria(categoria: Category): void {
    this.categoriaSeleccionada = { ...categoria };

    const modalElement = document.getElementById("editarCategoriaModal");
    if (modalElement) {
      const modal = new (window as any).bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  actualizarCategoria(): void {
    if (!this.categoriaSeleccionada) return;

    this.categoryService
      .update(this.categoriaSeleccionada.id, this.categoriaSeleccionada)
      .subscribe({
        next: () => {
          this.cargarDatos();
          this.categoriaSeleccionada = null;
        },
        error: (err: any) =>
          console.error("Error actualizando categoría:", err),
      });
  }

  crearCategoria(): void {
    if (!this.nuevaCategoria.name || !this.nuevaCategoria.description) {
      alert("Nombre y descripción son obligatorios.");
      return;
    }

    this.categoryService.create(this.nuevaCategoria).subscribe({
      next: () => {
        this.cargarDatos();
        this.nuevaCategoria = { id: 0, name: "", description: "" };
      },
      error: (err: any) => console.error("Error creando categoría:", err),
    });
  }

  eliminarCategoria(id: number): void {
    if (confirm("¿Estás seguro de eliminar esta categoría?")) {
      this.categoryService.delete(id).subscribe({
        next: () => this.cargarDatos(),
        error: (err: any) => console.error("Error eliminando categoría:", err),
      });
    }
  }
}
