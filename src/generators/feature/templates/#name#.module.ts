import {NgModule} from '@angular/core';
import {SharedModule} from 'app/shared/shared.module';
import {<%=classify_name%>RoutingModule} from './<%=dasherize_name%>-routing.module';

const MODULES = [
    SharedModule,
    <%=classify_name%>RoutingModule
];

const DECLARATIONS = [
];


@NgModule({
    imports: MODULES,
    declarations: DECLARATIONS
})
export class <%=classify_name%>Module {}
