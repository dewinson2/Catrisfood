import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FeaturedDishesService } from '../../services/featured-dishes.service';
import { MenuItem } from '../../views/admin.service';

@Component({
  selector: 'app-menu',
  imports: [CommonModule, RouterLink],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent implements OnInit {
  private featuredDishesService = inject(FeaturedDishesService);
  
  // Signal para almacenar los platillos destacados
  featuredDishes = signal<MenuItem[]>([]);

  ngOnInit(): void {
    // Usar el servicio para obtener platillos destacados
    this.featuredDishesService.getFeaturedDishes(3).subscribe(dishes => {
      this.featuredDishes.set(dishes);
    });
  }

  // Método para generar estrellas de rating
  getRatingStars(rating: number): string {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  }

  // Método para manejar el clic en ordenar
  handleOrder(dish: MenuItem): void {
    console.log('Ordenando:', dish.title);
    // Aquí puedes agregar lógica para el carrito de compras
  }

  // Método para debug (solo en desarrollo)
  debugFeaturedDishes(): void {
    console.log('Platillos destacados actuales:', this.featuredDishes());
  }
}
