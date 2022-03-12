import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IgrejasRoutingModule } from './igrejas-routing.module';
import { IgrejasFormComponent } from './igrejas-form/igrejas-form.component';
import { IgrejasListComponent } from './igrejas-list/igrejas-list.component';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [
    IgrejasFormComponent,
    IgrejasListComponent
  ],
  imports: [
    CommonModule,
    IgrejasRoutingModule,
    FormsModule,
    NgbModule
  ]
})
export class IgrejasModule { }
