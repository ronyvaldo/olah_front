import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth.guard';
import { LayoutComponent } from '../layout/layout.component';
import { GruposCongregacionaisFormComponent } from './grupos-congregacionais-form/grupos-congregacionais-form.component';
import { GruposCongregacionaisListComponent } from './grupos-congregacionais-list/grupos-congregacionais-list.component';

const routes: Routes = [
  { path: 'gruposCongregacionais', component: LayoutComponent,
    canActivate: [ AuthGuard ], children: [
    { path: 'form', component: GruposCongregacionaisFormComponent  },
    { path: 'form/:id', component: GruposCongregacionaisFormComponent  },
    { path: 'list', component: GruposCongregacionaisListComponent },
    { path: '', redirectTo: '/gruposCongregacionais/list', pathMatch: 'full' }
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GruposCongregacionaisRoutingModule { }
