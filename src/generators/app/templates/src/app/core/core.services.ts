import {NgModule} from '@angular/core';

import {ConfigService} from './services/config.service';

const PROVIDERS: any[] = [
    ConfigService
];


@NgModule({
    providers: PROVIDERS
})
export class ServicesModule {}
