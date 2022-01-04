import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';
import { Observable } from 'rxjs';
import { SidebarComponent } from '../template/sidebar/sidebar.component';
import { UsuariosService } from '../usuarios.service';
import { Usuario } from '../usuarios/usuario';

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
    private usuarioService : UsuariosService) { }

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

}
