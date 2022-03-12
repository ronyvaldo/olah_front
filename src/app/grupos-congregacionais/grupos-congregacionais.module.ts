import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GruposCongregacionaisRoutingModule } from './grupos-congregacionais-routing.module';
import { GruposCongregacionaisFormComponent } from './grupos-congregacionais-form/grupos-congregacionais-form.component';
import { GruposCongregacionaisListComponent } from './grupos-congregacionais-list/grupos-congregacionais-list.component';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [
    GruposCongregacionaisFormComponent,
    GruposCongregacionaisListComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    GruposCongregacionaisRoutingModule
  ]
})
export class GruposCongregacionaisModule { }
