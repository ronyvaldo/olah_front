import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ContribuicoesService } from 'src/app/services/contribuicoes.service';
import { Contribuicao } from '../contribuicao';
import { PaginaContribuicao } from '../paginaContribuicao';

@Component({
  selector: 'app-contribuicoes-list',
  templateUrl: './contribuicoes-list.component.html',
  styleUrls: ['./contribuicoes-list.component.css']
})
export class ContribuicoesListComponent implements OnInit {

  contribuicao : Contribuicao;
  contribuicoes : Contribuicao[] = [];
  contribuicaoSelecionada : Contribuicao;
  mensagemSucesso : String;
  mensagemErro : String;
  totalElementos = 0;
  paginaAtual: number = 0;
  tamanho = 10;
  paginas: number[];
  ultimaPagina: number;

  constructor(private service : ContribuicoesService,
    private router : Router,
    private activatedRoute : ActivatedRoute) {}

  ngOnInit(): void {
    this.listarContribuicoes();
  }

  listarContribuicoes() {
    this.service.getContribuicoes(this.paginaAtual.toString(), this.tamanho.toString())
        .subscribe( response => {
          this.contribuicoes = response.content;
          this.totalElementos = response.totalElements;
          this.paginaAtual = response.number;
          this.definirPaginas();
        }, (erro: HttpErrorResponse) => erro.status == 403 ? this.forbidden() : console.log(erro.status)
    )
  }

  inicializarPaginacao() {
    this.paginaAtual = 0;
    this.tamanho = 10;
  }

  forbidden() {
    this.router.navigate(["/http403"]);
  }

  novaContribuicao() {
    this.router.navigate([ "/contribuicoes/form/" ]);
  }

  preparar(contribuicao : Contribuicao) {
    this.contribuicaoSelecionada = contribuicao;
  }

  deletarContribuicao() {
    this.service
    .deletar(this.contribuicao)
    .subscribe(
      response => {
        this.mensagemSucesso = `Contribuição de valor ${this.contribuicaoSelecionada.valor} deletada com sucesso.`
        this.ngOnInit();
      },
      erro => this.mensagemErro = `Ocorreu um erro ao deletar a contribuição de valor ${this.contribuicaoSelecionada.valor}.`
    )
  }

  handlePageSizeChange(event: any): void {
    this.tamanho = event.target.value;
    this.listarContribuicoes();
  }

  handlePageChange(page: number): void {
    this.paginaAtual = page;
    this.listarContribuicoes();
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

}
