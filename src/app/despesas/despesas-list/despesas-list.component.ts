import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DespesasService } from 'src/app/services/despesas.service';
import { Despesa } from '../despesa';

@Component({
  selector: 'app-despesas-list',
  templateUrl: './despesas-list.component.html',
  styleUrls: ['./despesas-list.component.css']
})
export class DespesasListComponent implements OnInit {

  despesa : Despesa;
  despesas : Despesa[] = [];
  despesaSelecionada : Despesa;
  mensagemSucesso : String;
  mensagemErro : String;
  totalElementos = 0;
  paginaAtual: number = 0;
  tamanho = 10;
  paginas: number[];
  ultimaPagina: number;

  constructor(private service : DespesasService,
    private router : Router,
    private activatedRoute : ActivatedRoute) {}

  ngOnInit(): void {
    this.listarDespesas();
  }

  listarDespesas() {
    this.service
    .getDespesas(this.paginaAtual.toString(), this.tamanho.toString())
    .subscribe(response => {
      this.despesas = response.content;
      this.totalElementos = response.totalElements;
      this.paginaAtual = response.number;
      this.definirPaginas();
    }, (erro: HttpErrorResponse) => erro.status == 403 ? this.forbidden() : console.log(erro.status))
  }

  inicializarPaginacao() {
    this.paginaAtual = 0;
    this.tamanho = 10;
  }

  forbidden() {
    this.router.navigate(["/http403"]);
  }

  novaDespesa() {
    this.router.navigate([ "/despesas/form/" ]);
  }

  preparar(despesa : Despesa) {
    this.despesaSelecionada = despesa;
  }

  deletarDespesa() {
    this.service
    .deletar(this.despesa)
    .subscribe(
      response => {
        this.mensagemSucesso = `Despesa de valor ${this.despesa.valor} deletada com sucesso.`
        this.ngOnInit();
      },
      erro => this.mensagemErro = `Ocorreu um erro ao deletar a despesa de valor ${this.despesa.valor}.`
    )
  }

  handlePageSizeChange(event: any): void {
    this.tamanho = event.target.value;
    this.listarDespesas();
  }

  handlePageChange(page: number): void {
    this.paginaAtual = page;
    this.listarDespesas();
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
