import { Injectable, inject, signal, computed, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { APIService, AuthUser, LoginDTO, RegisterDTO } from '../api.service';
import { tap, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private api = inject(APIService);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);

  private readonly TOKEN_KEY = 'auth_token';

  readonly currentUser = signal<AuthUser | null>(null);
  readonly isAuthenticated = computed(() => this.currentUser() !== null);
  readonly loading = signal(false);

  constructor() {
    // Si hay token guardado, intentar cargar el perfil
    if (this.getToken()) {
      this.loadProfile();
    }
  }

  getToken(): string | null {
    if (!isPlatformBrowser(this.platformId)) return null;
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private setToken(token: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.TOKEN_KEY, token);
    }
  }

  private removeToken(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.TOKEN_KEY);
    }
  }

  login(data: LoginDTO): Observable<any> {
    this.loading.set(true);
    return this.api.login(data).pipe(
      tap((res) => {
        this.setToken(res.data.token);
        this.currentUser.set(res.data.user);
        this.loading.set(false);
      }),
      catchError((err) => {
        this.loading.set(false);
        throw err;
      })
    );
  }

  register(data: RegisterDTO): Observable<any> {
    this.loading.set(true);
    return this.api.register(data).pipe(
      tap((res) => {
        this.setToken(res.data.token);
        this.currentUser.set(res.data.user);
        this.loading.set(false);
      }),
      catchError((err) => {
        this.loading.set(false);
        throw err;
      })
    );
  }

  loadProfile(): void {
    this.api.getMe().subscribe({
      next: (res) => this.currentUser.set(res.data),
      error: () => {
        this.removeToken();
        this.currentUser.set(null);
      }
    });
  }

  logout(): void {
    this.removeToken();
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }
}
