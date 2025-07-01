import { Category } from "./category.model";

export class Product {
  id: number = 0;
  name: string = "";
  description: string = "";
  price: number = 0;
  stock: number = 0;
  categoryId: number = 0;
  category?: Category;

  constructor(data?: Partial<Product>) {
    Object.assign(this, data);
  }
}
