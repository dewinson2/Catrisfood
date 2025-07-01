import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

interface MenuCategory {
  id: string;
  name: string;
  items: MenuItem[];
}

interface MenuItem {
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
  private readonly API_BASE_URL = 'https://v0-typescript-backend-interface.vercel.app/api';
  
  // Cache local para mantener los datos sincronizados
  private menuDataSubject = new BehaviorSubject<MenuCategory[]>([]);
  private menuData: MenuCategory[] = [];

  constructor(private http: HttpClient) {
    console.log('🚀 AdminService inicializado con API:', this.API_BASE_URL);
    this.loadMenuData();
  }

  /**
   * Carga los datos desde la API (reemplaza localStorage)
   */
  private loadMenuData(): void {
    console.log('🔄 Cargando datos del menú desde la API...');
    
    this.http.get<MenuCategory[]>(`${this.API_BASE_URL}/categories`)
      .pipe(
        tap(data => {
          console.log('📥 Datos recibidos de la API:', data);
          console.log('📊 Número de categorías:', data?.length || 0);
        }),
        catchError(this.handleError)
      )
      .subscribe({
        next: (data) => {
          this.menuData = data;
          this.menuDataSubject.next(data);
          console.log('🗂️ Datos del menú cargados desde la API:', data);
        },
        error: (error) => {
          console.error('❌ Error al cargar datos del menú:', error);
          this.menuData = [];
          this.menuDataSubject.next([]);
        }
      });
  }

  /**
   * Guarda en la API (reemplaza saveToLocalStorage)
   */
  private saveToLocalStorage(): void {
    // Esta función ya no es necesaria porque cada operación
    // se guarda directamente en la API, pero la mantengo
    // para compatibilidad
    console.log('💾 Datos sincronizados con la API automáticamente');
  }

