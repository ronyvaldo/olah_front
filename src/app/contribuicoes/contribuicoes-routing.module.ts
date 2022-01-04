import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth.guard';
import { LayoutComponent } from '../layout/layout.component';

import { ContribuicoesFormComponent } from './contribuicoes-form/contribuicoes-form.component';
import { ContribuicoesListComponent } from './contribuicoes-list/contribuicoes-list.component';

const routes: Routes = [
  { path: 'contribuicoes', component: LayoutComponent,
    canActivate: [ AuthGuard ], children: [
    { path: 'form', component: ContribuicoesFormComponent  },
    { path: 'form/:id', component: ContribuicoesFormComponent  },
    { path: 'list', component: ContribuicoesListComponent },
    { path: '', redirectTo: '/contribuicoes/list', pathMatch: 'full' }
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContribuicoesRoutingModule { }
