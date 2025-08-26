import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

interface MenuCategory {
  id: string;
  name: string;
}

interface MenuItem {
  id: number;
  category_id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  rating: number;
  reviews: number;
}

@Injectable({
  providedIn: 'root'
})
export class APIService {
  readonly apiurl = "https://jpadjbcrfeolyhexmxul.supabase.co/rest/v1";
  http = inject(HttpClient);
  readonly apyKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpwYWRqYmNyZmVvbHloZXhteHVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEzOTc0ODcsImV4cCI6MjA2Njk3MzQ4N30.rDBTSEpNSCAB9yeIcJXbughluBHF4cjsY1kXPLBx39k";

  getMenuItems(): Observable<MenuItem[]> {
    const headers = new HttpHeaders({
      'apikey': this.apyKey,
      'Authorization': `Bearer ${this.apyKey}`,
      'Content-Type': 'application/json',

    });

    return this.http.get<MenuItem[]>(`${this.apiurl}/menu_items?select=*`, { headers })
      .pipe(
        tap(items => console.log('Items recibidos:', items)) // 👈 Aquí haces el log sin romper el Observable
      );
  }


  getMenuCategories(): Observable<MenuCategory[]> {
    const headers = new HttpHeaders({
      'apikey': this.apyKey,
      'Authorization': `Bearer ${this.apyKey}`,
      'Content-Type': 'application/json',
       

    });

    return this.http.get<MenuCategory[]>(`${this.apiurl}/menu_categories?select=*`, { headers })
      .pipe(
        tap(categories => console.log('Categorías recibidas:', categories)) // 👈 Aquí haces el log sin romper el Observable
      );
  }
}
