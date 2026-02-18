import { Component, signal, computed, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NavegacionMenuComponent } from '../../components/navegacion-menu/navegacion-menu.component';
import { APIService, MenuItemAPI, CategoryAPI } from '../../api.service';

@Component({
  selector: 'app-menu',
  imports: [RouterLink, NavegacionMenuComponent, CommonModule],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MenuComponent implements OnInit {
  private apiService = inject(APIService);
  private ratingStarsCache = new Map<number, string>();

  readonly categories = signal<CategoryAPI[]>([]);
  readonly menuItems = signal<MenuItemAPI[]>([]);
  readonly totalItems = computed(() => this.menuItems().length);

  ngOnInit(): void {
    // Cargar categorías
    this.apiService.getCategories().subscribe({
      next: (res) => {
        if (res.success) {
          this.categories.set(res.data);
        }
      },
      error: (err) => console.error('Error cargando categorías:', err)
    });

    // Cargar todos los items del menú
    this.apiService.getMenu().subscribe({
      next: (res) => {
        if (res.success) {
          this.menuItems.set(res.data);
        }
      },
      error: (err) => console.error('Error cargando menú:', err)
    });
  }

  getItemsByCategory(category: string): MenuItemAPI[] {
    return this.menuItems().filter(item => item.category === category);
  }

  
  getRatingStars(rating: number): string {
    const rounded = Math.round(rating);
    if (!this.ratingStarsCache.has(rounded)) {
      this.ratingStarsCache.set(rounded, '★'.repeat(rounded) + '☆'.repeat(5 - rounded));
    }
    return this.ratingStarsCache.get(rounded)!;
  }

  handleAddToCart(item: MenuItemAPI): void {
    console.log('Añadiendo al carrito:', item);
  }
}
