import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
<% if (component) {%>import {<%=pascalName%>Component} from "./<%=kebabName%>.component";<% } %>


export const <%=pascalName%>Routes: Routes = [
    <% if (component) {%>{ path: '', component: <%=pascalName%>Component }<% } %>
];


@NgModule({
    providers: [],
    imports: [ RouterModule.forChild(<%=pascalName%>Routes) ]
})
export class <%=pascalName%>RoutingModule {}
