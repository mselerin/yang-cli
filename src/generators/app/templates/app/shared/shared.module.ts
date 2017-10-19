// Angular Modules
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HttpClientModule} from "@angular/common/http";
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

// Pipes
import {PropercasePipe} from './pipes/propercase.pipe';

// Components
import {PageHeaderComponent} from './components/page-header.component';


const MODULES: any[] = [
   CommonModule,
   FormsModule,
   HttpClientModule,
   RouterModule,
   BrowserAnimationsModule,
   TranslateModule
];

const DECLARATIONS = [
   PropercasePipe,
   PageHeaderComponent
];


@NgModule({
   imports: MODULES,
   declarations: DECLARATIONS,
   exports: [...MODULES, ...DECLARATIONS]
})
export class SharedModule { }
