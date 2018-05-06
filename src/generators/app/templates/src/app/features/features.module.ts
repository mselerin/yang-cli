import {NgModule} from '@angular/core';
import {Routes} from '@angular/router';

import {LayoutModule} from './layout/layout.module';

const MODULES: any[] = [
   LayoutModule
];


export const FEATURES_ROUTES: Routes = [
    { path: 'home', loadChildren: '@app/features/home/home.module#HomeModule' }
];


@NgModule({
   imports: MODULES,
   exports: MODULES
})
export class FeaturesModule {}
