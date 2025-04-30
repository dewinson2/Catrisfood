import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { appConfig } from './app.config';
import { provideRouter, withHashLocation, withInMemoryScrolling } from '@angular/router';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    provideRouter(
      [/* Tus rutas aquí */],
      withHashLocation(), // Necesario para fragments
      withInMemoryScrolling({
        anchorScrolling: 'enabled', // Habilita scroll a los fragments
        scrollPositionRestoration: 'enabled'
      })
    )
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
