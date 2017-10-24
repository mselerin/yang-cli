import {Routes, RouterModule} from "@angular/router";
import {ModuleWithProviders} from "@angular/core";
import {LayoutComponent} from "./features/layout/layout.component";

const FEATURES_ROUTES: Routes = [
];


export const routes: Routes = [
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

export const AppRoutingModule: ModuleWithProviders = RouterModule.forRoot(routes, { useHash: true });
