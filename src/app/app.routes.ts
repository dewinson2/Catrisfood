import { Routes } from '@angular/router';
import { HomeComponent } from './views/home/home.component';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [

    {path: '',component: HomeComponent},
 {
    path: 'menu', loadComponent: () => import('./views/menu/menu.component').then(m => m.MenuComponent)
 },
 {
    path: 'login', loadComponent: () => import('./views/login/login.component').then(m => m.LoginComponent)
 },
 {
    path: 'admin', loadComponent: () => import('./components/form/form/form.component').then(m => m.FormComponent),
    canActivate: [authGuard]
 },
 {
   path: 'form', loadComponent: () => import('./components/form/form/form.component').then(m => m.FormComponent),
   canActivate: [authGuard]
 }

];
