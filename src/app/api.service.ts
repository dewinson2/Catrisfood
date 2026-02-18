import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../environments/environment';

// ── Interfaces basadas en la API ──
export interface MenuItemAPI {
  id_menu: number;
  name: string;
  price: string;
  description: string;
  category: string;
  img_url: string;
  reviews_numbers: number;
  reviews_average: string;
  created_at?: string;
  updated_at?: string;
  reviews?: ReviewAPI[];
}

export interface ReviewAPI {
  id_review: number;
  id_menu: number;
  rating: number;
  comment: string;
  customer_name: string;
  created_at: string;
}

export interface CategoryAPI {
  category: string;
  count: string;
}

export interface APIResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  count?: number;
}

export interface UploadResponse {
  success: boolean;
  data: {
    url: string;
    public_id: string;
  };
  message: string;
}

export interface StatsAPI {
  total_products: string;
  total_categories: string;
  total_reviews: string;
  global_average: string;
}

export interface CreateMenuDTO {
  name: string;
  price: number;
  description?: string;
  category: string;
  img_url?: string;
}

export interface UpdateMenuDTO {
  name?: string;
  price?: number;
  description?: string;
  category?: string;
  img_url?: string;
}

@Injectable({
  providedIn: 'root'
})
export class APIService {
  http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  // ── Menú ──

  getMenu(category?: string): Observable<APIResponse<MenuItemAPI[]>> {
    const params = category ? `?category=${encodeURIComponent(category)}` : '';
    return this.http.get<APIResponse<MenuItemAPI[]>>(`${this.apiUrl}/menu${params}`).pipe(
      tap(response => console.log('Menu data:', response))
    );
  }

  getMenuItem(id: number): Observable<APIResponse<MenuItemAPI>> {
    return this.http.get<APIResponse<MenuItemAPI>>(`${this.apiUrl}/menu/${id}`);
  }

  createMenuItem(data: CreateMenuDTO): Observable<APIResponse<MenuItemAPI>> {
    return this.http.post<APIResponse<MenuItemAPI>>(`${this.apiUrl}/menu`, data);
  }

  updateMenuItem(id: number, data: UpdateMenuDTO): Observable<APIResponse<MenuItemAPI>> {
    return this.http.put<APIResponse<MenuItemAPI>>(`${this.apiUrl}/menu/${id}`, data);
  }

  deleteMenuItem(id: number): Observable<APIResponse<null>> {
    return this.http.delete<APIResponse<null>>(`${this.apiUrl}/menu/${id}`);
  }

  // ── Categorías ──

  getCategories(): Observable<APIResponse<CategoryAPI[]>> {
    return this.http.get<APIResponse<CategoryAPI[]>>(`${this.apiUrl}/categories`);
  }

  // ── Subida de imágenes ──

  uploadImage(file: File): Observable<UploadResponse> {
    const formData = new FormData();
    formData.append('image', file);
    return this.http.post<UploadResponse>(`${this.apiUrl}/upload`, formData);
  }

  // ── Reviews ──

  getReviews(menuId: number): Observable<APIResponse<ReviewAPI[]>> {
    return this.http.get<APIResponse<ReviewAPI[]>>(`${this.apiUrl}/reviews/${menuId}`);
  }

  createReview(data: { id_menu: number; rating: number; comment?: string; customer_name?: string }): Observable<APIResponse<ReviewAPI>> {
    return this.http.post<APIResponse<ReviewAPI>>(`${this.apiUrl}/reviews`, data);
  }

  // ── Estadísticas ──

  getStats(): Observable<APIResponse<StatsAPI>> {
    return this.http.get<APIResponse<StatsAPI>>(`${this.apiUrl}/stats`);
  }
}
