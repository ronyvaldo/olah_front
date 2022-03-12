import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth.guard';
import { LayoutComponent } from '../layout/layout.component';
import { IgrejasFormComponent } from './igrejas-form/igrejas-form.component';
import { IgrejasListComponent } from './igrejas-list/igrejas-list.component';

const routes: Routes = [
  { path: 'igrejas', component: LayoutComponent,
    canActivate: [ AuthGuard ], children: [
    { path: 'form', component: IgrejasFormComponent  },
    { path: 'form/:id', component: IgrejasFormComponent  },
    { path: 'list', component: IgrejasListComponent },
    { path: '', redirectTo: '/igrejas/list', pathMatch: 'full' }
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IgrejasRoutingModule { }
