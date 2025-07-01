import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Category } from "../shared/models/category.model";

@Injectable({
  providedIn: "root",
})
export class CategoryService {
  private apiUrl = "http://localhost:8080/api/categories";

  constructor(private http: HttpClient) {}

  getAll(): Observable<Category[]> {
  return this.http.get<Category[]>("http://localhost:8080/api/categories/all");
}


  getById(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.apiUrl}/${id}`);
  }

  create(category: Category): Observable<Category> {
    return this.http.post<Category>(this.apiUrl, category);
  }

  update(id: number, category: Category): Observable<Category> {
    return this.http.put<Category>(`${this.apiUrl}/${id}`, category);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
