import { Component, signal, computed, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NavegacionMenuComponent } from '../../components/navegacion-menu/navegacion-menu.component';
import { APIService } from '../../api.service';

interface MenuCategory {
  id: string;
  name: string;
}

interface MenuItem {
  id: number;
  category_id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  rating: number;
  reviews: number;
}

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, RouterLink, NavegacionMenuComponent, NgOptimizedImage],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MenuComponent implements OnInit {
  private apiService = inject(APIService);
  private ratingStarsCache = new Map<number, string>();

  readonly categories= signal<MenuCategory[]>([]);

  // Aquí usamos signal para guardar los items
  readonly menuItems = signal<MenuItem[]>([]);

  // Si quieres derivar cosas, aquí sí puedes usar un computed
  readonly totalItems = computed(() => this.menuItems().length);

  getItemsByCategory(categoryId: string): MenuItem[] {
    return this.menuItems().filter(item => item.category_id === categoryId);
  }

  getRatingStars(rating: number): string {
    if (!this.ratingStarsCache.has(rating)) {
      this.ratingStarsCache.set(rating, '★'.repeat(rating) + '☆'.repeat(5 - rating));
    }
    return this.ratingStarsCache.get(rating)!;
  }

  handleAddToCart(item: MenuItem): void {
    console.log('Añadiendo al carrito:', item);
  }

  ngOnInit() {
  this.apiService.getMenuItems().subscribe({
    next: (items) => this.menuItems.set(items),
    error: (err) => console.error('Error cargando menú:', err)
  });

  this.apiService.getMenuCategories().subscribe({
    next: (categories) => this.categories.set(categories),
    error: (err) => console.error('Error cargando categorías:', err)
  });
  console.log(this.categories());
}

}
