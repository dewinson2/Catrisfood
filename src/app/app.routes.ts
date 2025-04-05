import { Routes } from '@angular/router';
import { HomeComponent } from './views/home/home.component';
import path from 'path';
import { MenuComponent } from './views/menu/menu.component';

export const routes: Routes = [

    {path: '',component: HomeComponent},
    {path: 'menu',component: MenuComponent


    }

];
