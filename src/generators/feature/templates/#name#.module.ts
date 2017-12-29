import {NgModule} from '@angular/core';
import {SharedModule} from "app/shared/shared.module";
import {<%=pascalName%>RoutingModule} from "./<%=kebabName%>-routing.module";

const MODULES = [
    SharedModule,
    <%=pascalName%>RoutingModule
];

const DECLARATIONS = [
];


@NgModule({
    imports: MODULES,
    declarations: DECLARATIONS
})
export class <%=pascalName%>Module {}
