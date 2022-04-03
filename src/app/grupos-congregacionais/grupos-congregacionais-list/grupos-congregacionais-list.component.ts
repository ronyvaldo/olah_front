import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GruposCongregacionaisService } from 'src/app/services/grupoCongregacional.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { Usuario } from 'src/app/usuarios/usuario';
import { GrupoCongregacional } from '../grupoCongregacional';

@Component({
  selector: 'app-grupos-congregacionais-list',
  templateUrl: './grupos-congregacionais-list.component.html',
  styleUrls: ['./grupos-congregacionais-list.component.css']
})
export class GruposCongregacionaisListComponent implements OnInit {

  totalElementos = 0;
  paginaAtual: number = 0;
  tamanho = 10;
  paginas: number[];
  ultimaPagina: number;
  gruposCongregacionais: GrupoCongregacional[] = [];
  mensagemSucesso : String;
  mensagemErro : String;
  grupoSelecionado : GrupoCongregacional;
  loginUsuarioLogado: string;
  usuarioLogado: Usuario;

  constructor(private service : GruposCongregacionaisService,
              private usuarioService : UsuariosService,
              private router : Router) { }

  ngOnInit(): void {
    this.loginUsuarioLogado = this.usuarioService.getUsuarioAutenticado();
    this.definirDadosDoUsuario();
    setTimeout(() => this.listarGrupos(), 1000);
  }

  definirDadosDoUsuario() {
    this.usuarioService.getUsuarioByCredential(this.loginUsuarioLogado)
      .toPromise().then(usuario => {
        this.usuarioLogado = usuario;
      });
  }

  listarGrupos() {
    if (this.usuarioLogado.perfil == 3) {
      this.service.getTodosPaged(this.paginaAtual.toString(), this.tamanho.toString())
          .subscribe( response => {
            this.gruposCongregacionais = response.content;
            this.totalElementos = response.totalElements;
            this.paginaAtual = response.number;
            this.definirPaginas();
          }, (erro: HttpErrorResponse) => erro.status == 403 ? this.forbidden() : console.log(erro.status)
      )
    } else {
      if (this.usuarioLogado.grupoCongregacional) {
        this.totalElementos = 1;
        this.gruposCongregacionais[0] = this.usuarioLogado.grupoCongregacional;
      }
    }
  }

  novoGrupo() {
    this.router.navigate([ "/gruposCongregacionais/form/" ]);
  }

  inicializarPaginacao() {
    this.paginaAtual = 0;
    this.tamanho = 10;
  }

  handlePageSizeChange(event: any): void {
    this.tamanho = event.target.value;
    this.listarGrupos();
  }

  handlePageChange(page: number): void {
    this.paginaAtual = page;
    this.listarGrupos();
  }

  definirPaginas() {
    this.paginas = [];
    if (this.totalElementos && this.totalElementos > 0) {
      let count = Math.ceil( this.totalElementos / this.tamanho );
      if (count < 0) {
        count = 1;
        this.paginas.push(1);
      }
      this.ultimaPagina = count;
      for(let i = 0; i < count; i++){
        this.paginas.push(i+1);
      }
   }
  }

  forbidden() {
    this.router.navigate(["/http403"]);
  }

}
