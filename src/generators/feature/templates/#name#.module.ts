import {NgModule} from '@angular/core';
import {SharedModule} from "app/shared/shared.module";
import {<%=pascalName%>RoutesModule} from './<%=kebabName%>-routing.module';

const MODULES = [
    SharedModule,
    <%=pascalName%>RoutesModule
];

const DECLARATIONS = [
];


@NgModule({
    imports: MODULES,
    declarations: DECLARATIONS
})
export class <%=pascalName%>Module {}
