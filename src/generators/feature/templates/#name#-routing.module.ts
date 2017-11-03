import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {<%=pascalName%>Module} from "./<%=kebabName%>.module";
<% if (component) {%>import {<%=pascalName%>Component} from "./<%=kebabName%>.component";<% } %>


export const <%=pascalName%>Routes: Routes = [
    <% if (component) {%>{ path: '', component: <%=pascalName%>Component }<% } %>
];


@NgModule({
    providers: [],
    imports: [ <%=pascalName%>Module, RouterModule.forChild(<%=pascalName%>Routes) ]
})
export class <%=pascalName%>RoutingModule {}
