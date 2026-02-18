import { Component } from '@angular/core';
import { SafeResourceUrlPipe } from '../src/app/pipes/safe-resource-url.pipe';

@Component({
  selector: 'app-ubicacion',
  standalone: true,
  imports: [SafeResourceUrlPipe],
  templateUrl: './ubicacion.component.html',
  styleUrl: './ubicacion.component.css'
})
export class UbicacionComponent {
  readonly mapUrl = "https://www.google.com/maps/d/u/0/embed?mid=1Ws2zOViVt9cSTOwJubsBAXyll_lgXys&ehbc=2E312F&noprof=1";
  isInViewport = false;

  constructor() {
    // Inicializamos el observer para detectar cuando el mapa está en el viewport
    const observer = new IntersectionObserver(
      ([entry]) => {
        this.isInViewport = entry.isIntersecting;
      },
      { threshold: 0.1 }
    );

    // Observamos la sección del mapa
    const mapSection = document.querySelector('#ubicacion');
    if (mapSection) {
      observer.observe(mapSection);
    }
  }
}
