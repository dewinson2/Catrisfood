import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, tap, map } from 'rxjs/operators';
import { of, BehaviorSubject, Observable } from 'rxjs';

export interface MenuCategory {
  id: string;
  name: string;
  items: MenuItem[];
}

export interface MenuItem {
  id: number;
  title: string;
  description: string;
  price: number;
  image: string;
  rating: number;
  reviews: number;
}

@Injectable({ providedIn: 'root' })
export class AdminService {
  private menuData: MenuCategory[] = [];
  private menuDataSubject = new BehaviorSubject<MenuCategory[]>([]);
  public menuData$ = this.menuDataSubject.asObservable();
  
  private readonly API_URL = 'http://localhost:3000';
  http = inject(HttpClient);

  constructor() {
    this.loadMenuData();
  }

  private loadMenuData(): void {
    this.http.get<MenuCategory[]>(`${this.API_URL}/categories`).pipe(
      tap(data => {
        this.menuData = data;
        this.menuDataSubject.next([...this.menuData]);
        console.log('🗂️ Datos cargados desde API:', data);
      }),
      catchError(error => {
        console.error('❌ Error al cargar datos:', error);
        // En caso de error, no usamos almacenamiento local. Emitimos el estado actual o vacío.
        this.menuData = [];
        this.menuDataSubject.next([]);
        return of([]);
      })
    ).subscribe();
  }

  // Operaciones CRUD usando API
  getMenuData(): MenuCategory[] {
    return [...this.menuData];
  }

  getMenuCategoryById(categoryId: string): MenuCategory | undefined {
    return this.menuData.find(cat => cat.id === categoryId);
  }

  addMenuCategory(categoryName: string): Observable<MenuCategory | null> {
    return this.http.post<MenuCategory>(`${this.API_URL}/categories`, { name: categoryName }).pipe(
      tap(newCategory => {
        this.menuData.push(newCategory);
        this.menuDataSubject.next([...this.menuData]);
        console.log('✅ Categoría añadida:', newCategory);
      }),
      catchError(error => {
        console.error('❌ Error añadiendo categoría:', error);
        return of(null);
      })
    );
  }

  updateCategory(categoryId: string, newName: string): Observable<MenuCategory | null> {
    return this.http.put<MenuCategory>(`${this.API_URL}/categories/${categoryId}`, { name: newName }).pipe(
      tap(updatedCategory => {
        const index = this.menuData.findIndex(cat => cat.id === categoryId);
        if (index !== -1) {
          this.menuData[index] = updatedCategory;
          this.menuDataSubject.next([...this.menuData]);
          console.log('✅ Categoría actualizada:', updatedCategory);
        }
      }),
      catchError(error => {
        console.error('❌ Error actualizando categoría:', error);
        return of(null);
      })
    );
  }

  deleteMenuCategory(categoryId: string): Observable<boolean> {
    return this.http.delete(`${this.API_URL}/categories/${categoryId}`).pipe(
      tap(() => {
        this.menuData = this.menuData.filter(cat => cat.id !== categoryId);
        this.menuDataSubject.next([...this.menuData]);
        console.log('🗑️ Categoría eliminada:', categoryId);
        return true;
      }),
      catchError(error => {
        console.error('❌ Error eliminando categoría:', error);
        return of(false);
      }),
      map(() => true)
    );
  }

  addMenuItem(categoryId: string, item: Omit<MenuItem, 'id'>): Observable<MenuItem | null> {
    return this.http.post<MenuItem>(`${this.API_URL}/categories/${categoryId}/items`, item).pipe(
      tap(newItem => {
        const category = this.menuData.find(cat => cat.id === categoryId);
        if (category) {
          category.items.push(newItem);
          this.menuDataSubject.next([...this.menuData]);
          console.log('✅ Ítem añadido:', newItem);
        }
      }),
      catchError(error => {
        console.error('❌ Error añadiendo ítem:', error);
        return of(null);
      })
    );
  }

  updateMenuItem(categoryId: string, itemId: number, updatedFields: Partial<MenuItem>): Observable<MenuItem | null> {
    return this.http.put<MenuItem>(
      `${this.API_URL}/categories/${categoryId}/items/${itemId}`, 
      updatedFields
    ).pipe(
      tap(updatedItem => {
        const category = this.menuData.find(cat => cat.id === categoryId);
        if (category) {
          const itemIndex = category.items.findIndex(item => item.id === itemId);
          if (itemIndex !== -1) {
            category.items[itemIndex] = { ...category.items[itemIndex], ...updatedItem };
            this.menuDataSubject.next([...this.menuData]);
            console.log('✅ Ítem actualizado:', updatedItem);
          }
        }
      }),
      catchError(error => {
        console.error('❌ Error actualizando ítem:', error);
        return of(null);
      })
    );
  }

  deleteMenuItem(categoryId: string, itemId: number): Observable<boolean> {
    return this.http.delete(`${this.API_URL}/categories/${categoryId}/items/${itemId}`).pipe(
      tap(() => {
        const category = this.menuData.find(cat => cat.id === categoryId);
        if (category) {
          category.items = category.items.filter(item => item.id !== itemId);
          this.menuDataSubject.next([...this.menuData]);
          console.log('🗑️ Ítem eliminado:', itemId);
        }
      }),
      catchError(error => {
        console.error('❌ Error eliminando ítem:', error);
        return of(false);
      }),
      map(() => true)
    );
  }
}