  /**
   * Manejo de errores HTTP
   */
  private handleError(error: HttpErrorResponse) {
    console.error('❌ Error HTTP:', error);
    
    let errorMessage = 'Ha ocurrido un error desconocido';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Código de error: ${error.status}, mensaje: ${error.error?.error || error.message}`;
    }
    
    console.error('❌ Mensaje de error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  /**
   * Obtiene todos los datos del menú (MISMA FUNCIÓN - ahora desde API)
   */
  getMenuData(): MenuCategory[] {
    console.log('📖 getMenuData() - Datos actuales:', this.menuData);
    return this.menuData;
  }

  /**
   * Obtiene una categoría por ID (MISMA FUNCIÓN - ahora desde API)
   */
  getMenuCategoryById(categoryId: string): MenuCategory | undefined {
    console.log(`🔍 Buscando categoría con ID: ${categoryId}`);
    const category = this.menuData.find(cat => cat.id === categoryId);
    
    if (category) {
      console.log('✅ Categoría encontrada:', category);
    } else {
      console.log('❌ Categoría no encontrada');
    }
    
    return category;
  }

  /**
   * Elimina un item del menú (MISMA FUNCIÓN - ahora usa API)
   */
  deleteMenuItem(itemId: number): void {
    console.log(`🗑️ Eliminando item con ID: ${itemId}`);
    
    this.http.delete(`${this.API_BASE_URL}/items/${itemId}`)
      .pipe(
        tap(() => {
          console.log(`✅ Item ${itemId} eliminado en el servidor`);
        }),
        catchError(this.handleError)
      )
      .subscribe({
        next: () => {
          // Actualizar cache local igual que antes
          let itemFound = false;
          this.menuData.forEach(category => {
            category.items = category.items.filter(item => {
              const shouldDelete = item.id === itemId;
              if (shouldDelete) {
                itemFound = true;
              }
              return !shouldDelete;
            });
          });

          if (itemFound) {
            this.menuDataSubject.next([...this.menuData]);
            console.log(`✅ Item ${itemId} eliminado exitosamente`);
          }
        },
        error: (error) => {
          console.error(`❌ Error al eliminar item ${itemId}:`, error);
        }
      });
  }

  /**
   * Agrega una nueva categoría (MISMA FUNCIÓN - ahora usa API)
   */
  addMenuCategory(category: MenuCategory): void {
    console.log('➕ Agregando nueva categoría:', category);
    
    if (this.menuData.some(cat => cat.id === category.id)) {
      console.error(`❌ Ya existe una categoría con id "${category.id}"`);
      return;
    }

    this.http.post<MenuCategory>(`${this.API_BASE_URL}/categories`, { name: category.name })
      .pipe(
        tap(newCategory => {
          console.log('✅ Categoría creada en el servidor:', newCategory);
        }),
        catchError(this.handleError)
      )
      .subscribe({
        next: (newCategory) => {
          // Actualizar cache local igual que antes
          this.menuData.push(newCategory);
          this.menuDataSubject.next([...this.menuData]);
          console.log('✅ Categoría agregada exitosamente:', newCategory);
        },
        error: (error) => {
          console.error('❌ Error al agregar categoría:', error);
        }
      });
  }

  /**
   * Elimina una categoría (MISMA FUNCIÓN - ahora usa API)
   */
  deleteMenuCategory(categoryId: string): void {
    console.log(`🗑️ Eliminando categoría con ID: ${categoryId}`);
    
    const initialLength = this.menuData.length;
    
    this.http.delete(`${this.API_BASE_URL}/categories/${categoryId}`)
      .pipe(
        tap(() => {
          console.log(`✅ Categoría ${categoryId} eliminada en el servidor`);
        }),
        catchError(this.handleError)
      )
      .subscribe({
        next: () => {
          // Actualizar cache local igual que antes
          this.menuData = this.menuData.filter(cat => cat.id !== categoryId);
          
          if (this.menuData.length < initialLength) {
            this.menuDataSubject.next([...this.menuData]);
            console.log(`✅ Categoría ${categoryId} eliminada exitosamente`);
          } else {
            console.error(`❌ No existe categoría con id "${categoryId}" para eliminar.`);
          }
        },
        error: (error) => {
          console.error(`❌ Error al eliminar categoría ${categoryId}:`, error);
        }
      });
  }

  /**
   * Actualiza una categoría (MISMA FUNCIÓN - ahora usa API)
   */
  updateCategory(categoryId: string, updatedCategory: MenuCategory): void {
    console.log(`📝 Actualizando categoría ${categoryId}:`, updatedCategory);
    
    const index = this.menuData.findIndex(cat => cat.id === categoryId);
    if (index === -1) {
      console.error(`❌ No existe categoría con id "${categoryId}" para actualizar.`);
      return;
    }

    this.http.put<MenuCategory>(`${this.API_BASE_URL}/categories/${categoryId}`, { name: updatedCategory.name })
      .pipe(
        tap(updated => {
          console.log('✅ Categoría actualizada en el servidor:', updated);
        }),
        catchError(this.handleError)
      )
      .subscribe({
        next: (updated) => {
          // Actualizar cache local igual que antes, manteniendo los items
          this.menuData[index] = { ...updated, items: this.menuData[index].items };
          this.menuDataSubject.next([...this.menuData]);
          console.log('✅ Categoría actualizada exitosamente:', updated);
        },
        error: (error) => {
          console.error(`❌ Error al actualizar categoría ${categoryId}:`, error);
        }
      });
  }

  /**
   * Actualiza un campo específico de un item (MISMA FUNCIÓN - ahora usa API)
   */
  updateMenuItem(
    categoryId: string,
    itemId: number,
    field: keyof MenuItem,
    value: string | number
  ): void {
    console.log(`📝 Actualizando item ${itemId}, campo ${field}:`, value);
    
    const category = this.getMenuCategoryById(categoryId);
    if (!category) {
      console.error(`❌ No existe categoría con id "${categoryId}"`);
      return;
    }

    const item = category.items.find(item => item.id === itemId);
    if (!item) {
      console.error(`❌ No existe item con id "${itemId}" en la categoría "${categoryId}"`);
      return;
    }

    // Validaciones igual que antes
    if (
      (field === 'id' || field === 'price' || field === 'rating' || field === 'reviews') &&
      typeof value !== 'number'
    ) {
      console.error(`❌ Tipo de valor incorrecto para el campo "${field}"`);
      return;
    } else if (
      (field === 'title' || field === 'description' || field === 'image') &&
      typeof value !== 'string'
    ) {
      console.error(`❌ Tipo de valor incorrecto para el campo "${field}"`);
      return;
    }

    // Crear objeto de actualización
    const updateRequest = { [field]: value };

    this.http.put<MenuItem>(`${this.API_BASE_URL}/items/${itemId}`, updateRequest)
      .pipe(
        tap(updatedItem => {
          console.log('✅ Item actualizado en el servidor:', updatedItem);
        }),
        catchError(this.handleError)
      )
      .subscribe({
        next: (updatedItem) => {
          // Actualizar cache local igual que antes
          const itemIndex = category.items.findIndex(item => item.id === itemId);
          if (itemIndex !== -1) {
            category.items[itemIndex] = updatedItem;
            this.menuDataSubject.next([...this.menuData]);
            console.log('✅ Item actualizado exitosamente:', updatedItem);
          }
        },
        error: (error) => {
          console.error(`❌ Error al actualizar item ${itemId}:`, error);
        }
      });
  }

  /**
   * Agrega un nuevo item a una categoría (MISMA FUNCIÓN - ahora usa API)
   */
  addMenuItem(categoryId: string, item: MenuItem): void {
    console.log(`➕ Agregando nuevo item a categoría ${categoryId}:`, item);
    
    const category = this.getMenuCategoryById(categoryId);
    if (!category) {
      console.error(`❌ No existe categoría con id "${categoryId}" para agregar el ítem.`);
      return;
    }

    if (category.items.some(existingItem => existingItem.id === item.id)) {
      console.error(`❌ Ya existe un ítem con id "${item.id}" en la categoría "${categoryId}"`);
      return;
    }

    const request = {
      title: item.title,
      description: item.description,
      price: item.price,
      image: item.image,
      rating: item.rating,
      reviews: item.reviews,
      categoryId: categoryId
    };

    this.http.post<MenuItem>(`${this.API_BASE_URL}/items`, request)
      .pipe(
        tap(newItem => {
          console.log('✅ Item creado en el servidor:', newItem);
        }),
        catchError(this.handleError)
      )
      .subscribe({
        next: (newItem) => {
          // Actualizar cache local igual que antes
          category.items.push(newItem);
          this.menuDataSubject.next([...this.menuData]);
          console.log('✅ Item agregado exitosamente:', newItem);
        },
        error: (error) => {
          console.error('❌ Error al agregar item:', error);
        }
      });
  }

  /**
   * Función adicional para refrescar datos manualmente
   */
  refreshData(): void {
    console.log('🔄 Refrescando datos desde la API...');
    this.loadMenuData();
  }

  /**
   * Observable para suscribirse a cambios en los datos
   */
  getMenuData$(): Observable<MenuCategory[]> {
    return this.menuDataSubject.asObservable();
  }
}