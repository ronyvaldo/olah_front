import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TipoContribuicaoFormComponent } from './tipo-contribuicao-form.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';


@NgModule({
  declarations: [
    TipoContribuicaoFormComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    NgbModule,
    FontAwesomeModule
  ],
  exports: [
    TipoContribuicaoFormComponent
  ]
})
export class TipoContribuicaoModule { }
