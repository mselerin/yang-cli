import {environment} from './environments/environment';


// App Styles
import './styles.scss';


// Main App module
import {AppModule} from './app/app.module';


// Polyfills
import './polyfills';
import 'zone.js/dist/zone.js';


// Bootstrap Angular
import {enableProdMode} from "@angular/core";
import {platformBrowserDynamic} from "@angular/platform-browser-dynamic";

if (environment.production)
    enableProdMode();

platformBrowserDynamic().bootstrapModule(AppModule)
    .catch(err => console.log(err));
