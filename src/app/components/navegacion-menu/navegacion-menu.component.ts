import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { RouterLink, RouterLinkActive } from '@angular/router'; // Importaciones necesarias
import { CommonModule } from '@angular/common'; // Para *ngIf, *ngFor, etc.

@Component({
  selector: 'app-navegacion-menu',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navegacion-menu.component.html',
  styleUrl: './navegacion-menu.component.css'
})
export class NavegacionMenuComponent implements OnInit {
  activeFragment: string | null = null;
    menuItems = [
    { id: 1, label: 'Entradas', fragment: 'entradas', link: '/menu' },
    { id: 2, label: 'Tacos', fragment: 'tacos', link: '/menu' },
    { id: 3, label: 'Totopos', fragment: 'totopos', link: '/menu' },
    { id: 4, label: 'Quesadillas', fragment: 'quesadillas', link: '/menu' },
    { id: 5, label: 'Burritos', fragment: 'burritos', link: '/menu' },
    { id: 6, label: 'Fajitas', fragment: 'fajitas', link: '/menu' },
    { id: 7, label: 'Otros', fragment: 'otros', link: '/menu' }
  ];
  constructor(private router: Router) {}

  
  ngOnInit() {
    this.setInitialFragment();
    
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateActiveFragment();
      });
  }

  private setInitialFragment() {
    const urlTree = this.router.parseUrl(this.router.url);
    this.activeFragment = urlTree.fragment || 'entradas';
    
    // Forzar detección inicial después de un pequeño delay
    setTimeout(() => {
      this.updateActiveFragment();
    }, 100);
  }

  private updateActiveFragment() {
    const urlTree = this.router.parseUrl(this.router.url);
    const newFragment = urlTree.fragment || 'entradas';
    
    if (newFragment !== this.activeFragment) {
      this.activeFragment = newFragment;
      this.scrollToFragment();
    }
  }

  private scrollToFragment() {
    if (this.activeFragment) {
      setTimeout(() => {
        const element = document.getElementById(this.activeFragment!);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }

  isActive(fragment: string): boolean {
    return this.activeFragment === fragment;
  }

  

}
