import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth.guard';
import { LayoutComponent } from '../layout/layout.component';
import { RelatoriosComponent } from './relatorios.component';

const routes: Routes = [
  { path: 'relatorios', component: LayoutComponent,
    canActivate: [ AuthGuard ], children: [
      { path: 'gerenciador', component: RelatoriosComponent }
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RelatoriosRoutingModule { }
