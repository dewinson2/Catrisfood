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
          title: 'MINICAHNGAS LA GUEREJA',
          description: '3 DELICIOSAS TORTILLAS DE TRIGO RELLENAS DE POLLO, SALSA ROJA Y UNA CREMA AGRIA QUE TE HARÁ BAILAR DE FELICIDAD..',
          price: 380,
          image: 'https://placehold.co/600x400/4CAF50/ffffff?text=Minichangas',
          rating: 5,
          reviews: 29
        },
        {
          id: 2,
          title: 'TOTOPOS CHESPIRITO',
          description: 'TOTOPOS CRUJIENTES CON UNA FIESTA DE QUESOPICO DE GALLO Y GUACAMOLE Y UNA SALSA ROJA QUE BAILA EN TU BOCA.',
          price: 380,
          image: 'totopos.jpg',
          rating: 5,
          reviews: 22
        },
        {
          id: 3,
          title: 'Quesadilla frita doña florinda',
          description: '3 deliciosas tortillas de maíz frita, abranzando queso blanco, salsa roja y una nube de crema agria.',
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
          price: 450,
          image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Imagen%20de%20WhatsApp%202025-03-22%20a%20las%2013.31.41_26b50582.jpg-4QHfB0tvasC9orjFvpap9xq6TjrRu3.jpeg',
          rating: 5,
          reviews: 24
        },
       
        {
          id: 7,
          title: 'Tostadistos Res Pollo Mixto o al Pastor',
          description: 'Tu proteína favorita, 4 sabrosas tortillas de trigo o maíz, queso delicioso, pico de gallo y un guacamole cremoso, salsa roja.',
          price: 490,
          image: 'tostadita.jpg',
          rating: 5,
          reviews: 16
        },
        {



          id: 8,
          title: 'Tacos de Birria',
          description: 'Guiso de carne osobusco, 4 raciones, tortillas de maíz, queso, cilantro cebolla, consomé del guiso, y salsa picante que hace bailar los sabores.',
          price: 680,
          image: 'birria.jpg',
          rating: 5,
          reviews: 20
        },
        
        {
          id: 9,
          title: 'Tacos los chiflados res pollo o mixto',
          description: 'Tu proteína favorita, 3 deliciosas opciones tortilla de Maíz o trigo, pico de gallo guacamole salsa roja y crema agria.¡Fiesta de sabores!',
          price: 480 ,
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
          title: 'TOTOPOS RANCHO GRANDE (NACHOS)',
          description: 'TOTOPOS CRUJIENTES CARGADOS CON CARNE MOLIDA, QUESO, CREMA DE QUESO, CREMA AGRIA, GUACAMOLE Y PICO DE GALLO..',
          price: 580,
          image: 'RanchoGrande.jpg',
          rating: 5,
          reviews: 18
        },
        {
          id: 9,
          title: 'CHILAQUILES CANTINFLAS RES-POLLO MIXTO',
          description: 'TOTOPOS CRUJIENTES BAÑADOS EN SALSA ROJA O VERDE SUAVE O PICANTE, PROTEÍNA DE ELECCION, CREMA AGRIA, GUACAMOLE Y PICO DE GALLO.',
          price: 650,
          image: '',
          rating: 5,
          reviews: 21
        },
        {
          id: 10,
          title: 'MIX DE TOTOPOS DE RES-POLLO O MIXTO',
          description: 'TOTOPOS CRUJIENTES, REMATADOS CON CARNE MECHADADE RES, POLLO, QUESO DERRETIDO, PICO DE GALLO,GUACAMOLE Y UNA NUBE DE CREMA AGRIA.',
          price: 580,
          image: '',
          rating: 5,
          reviews: 26
        }
      ]
    },
    {
      id: 'QUESADILLAS',
      name: 'QUESADILLAS',
      items: [
        {
          id: 12,
          title: 'QUESADILLAS CATRINA',
          description: 'QUESADILLA CON TORTILLA DE TRIGO XL RELLENA DE QUESO.',
          price: 490,
          image: '',
          rating: 4,
          reviews: 15
        },
        {
          id: 13,
          title: 'QUESADILLA A LA MULA',
          description: 'TORTILLA DE TRIGO XL REPLETA DE QUESO, CARNE AL PASTOR, PICO DEGALLO, GUACAMOLE, SALSA ROJA Y CREMA AGRIA.',
          price: 590,
          image: '',
          rating: 5,
          reviews: 12
        }
      ]
    },
    {
      id: 'BURRITOS',
      name: 'BURRITOS',
      items: [
        {
          id: 14,
          title: 'BURRITOS BOJITAS RES-POLLO O MIXTO',
          description: 'ELEGIR PROTEÍNA SABROSA, TORTILLA DE TRIGO XL CARGADA, LECHUGA,CARNE MECHADA, CREMA AGRIA, GUACAMOLE, PICO DE GALLO Y SALSA ROJA.',
          price: 490,
          image: 'bojitas.jpg',
          rating: 5,
          reviews: 27
        },
        {
          id: 15,
          title: 'BURRITO DON BARRIGA MIXTO',
          description: 'TORTILLA DE TRIGO XL CARGADA CON UN FESTÍN DE CARNE, TOCINETA, PLÁTANO MADURO, LECHUGA, SALSA ROJA, CREMA AGRIA Y AGUACATE.',
          price: 630,
          image: 'barriga.jpg',
          rating: 5,
          reviews: 31
        }
      ]
    },
    {
      id: 'FAJITAS',
      name: 'FAJITAS',
      items: [
        {
          id: 16,
          title: 'FAJITAS FRIDA RES-POLLO-MIXTA, CERDO O CAMARONES',
          description: 'FAJITAS ELEGIR PROTEÍNA CON 4 TORTILLAS DE TRIGO SUAVECITAS, CREMA AGRIA, PICO DE GALLO Y UN DELICIOSO GUACAMOLE.',
          price: 690,
          
          image: 'fajitas.jpg',
          rating: 5,
          reviews: 35
        }


      ]
    },
    {
            id: 'Otros',
            name: 'Otros',
            items: [


                {
                    id: 17,
                    title: 'CANASTA CATRIS MIXTA',
                    description: 'CARRITO DE SABOR: TORTILLAS DE TRIGO REBOSANTES DE SABOR, CARNE MECHA MIXTA, LECHUGA CRUJIENTE, QUESO DERRETIDO, GUACAMOLE CREMOSO, PICO DE GALLO, SALSA ROJA. ¡UNA FIESTA EN CADA BOCADO!',
                    price: 680,
                    image: 'https://placehold.co/600x400/FFEB3B/ffffff?text=Canasta',
                    rating: 5,
                    reviews: 0
                },
                {
                  id: 18,
                  title: 'FLAUTA LA POPIS RES-POLLO O MIXTO',
                  description: 'ESCOGE TU PROTEÍNA FAVORITA Y DISFRUTA DE 4 CRUJIENTES TORTILLAS DE MAÍZ FRITAS RELLENAS DE SABROSA CARNE, ACOMPAÑADAS DE CRUJIENTE LECHUGA, QUESO RICOTTA, CREMA AGRIA, PICO DE GALLO, SALSA ROJA Y GUACAMOLE. ¡UNA FIESTA PARA EL PALADAR!',
                  price: 490,
                  image: '',
                  rating: 5,
                  reviews: 0
                },
                {
                  id: 19,
                  title: 'CHIMICHANGA LA CHIMOLTRUFIA RES-POLLO O MIXTO',
                  description: 'ESCOGE TU PROTEÍNA FAVORITA Y DISFRUTA DE UNA DELICIOSA TORTILLA DE TRIGO XL FRITA CARGADA DE CARNE, CREMA AGRIA, QUESO FUNDIDO, RICOTTA Y GUACAMOLE, SALSA ROJA. ¡UN FESTÍN PARA TU PALADAR!',
                  price: 490,
                  image: '',
                  rating: 5,
                  reviews: 0
                },
                {
                  id: 20,
                  title: 'TINGA DE POLLO',
                  description: 'CARNE MECHADA, SALSA ESPECIAL DE CHILE Y CHIPOTLE, AGUACATE CREMOSO, QUESO RICOTTA, LECHUGA FRESCA Y UN TOQUE DE CREMA AGRIA, TODO APILADO EN 2 CRUJIENTES TOSTADAS DE MAÍZ.',
                  price: 490,
                  image: '',
                  rating: 5,
                  reviews: 0
                },
                {
                  id: 21,
                  title: 'TORTA LA CHINGONA',
                  description: 'PAN RECIÉN HORNEADO, CARNE A LA PLANCHA, POLLO O CERDO, QUESO, CRUJIENTE REPOLLO, JUGOSO TOMATE, CEBOLLA, CHORIZO Y UNA DELICIOSA SALSA SECRETA DE LA CASA.',
                  price: 680,
                  image: 'chingona.jpg',
                  rating: 5,
                  reviews: 0
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