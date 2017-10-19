import {CONFIG} from './config';


// App Styles
import 'app/resources/styles/app.scss';


// Main App module
import {AppModule} from './app.module';


// Polyfills
import './polyfills';
import 'zone.js/dist/zone.js';


// Bootstrap Angular
import {enableProdMode} from "@angular/core";
import {platformBrowserDynamic} from "@angular/platform-browser-dynamic";

if (CONFIG.production)
    enableProdMode();

platformBrowserDynamic().bootstrapModule(AppModule);
