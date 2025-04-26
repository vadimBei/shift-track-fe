import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { tokenInterceptor } from './shared/interceptors/tocken.interceptor';
import { errorInterceptor } from './shared/interceptors/error.interceptor';
import { apiInterceptor } from './shared/interceptors/api.interceptor';
import { ModalModule } from 'ngx-bootstrap/modal';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([
      apiInterceptor,
      tokenInterceptor,
      errorInterceptor])),
    importProvidersFrom([
      ModalModule.forRoot()
    ])
  ]
};
