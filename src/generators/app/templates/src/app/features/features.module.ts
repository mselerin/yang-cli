import {NgModule} from "@angular/core";

import {LayoutModule} from "./layout/layout.module";

const MODULES: any[] = [
   LayoutModule
];


@NgModule({
   imports: MODULES,
   exports: MODULES
})
export class FeaturesModule {}
