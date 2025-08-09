import { Injectable, inject } from '@angular/core';
import { AdminService, MenuItem } from '../views/admin.service';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FeaturedDishesService {
  private adminService = inject(AdminService);

  /**
   * Obtiene los platillos destacados basados en criterios de calidad
   * @param limit Número máximo de platillos a retornar (por defecto 3)
   * @returns Observable con los platillos destacados
   */
  getFeaturedDishes(limit: number = 3): Observable<MenuItem[]> {
    return this.adminService.menuData$.pipe(
      map(data => {
        // Obtener todos los items de todas las categorías
        const allItems: MenuItem[] = [];
        data.forEach(category => {
          allItems.push(...category.items);
        });

        return this.selectFeaturedDishes(allItems, limit);
      })
    );
  }

  /**
   * Selecciona los platillos destacados usando criterios múltiples
   * @param allItems Todos los items disponibles
   * @param limit Número máximo de platillos a retornar
   * @returns Array de platillos destacados
   */
  private selectFeaturedDishes(allItems: MenuItem[], limit: number): MenuItem[] {
    if (allItems.length === 0) {
      return [];
    }

    // Filtrar items que tengan imagen y descripción válidas
    const validItems = allItems.filter(item => 
      this.isValidItem(item)
    );

    if (validItems.length === 0) {
      // Si no hay items válidos, usar todos los items disponibles
      return allItems.slice(0, limit);
    }

    // Ordenar por puntuación compuesta
    const sortedItems = validItems.sort((a, b) => {
      const scoreA = this.calculateScore(a);
      const scoreB = this.calculateScore(b);
      return scoreB - scoreA;
    });

    return sortedItems.slice(0, limit);
  }

  /**
   * Valida si un item es válido para ser destacado
   * @param item Item a validar
   * @returns true si el item es válido
   */
  private isValidItem(item: MenuItem): boolean {
    return !!(
      item.image && 
      item.image.trim() !== '' && 
      item.description && 
      item.description.trim() !== '' &&
      item.title &&
      item.title.trim() !== '' &&
      item.price > 0
    );
  }

  /**
   * Calcula una puntuación compuesta para un item
   * @param item Item para calcular la puntuación
   * @returns Puntuación numérica
   */
  private calculateScore(item: MenuItem): number {
    // Criterios de puntuación:
    // - Rating: 60% del peso
    // - Popularidad (reseñas): 30% del peso
    // - Calidad de imagen: 10% del peso (si tiene imagen base64, es mejor)

    const ratingScore = (item.rating / 5) * 0.6;
    const popularityScore = Math.min(item.reviews / 50, 1) * 0.3;
    const imageQualityScore = this.hasBase64Image(item.image) ? 0.1 : 0.05;

    return ratingScore + popularityScore + imageQualityScore;
  }

  /**
   * Verifica si una imagen es base64 (mejor calidad)
   * @param imageUrl URL o base64 de la imagen
   * @returns true si es base64
   */
  private hasBase64Image(imageUrl: string): boolean {
    return imageUrl.startsWith('data:image/');
  }

  /**
   * Obtiene platillos destacados por categoría específica
   * @param categoryId ID de la categoría
   * @param limit Número máximo de platillos
   * @returns Observable con los platillos destacados de la categoría
   */
  getFeaturedDishesByCategory(categoryId: string, limit: number = 3): Observable<MenuItem[]> {
    return this.adminService.menuData$.pipe(
      map(data => {
        const category = data.find(cat => cat.id === categoryId);
        if (!category) {
          return [];
        }

        return this.selectFeaturedDishes(category.items, limit);
      })
    );
  }

  /**
   * Obtiene platillos destacados aleatorios (para variedad)
   * @param limit Número máximo de platillos
   * @returns Observable con platillos aleatorios
   */
  getRandomFeaturedDishes(limit: number = 3): Observable<MenuItem[]> {
    return this.getFeaturedDishes(limit * 2).pipe(
      map(items => {
        // Mezclar los items y tomar los primeros 'limit'
        return this.shuffleArray(items).slice(0, limit);
      })
    );
  }

  /**
   * Mezcla un array de manera aleatoria
   * @param array Array a mezclar
   * @returns Array mezclado
   */
  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
}
