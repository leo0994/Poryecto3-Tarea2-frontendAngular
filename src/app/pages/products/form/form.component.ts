import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from 'src/app/services/producto.service';
import { Product } from 'src/app/shared/models/product.model';

@Component({
  selector: 'app-form',
  standalone: true,
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss',
  imports: []
})
export class FormComponent implements OnInit {
  form!: FormGroup;
  editing: boolean = false;
  id?: number;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      price: [0, Validators.required]
    });

    this.id = Number(this.route.snapshot.paramMap.get('id'));
    if (this.id) {
      this.editing = true;
      this.productService.getById(this.id).subscribe(product => {
        this.form.patchValue(product);
      });
    }
  }

  save(): void {
    const product: Product = this.form.value;
    if (this.editing && this.id) {
      this.productService.update(this.id, product).subscribe(() => {
        this.router.navigate(['/products']);
      });
    } else {
      this.productService.create(product).subscribe(() => {
        this.router.navigate(['/products']);
      });
    }
  }
}
