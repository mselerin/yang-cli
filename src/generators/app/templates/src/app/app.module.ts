// Angular Modules
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

// Components
import {AppRoutingModule} from './app-routing.module';
import {CoreModule} from './core/core.module';
import {FeaturesModule} from './features/features.module';
import {AppComponent} from './app.component';


const MODULES: any[] = [
    BrowserModule,
    CoreModule,
    FeaturesModule,
    AppRoutingModule
];


const DECLARATIONS: any[] = [
    AppComponent
];


@NgModule({
    imports: MODULES,
    declarations: DECLARATIONS,
    bootstrap: [ AppComponent ]
})
export class AppModule { }
