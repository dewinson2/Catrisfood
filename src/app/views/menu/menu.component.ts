import { Component, signal, computed, ChangeDetectionStrategy,inject } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NavegacionMenuComponent } from '../../components/navegacion-menu/navegacion-menu.component';
import { AdminService } from '../admin.service';
import DataJSON from '../../interfaces/menu.data.json';

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

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, RouterLink, NavegacionMenuComponent, 

  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MenuComponent {
    private adminService = inject(AdminService);

  private ratingStarsCache = new Map<number, string>();
  menuData = signal<MenuCategory[]>([]);
    

  
  ngOnInit() {
    // Cargar los datos del JSON al iniciar el componente
    (DataJSON as MenuCategory[]).forEach(category => {
      this.adminService.addMenuCategory(category);
    });
    // Si existe en localStorage, la cargamos
    this.menuData.set(this.adminService.getMenuData());
    
  
   console.log('🗂️ Datos del menú cargados desde JSON:', DataJSON);
   

  }

  
  trackByCategoryId(index: number, category: MenuCategory): string {
    return category.id;
  }

  trackByItemId(index: number, item: MenuItem): number {
    return item.id;
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
}
