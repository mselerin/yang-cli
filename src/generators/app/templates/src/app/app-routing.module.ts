import {Injectable, NgModule} from "@angular/core";
import {Routes, RouterModule} from "@angular/router";
import {LayoutComponent} from "./features/layout/layout.component";

const FEATURES_ROUTES: Routes = [
];


export const ROUTES: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    {
        path: '',
        component: LayoutComponent,
        children: [
            ...FEATURES_ROUTES
        ]
    },
    { path: '**', redirectTo: '/home' }
];

@NgModule({
    imports: [
        RouterModule.forRoot([], { useHash: true }),
        RouterModule.forChild(ROUTES)
    ],
    providers: []
})
export class AppRoutingModule {}
