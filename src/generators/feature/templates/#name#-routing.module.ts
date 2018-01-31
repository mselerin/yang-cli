import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
<% if (component) {%>import {<%=classify_name%>Component} from './<%=dasherize_name%>.component';<% } %>


export const <%=classify_name%>Routes: Routes = [
    <% if (component) {%>{ path: '', component: <%=classify_name%>Component }<% } %>
];


@NgModule({
    providers: [],
    imports: [ RouterModule.forChild(<%=classify_name%>Routes) ]
})
export class <%=classify_name%>RoutingModule {}
