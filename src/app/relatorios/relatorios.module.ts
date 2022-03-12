import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RelatoriosRoutingModule } from './relatorios-routing.module';
import { RelatoriosComponent } from './relatorios.component';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [
    RelatoriosComponent
  ],
  imports: [
    CommonModule,
    RelatoriosRoutingModule,
    FormsModule,
    NgbModule
  ]
})
export class RelatoriosModule { }
