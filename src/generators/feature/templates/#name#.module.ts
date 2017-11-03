import {NgModule} from '@angular/core';
import {SharedModule} from "app/shared/shared.module";

const MODULES = [
    SharedModule
];

const DECLARATIONS = [
];


@NgModule({
    imports: MODULES,
    declarations: DECLARATIONS
})
export class <%=pascalName%>Module {}
