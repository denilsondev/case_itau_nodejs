import { ApplicationConfig } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideNgxMask } from 'ngx-mask';


export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideNgxMask()
  ]
};
