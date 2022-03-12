import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { SidebarComponent } from '../template/sidebar/sidebar.component';
import { UsuariosService } from '../services/usuarios.service';
import { Usuario } from '../usuarios/usuario';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit {

  loginUsuarioLogado: string;
  perfilUsuarioLogado: number;
  infoCongregacao: string;
  
  
  constructor(private sidebar: SidebarComponent,
    private usuarioService : UsuariosService,
    private router : Router) { }

  ngOnInit(): void {
    this.loginUsuarioLogado = this.usuarioService.getUsuarioAutenticado();
    this.definirDadosUsuarioLogado();
  }

  ngAfterViewInit() {
  }

  definirDadosUsuarioLogado() {
    let usuarioObservable = new Observable<Usuario>();
    usuarioObservable = this.usuarioService.getUsuarioByCredential(this.loginUsuarioLogado);
    usuarioObservable
      .subscribe(usuario => {
        this.perfilUsuarioLogado = usuario.perfil;
        if (usuario.igrejas.length > 0) {
          this.infoCongregacao = usuario.igrejas[0].nome;
        } else if (usuario.grupoCongregacional) {
          this.infoCongregacao = usuario.grupoCongregacional.nome;
        }
      });
  }

  abrirEventos() {
    this.router.navigate(['/eventos']);
  }

  abrirAgenda() {
    this.router.navigate(['/calendario/view']);
  }

}
