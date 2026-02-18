import { Component, inject, OnInit } from '@angular/core';
import { APIService } from '../../api.service';

@Component({
  selector: 'app-menu',
  imports: [],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent implements OnInit {

   private readonly menuService = inject(APIService);
 
  ngOnInit() {
    this.menuService.getMenu().subscribe(
      {
        next: (data) => {
          console.log('Menu data received in component:', data);
        },
        error: (error) => {
          console.error('Error fetching menu data:', error);
        }
      }
    );
  }

}
