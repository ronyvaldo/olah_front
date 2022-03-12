import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth.guard';
import { LayoutComponent } from '../layout/layout.component';
import { CalendarioComponent } from './calendario.component';

const routes: Routes = [
  { path: 'calendario', component: LayoutComponent,
    canActivate: [ AuthGuard ], children: [
        { path: 'view', component: CalendarioComponent },
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CalendarioRoutingModule { }
