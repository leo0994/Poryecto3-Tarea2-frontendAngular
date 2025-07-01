// src/app/shared/models/category.model.ts
export class Category {
  id: number = 0;
  name: string = "";
  description: string = "";

  constructor(data?: Partial<Category>) {
    Object.assign(this, data);
  }
}
