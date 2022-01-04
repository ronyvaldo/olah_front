import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth.guard';
import { LayoutComponent } from '../layout/layout.component';

import { UsuariosFormComponent } from './usuarios-form/usuarios-form.component';
import { UsuariosListComponent } from './usuarios-list/usuarios-list.component';

const routes: Routes = [
  { path: 'usuarios', component: LayoutComponent,
    canActivate: [ AuthGuard ], children: [
    { path: 'form', component: UsuariosFormComponent  },
    { path: 'form/:id/:perfil', component: UsuariosFormComponent  },
    { path: 'list/:perfil', component: UsuariosListComponent },
    { path: '', redirectTo: '/usuarios/list', pathMatch: 'full' }
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsuariosRoutingModule { }
