// Rxjs
import 'rxjs';

// Angular Modules
import {NgModule, SkipSelf, Optional, APP_INITIALIZER} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';

// Constants
import {AppConfig} from 'app/models/app-config.model';
import {Session} from 'app/app.session';

// Services
import {CoreInitializer} from './core.initializer';

// Modules
import {InterceptorsModule} from './core.interceptors';
import {ServicesModule} from './core.services';


// App init
export function coreInitFactory(coreInit: CoreInitializer) {
   return () => coreInit.init();
}


// Translation
export function httpLoaderFactory(http: HttpClient) {
   return new TranslateHttpLoader(http, 'app/resources/i18n/', '.json');
}


const PROVIDERS = [
    // Initialisation de l'application
    CoreInitializer,
    {
        provide: APP_INITIALIZER,
        multi: true,
        // Doit retourner une fonction qui renvoie une Promise
        useFactory: coreInitFactory,
        deps: [CoreInitializer]
    },

    AppConfig,
    Session
];


const MODULES = [
    TranslateModule.forRoot({
        loader: {
            provide: TranslateLoader,
            useFactory: httpLoaderFactory,
            deps: [HttpClient]
        }
    }),
    CommonModule,
    HttpClientModule,
    InterceptorsModule,
    ServicesModule
];


@NgModule({
   providers: PROVIDERS,
   imports: MODULES
})
export class CoreModule {
   constructor( @Optional() @SkipSelf() parentModule: CoreModule) {
      if (parentModule) {
         throw new Error(`CoreModule has already been loaded. Import Core modules in the AppModule only.`);
      }
   }
}
