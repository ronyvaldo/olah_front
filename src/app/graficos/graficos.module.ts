import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GraficosComponent } from './graficos.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    GraficosComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule
  ],
  exports: [
    GraficosComponent
  ]
})
export class GraficosModule { }
