import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth.guard';
import { LayoutComponent } from '../layout/layout.component';
import { DespesasFormComponent } from './despesas-form/despesas-form.component';
import { DespesasListComponent } from './despesas-list/despesas-list.component';

const routes: Routes = [
  { path: 'despesas', component: LayoutComponent,
    canActivate: [ AuthGuard ], children: [
    { path: 'form', component: DespesasFormComponent  },
    { path: 'form/:id', component:DespesasFormComponent  },
    { path: 'list', component: DespesasListComponent },
    { path: '', redirectTo: '/despesas/list', pathMatch: 'full' }
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DespesasRoutingModule { }
