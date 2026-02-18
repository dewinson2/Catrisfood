import { Component } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { HeroComponent } from '../../components/hero/hero.component';
import { InfoComponent } from '../../components/info/info.component';
import { MenuComponent } from '../../components/menu/menu.component';
import { EventosComponent } from '../../components/eventos/eventos.component';

import { ReservaComponent } from '../../components/reserva/reserva.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { UbicacionComponent } from '../../../../ubicacion/ubicacion.component';

@Component({
  selector: 'app-home',
  imports: [HeaderComponent, HeroComponent, InfoComponent, MenuComponent,EventosComponent, UbicacionComponent,ReservaComponent,FooterComponent],
  
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
