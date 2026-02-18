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
  
  readonly menuData = computed(() => [
    {
      id: 'entradas',
      name: 'Entradas',
      items: [
        {
          id: 1,
          title: 'Minichangas La Guereja',
          description: '3 deliciosas tortillas de trigo rellenas de pollo, salsa roja y una crema agria que te hará bailar de felicidad.',
          price: 380,
          image: 'https://placehold.co/600x400/4CAF50/ffffff?text=Minichangas',
          rating: 5,
          reviews: 29
        },
        {
          id: 2,
          title: 'Totopos Chespirito',
          description: 'Totopos crujientes con una fiesta de queso, pico de gallo y guacamole, y una salsa roja que baila en tu boca.',
          price: 380,
          image: 'totopos.jpg',
          rating: 5,
          reviews: 22
        },
        {
          id: 3,
          title: 'Quesadilla frita Doña Florinda',
          description: '3 deliciosas tortillas de maíz fritas, abrazando queso blanco, salsa roja y una nube de crema agria.',
          price: 380,
          image: 'quesallidas.jpg',
          rating: 5,
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
          price: 490,
          image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Imagen%20de%20WhatsApp%202025-03-22%20a%20las%2013.31.41_26b50582.jpg-4QHfB0tvasC9orjFvpap9xq6TjrRu3.jpeg',
          rating: 5,
          reviews: 24
        },
        {
          id: 7,
          title: 'Tostaditos Res Pollo Mixto o al Pastor',
          description: 'Tu proteína favorita, 4 sabrosas tortillas de trigo o maíz, queso delicioso, pico de gallo y un guacamole cremoso, salsa roja.',
          price: 480,
          image: 'tostadita.jpg',
          rating: 5,
          reviews: 16
        },
        {
          id: 8,
          title: 'Tacos de Birria',
          description: 'Guiso de carne osobuco, 4 raciones, tortillas de maíz, queso, cilantro, cebolla, consomé del guiso, y salsa picante que hace bailar los sabores.',
          price: 680,
          image: 'birria.jpg',
          rating: 5,
          reviews: 20
        },
        {
          id: 9,
          title: 'Tacos Los Chiflados Res Pollo o Mixto',
          description: 'Tu proteína favorita, 3 deliciosas opciones tortilla de maíz o trigo, pico de gallo, guacamole, salsa roja y crema agria. ¡Fiesta de sabores!',
          price: 480,
          image: 'chiflados.jpg',
          rating: 5,
          reviews: 10
        }
      ]
    },
    {
      id: 'totopos',
      name: 'Totopos',
      items: [
        {
          id: 8,
          title: 'Totopos Rancho Grande (Nachos)',
          description: 'Totopos crujientes cargados con carne molida, queso, crema de queso, crema agria, guacamole y pico de gallo.',
          price: 580,
          image: 'RanchoGrande.jpg',
          rating: 5,
          reviews: 18
        },
        {
          id: 9,
          title: 'Chilaquiles Cantinflas Res-Pollo Mixto',
          description: 'Totopos crujientes bañados en salsa roja o verde suave o picante, proteína de elección, crema agria, guacamole y pico de gallo.',
          price: 650,
          image: '',
          rating: 5,
          reviews: 21
        },
        {
          id: 10,
          title: 'Mix de Totopos de Res-Pollo o Mixto',
          description: 'Totopos crujientes, rematados con carne mechada de res, pollo, queso derretido, pico de gallo, guacamole y una nube de crema agria.',
          price: 580,
          image: '',
          rating: 5,
          reviews: 26
        }
      ]
    },
    {
      id: 'quesadillas',
      name: 'Quesadillas',
      items: [
        {
          id: 12,
          title: 'Quesadillas Catrina',
          description: 'Quesadilla con tortilla de trigo XL rellena de queso.',
          price: 490,
          image: '',
          rating: 4,
          reviews: 15
        },
        {
          id: 13,
          title: 'Quesadilla a la Mula',
          description: 'Tortilla de trigo XL repleta de queso, carne al pastor, pico de gallo, guacamole, salsa roja y crema agria.',
          price: 590,
          image: '',
          rating: 5,
          reviews: 12
        }
      ]
    },
    {
      id: 'burritos',
      name: 'Burritos',
      items: [
        {
          id: 14,
          title: 'Burritos Bojitas Res-Pollo o Mixto',
          description: 'Elegir proteína sabrosa, tortilla de trigo XL cargada, lechuga, carne mechada, crema agria, guacamole, pico de gallo y salsa roja.',
          price: 490,
          image: 'bojitas.jpg',
          rating: 5,
          reviews: 27
        },
        {
          id: 15,
          title: 'Burrito Don Barriga Mixto',
          description: 'Tortilla de trigo XL cargada con un festín de carne, tocineta, plátano maduro, lechuga, salsa roja, crema agria y aguacate.',
          price: 630,
          image: 'barriga.jpg',
          rating: 5,
          reviews: 31
        }
      ]
    },
    {
      id: 'fajitas',
      name: 'Fajitas',
      items: [
        {
          id: 16,
          title: 'Fajitas Frida Res-Pollo-Mixta, Cerdo o Camarones',
          description: 'Fajitas elegir proteína con 4 tortillas de trigo suaves, crema agria, pico de gallo y un delicioso guacamole.',
          price: 690,
          image: 'fajitas.jpg',
          rating: 5,
          reviews: 35
        }
      ]
    },
    {
      id: 'otros',
      name: 'Otros',
      items: [
        {
          id: 17,
          title: 'Canasta Catris Mixta',
          description: 'Carrito de sabor: tortillas de trigo rebosantes de sabor, carne mecha mixta, lechuga crujiente, queso derretido, guacamole cremoso, pico de gallo, salsa roja. ¡Una fiesta en cada bocado!',
          price: 680,
          image: 'https://placehold.co/600x400/FFEB3B/ffffff?text=Canasta',
          rating: 5,
          reviews: 0
        },
        {
          id: 18,
          title: 'Flauta La Popis Res-Pollo o Mixto',
          description: 'Escoge tu proteína favorita y disfruta de 4 crujientes tortillas de maíz fritas rellenas de sabrosa carne, acompañadas de crujiente lechuga, queso ricotta, crema agria, pico de gallo, salsa roja y guacamole. ¡Una fiesta para el paladar!',
          price: 490,
          image: '',
          rating: 5,
          reviews: 0
        },
        {
          id: 19,
          title: 'Chimichanga La Chimoltrufia Res-Pollo o Mixto',
          description: 'Escoge tu proteína favorita y disfruta de una deliciosa tortilla de trigo XL frita cargada de carne, crema agria, queso fundido, ricotta y guacamole, salsa roja. ¡Un festín para tu paladar!',
          price: 490,
          image: '',
          rating: 5,
          reviews: 0
        },
        {
          id: 20,
          title: 'Tinga de Pollo',
          description: 'Carne mechada, salsa especial de chile y chipotle, aguacate cremoso, queso ricotta, lechuga fresca y un toque de crema agria, todo apilado en 2 crujientes tostadas de maíz.',
          price: 490,
          image: '',
          rating: 5,
          reviews: 0
        },
        {
          id: 21,
          title: 'Torta La Chingona',
          description: 'Pan recién horneado, carne a la plancha, pollo o cerdo, queso, crujiente repollo, jugoso tomate, cebolla, chorizo y una deliciosa salsa secreta de la casa.',
          price: 680,
          image: 'chingona.jpg',
          rating: 5,
          reviews: 0
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
