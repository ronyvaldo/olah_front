import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IgrejasService } from 'src/app/services/igrejas.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { Usuario } from 'src/app/usuarios/usuario';
import { Igreja } from '../igreja';

@Component({
  selector: 'app-igrejas-list',
  templateUrl: './igrejas-list.component.html',
  styleUrls: ['./igrejas-list.component.css']
})
export class IgrejasListComponent implements OnInit {

  usuarioLogado: Usuario;
  totalElementos = 0;
  paginaAtual: number = 0;
  tamanho = 10;
  paginas: number[];
  ultimaPagina: number;
  igrejas: Igreja[] = [];
  mensagemSucesso : String;
  mensagemErro : String;
  igrejaSelecionada : Igreja;

  constructor(private service : IgrejasService,
              private usuarioService : UsuariosService,
              private router : Router) { }

  ngOnInit(): void {
    this.usuarioService.getUsuarioByCredential(this.usuarioService.getUsuarioAutenticado())
      .toPromise().then(
        response => {
          this.usuarioLogado = response;
        },
        errorResponse => console.log("Erro!")
      )
    setTimeout(() => this.listarIgrejas(), 500);
  }

  listarIgrejas() {
    this.service.getIgrejasByGrupoCongregacionalPaged(this.usuarioLogado.grupoCongregacional.id, this.paginaAtual.toString(), this.tamanho.toString())
        .subscribe( response => {
          this.igrejas = response.content;
          this.totalElementos = response.totalElements;
          this.paginaAtual = response.number;
          this.definirPaginas();
        }, (erro: HttpErrorResponse) => erro.status == 403 ? this.forbidden() : console.log(erro.status)
    )
  }

  forbidden() {
    this.router.navigate(["/http403"]);
  }

  inicializarPaginacao() {
    this.paginaAtual = 0;
    this.tamanho = 10;
  }

  handlePageSizeChange(event: any): void {
    this.tamanho = event.target.value;
    this.listarIgrejas();
  }

  handlePageChange(page: number): void {
    this.paginaAtual = page;
    this.listarIgrejas();
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

  novaIgreja() {
    this.router.navigate([ "/igrejas/form/" ]);
  }

  preparar(igreja : Igreja) {
    this.igrejaSelecionada = igreja;
  }

  deletarIgreja() {
    this.service
    .deletar(this.igrejaSelecionada)
    .subscribe(
      response => {
        this.mensagemSucesso = `Igreja ${this.igrejaSelecionada.nome} excluída com sucesso.`
        this.ngOnInit();
      },
      erro => this.mensagemErro = `Ocorreu um erro ao excluir a igreja ${this.igrejaSelecionada.nome}.`
    )
  }

}
