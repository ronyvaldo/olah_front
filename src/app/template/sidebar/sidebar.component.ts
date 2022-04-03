import { Component, Injectable, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { Usuario } from 'src/app/usuarios/usuario';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
@Injectable({
  providedIn: 'root'
})
export class SidebarComponent implements OnInit, OnDestroy {

  loginUsuarioLogado: string;
  usuarioLogado: Usuario;
  infoCongregacao: string;
  perfilUsuarioLogado: number;
  exibirItemGrupos: boolean;

  constructor(
    private usuarioService : UsuariosService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loginUsuarioLogado = this.usuarioService.getUsuarioAutenticado();
    this.definirDadosDoUsuarioLogado();
  }

  definirDadosDoUsuarioLogado() {
    let usuarioObservable = new Observable<Usuario>();
    usuarioObservable = this.usuarioService.getUsuarioByCredential(this.loginUsuarioLogado);
    usuarioObservable
      .subscribe(usuario => {
        if (usuario.igrejas.length > 0) {
          this.infoCongregacao = usuario.igrejas[0].nome;
        } else if (usuario.grupoCongregacional) {
          this.exibirItemGrupos = true;
          this.infoCongregacao = usuario.grupoCongregacional.nome;
        }
        this.perfilUsuarioLogado = usuario.perfil;
    });
  }

  logout() {
    this.usuarioService.encerrarSessao();
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }

  getInfoCongregacao() : string {
    return this.infoCongregacao;
  }

  ngOnDestroy() {
  }

}
