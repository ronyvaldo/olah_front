import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TipoDespesaFormComponent } from './tipo-despesa-form.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';


@NgModule({
  declarations: [
    TipoDespesaFormComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    NgbModule,
    FontAwesomeModule
  ],
  exports: [
    TipoDespesaFormComponent
  ]
})
export class TipoDespesaModule { }
