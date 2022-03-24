import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DespesasRoutingModule } from './despesas-routing.module';
import { DespesasFormComponent } from './despesas-form/despesas-form.component';
import { DespesasListComponent } from './despesas-list/despesas-list.component';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TipoDespesaModule } from './tipo-despesa/tipo-despesa.module';


@NgModule({
  declarations: [
    DespesasFormComponent,
    DespesasListComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    DespesasRoutingModule,
    TipoDespesaModule
  ]
})
export class DespesasModule { }
