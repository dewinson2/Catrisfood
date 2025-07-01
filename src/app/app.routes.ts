import { Routes } from '@angular/router';
import { HomeComponent } from './views/home/home.component';
import path from 'path';
import { MenuComponent } from './views/menu/menu.component';
import { AddItemsComponent } from './views/add-items/add-items.component';
import { SaveItemsComponent } from './views/save-items/save-items.component';

export const routes: Routes = [

    {path: '',component: HomeComponent},
    {path: 'menu',component: MenuComponent},
    {path: 'add-items', component: AddItemsComponent},
    {path: 'save-items', component: SaveItemsComponent}

];
