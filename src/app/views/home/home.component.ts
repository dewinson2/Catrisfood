import { Component } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { HeroComponent } from '../../components/hero/hero.component';
import { InfoComponent } from '../../components/info/info.component';
import { MenuComponent } from '../../components/menu/menu.component';
import { EventosComponent } from '../../components/eventos/eventos.component';

@Component({
  selector: 'app-home',
  imports: [HeaderComponent, HeroComponent, InfoComponent, MenuComponent,EventosComponent],
  
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
