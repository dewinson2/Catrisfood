import { Component, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NavegacionMenuComponent } from '../../components/navegacion-menu/navegacion-menu.component';

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
  imports: [CommonModule, RouterLink, NavegacionMenuComponent, NgOptimizedImage],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MenuComponent {
  private ratingStarsCache = new Map<number, string>();
  
  readonly menuData = computed(() => [
    {
      id: 'entradas',
      name: 'Entradas',
      items: [
        {
          id: 1,
          title: 'Guacamole Tradicional',
          description: 'Aguacate fresco machacado con cebolla, cilantro, tomate, chile y un toque de limón. Servido con totopos crujientes recién hechos.',
          price: 420,
          image: 'https://placehold.co/600x400/4CAF50/ffffff?text=Guacamole',
          rating: 5,
          reviews: 29
        },
        {
          id: 2,
          title: 'Nachos Supremos',
          description: 'Totopos cubiertos con frijoles refritos, queso fundido, guacamole, crema agria, pico de gallo y jalapeños. Opción de pollo o carne.',
          price: 490,
          image: 'https://placehold.co/600x400/FFC107/ffffff?text=Nachos',
          rating: 4,
          reviews: 22
        },
        {
          id: 3,
          title: 'Queso Fundido',
          description: 'Delicioso queso fundido con chorizo, champiñones o rajas de chile poblano. Servido con tortillas de maíz calientes.',
          price: 470,
          image: 'https://placehold.co/600x400/FF9800/ffffff?text=Queso+Fundido',
          rating: 4,
          reviews: 19
        }
      ]
    },
    {
      id: 'tacos',
      name: 'Tacos',
      items: [
        {
          id: 4,
          title: 'Tacos al Pastor',
          description: 'Deliciosos tacos de carne marinada, servidos con cilantro, cebolla, limón y nuestras salsas caseras.',
          price: 450,
          image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Imagen%20de%20WhatsApp%202025-03-22%20a%20las%2013.31.41_26b50582.jpg-4QHfB0tvasC9orjFvpap9xq6TjrRu3.jpeg',
          rating: 5,
          reviews: 24
        },
        {
          id: 5,
          title: 'Tacos de Carnitas',
          description: 'Tacos de cerdo confitado lentamente, servidos con cebolla, cilantro y salsa verde fresca.',
          price: 460,
          image: 'https://placehold.co/600x400/FF9800/ffffff?text=Tacos+de+Carnitas',
          rating: 4,
          reviews: 20
        },
        {
          id: 6,
          title: 'Tacos Variados',
          description: 'Selección de tacos con diferentes proteínas, acompañados de guacamole, pico de gallo y salsa.',
          price: 520,
          image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Imagen%20de%20WhatsApp%202025-03-22%20a%20las%2013.31.40_9ebda2f8.jpg-G7Gt80auIAnBjf2BFqO5D8fzGnWgGU.jpeg',
          rating: 5,
          reviews: 32
        },
        {
          id: 7,
          title: 'Tacos de Pescado',
          description: 'Filete de pescado fresco empanizado, servido con repollo, pico de gallo y aderezo de chipotle.',
          price: 480,
          image: 'https://placehold.co/600x400/03A9F4/ffffff?text=Tacos+de+Pescado',
          rating: 4,
          reviews: 17
        }
      ]
    },
    {
      id: 'platos-fuertes',
      name: 'Platos Fuertes',
      items: [
        {
          id: 8,
          title: 'Flautas de Pollo',
          description: 'Crujientes flautas de pollo, acompañadas de lechuga, pico de gallo, crema y guacamole.',
          price: 380,
          image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Imagen%20de%20WhatsApp%202025-03-22%20a%20las%2013.31.41_31bd68eb.jpg-aa1wO3JJZf4kKSTn9qbE1Jxn9dBFbD.jpeg',
          rating: 4,
          reviews: 18
        },
        {
          id: 9,
          title: 'Enchiladas Verdes',
          description: 'Tortillas de maíz rellenas de pollo desmenuzado, bañadas en salsa verde, crema, queso fresco y cebolla. Servidas con arroz y frijoles.',
          price: 560,
          image: 'https://placehold.co/600x400/4CAF50/ffffff?text=Enchiladas',
          rating: 4,
          reviews: 21
        },
        {
          id: 10,
          title: 'Chiles Rellenos',
          description: 'Chiles poblanos rellenos de queso, capeados y bañados en salsa de tomate. Servidos con arroz, frijoles y tortillas.',
          price: 590,
          image: 'https://placehold.co/600x400/FF9800/ffffff?text=Chiles+Rellenos',
          rating: 5,
          reviews: 26
        },
        {
          id: 11,
          title: 'Mole Poblano',
          description: 'Pechuga de pollo bañada en nuestra salsa de mole casero, elaborado con más de 20 ingredientes, incluyendo chiles, chocolate, especias y frutos secos.',
          price: 620,
          image: 'https://placehold.co/600x400/795548/ffffff?text=Mole+Poblano',
          rating: 5,
          reviews: 30
        }
      ]
    },
    {
      id: 'ensaladas',
      name: 'Ensaladas',
      items: [
        {
          id: 12,
          title: 'Ensalada Catris',
          description: 'Nuestra deliciosa ensalada es un arcoíris de sabores! Con lechuga crujiente, pepinos frescos, aguacate, tomates jugosos, rúcula picante y rábanos que crujen.',
          price: 580,
          image: 'https://placehold.co/600x400/4CAF50/ffffff?text=Ensalada+Catris',
          rating: 4,
          reviews: 15
        },
        {
          id: 13,
          title: 'Ensalada de Nopal',
          description: 'Nopal fresco cortado en tiras, con tomate, cebolla, cilantro, queso fresco y aderezo de limón. Una opción fresca y tradicional.',
          price: 490,
          image: 'https://placehold.co/600x400/8BC34A/ffffff?text=Ensalada+de+Nopal',
          rating: 4,
          reviews: 12
        }
      ]
    },
    {
      id: 'postres',
      name: 'Postres',
      items: [
        {
          id: 14,
          title: 'Flan de Caramelo',
          description: 'Suave y cremoso flan casero bañado en caramelo. Un clásico postre mexicano que derrite el paladar.',
          price: 320,
          image: 'https://placehold.co/600x400/FFC107/ffffff?text=Flan',
          rating: 5,
          reviews: 27
        },
        {
          id: 15,
          title: 'Churros con Chocolate',
          description: 'Churros recién hechos, crujientes por fuera y suaves por dentro, espolvoreados con azúcar y canela. Servidos con salsa de chocolate caliente.',
          price: 350,
          image: 'https://placehold.co/600x400/795548/ffffff?text=Churros',
          rating: 5,
          reviews: 31
        }
      ]
    },
    {
      id: 'bebidas',
      name: 'Bebidas',
      items: [
        {
          id: 16,
          title: 'Margarita Clásica',
          description: 'Tequila, triple sec y jugo de limón fresco, servida con borde escarchado de sal. Disponible en sabores de fresa, mango o tamarindo.',
          price: 280,
          image: 'https://placehold.co/600x400/CDDC39/ffffff?text=Margarita',
          rating: 5,
          reviews: 35
        },
        {
          id: 17,
          title: 'Agua de Jamaica',
          description: 'Refrescante agua de flor de Jamaica, ligeramente endulzada y con un toque de limón.',
          price: 120,
          image: 'https://placehold.co/600x400/D81B60/ffffff?text=Agua+de+Jamaica',
          rating: 4,
          reviews: 22
        },
        {
          id: 18,
          title: 'Horchata',
          description: 'Deliciosa bebida de arroz con leche, canela y vainilla. Servida bien fría con hielo.',
          price: 120,
          image: 'https://placehold.co/600x400/F5F5F5/333333?text=Horchata',
          rating: 4,
          reviews: 19
        }
      ]
    }
  ]);

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