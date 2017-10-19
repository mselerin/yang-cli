import {NgModule} from "@angular/core";
import {Routes} from "@angular/router";
<% if (component) {%>import {<%=pascalName%>Component} from './<%=kebabName%>.component';<% } %>


export const <%=pascalName%>Routes: Routes = [
    <% if (component) {%>{
    path: '<%=kebabName%>',
    component: <%=pascalName%>Component
   }<% } %>
];


@NgModule({
    providers: []
})
export class <%=pascalName%>RoutesModule {}
