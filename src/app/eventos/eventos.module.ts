import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EventosRoutingModule } from './eventos-routing.module';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { EventosComponent } from './eventos.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CadastrarEventoModule } from './cadastrar-evento/cadastrar-evento.module';


@NgModule({
  declarations: [
    EventosComponent
  ],
  imports: [
    CommonModule,
    EventosRoutingModule,
    FormsModule,
    NgbModule,
    FontAwesomeModule,
    CadastrarEventoModule
  ]
})
export class EventosModule { }
