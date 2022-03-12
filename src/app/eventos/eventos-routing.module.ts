import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth.guard';
import { LayoutComponent } from '../layout/layout.component';
import { EventosComponent } from './eventos.component';
/*import { IgrejasFormComponent } from './igrejas-form/igrejas-form.component';
import { IgrejasListComponent } from './igrejas-list/igrejas-list.component';*/

const routes: Routes = [
  { path: 'eventos', component: LayoutComponent,
    canActivate: [ AuthGuard ], children: [
    { path: 'list', component: EventosComponent },
    { path: '', redirectTo: '/eventos/list', pathMatch: 'full' }
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventosRoutingModule { }
