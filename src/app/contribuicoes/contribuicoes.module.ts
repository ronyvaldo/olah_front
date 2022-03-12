import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContribuicoesRoutingModule } from './contribuicoes-routing.module';
import { ContribuicoesFormComponent } from './contribuicoes-form/contribuicoes-form.component';
import { ContribuicoesListComponent } from './contribuicoes-list/contribuicoes-list.component';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { TipoContribuicaoModule } from './tipo-contribuicao/tipo-contribuicao.module';


@NgModule({
  declarations: [
    ContribuicoesFormComponent,
    ContribuicoesListComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    AutocompleteLibModule,
    ContribuicoesRoutingModule,
    TipoContribuicaoModule
  ]/*,
  providers: [
    I18n,
    {provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n},
    {provide: NgbDateParserFormatter, useClass: NgbDatePTBRParserFormatter}
  ]*/
})
export class ContribuicoesModule { }
