import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FileSaverService } from 'ngx-filesaver';
import { Observable } from 'rxjs';
import { Igreja } from 'src/app/igrejas/igreja';
import { IgrejasService } from 'src/app/services/igrejas.service';
import { ReportsService } from 'src/app/services/reports.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { Usuario } from '../usuario';

@Component({
  selector: 'app-usuarios-list',
  templateUrl: './usuarios-list.component.html',
  styleUrls: ['./usuarios-list.component.css']
})
export class UsuariosListComponent implements OnInit {

  usuarios : Usuario[] = [];
  usuarioSelecionado : Usuario;
  mensagemSucesso : String;
  mensagemErro : String;
  perfil : number;
  descricaoPerfil : string;
  totalElementos = 0;
  paginaAtual: number = 0;
  tamanho = 10;
  loginUsuarioLogado: string;
  paginas: number[];
  ultimaPagina: number;
  usuario : Usuario;
  idIgrejaSelecionada: number;
  igrejas: Igreja[];
  isProcessando: boolean = false;

  constructor(private service : UsuariosService,
    private igrejasService: IgrejasService,
    private reportsService : ReportsService,
    private fileSaver : FileSaverService,
    private router : Router,
    private activatedRoute : ActivatedRoute) {}

  ngOnInit(): void {
    let params : Observable<Params> = this.activatedRoute.params;
    params.subscribe( urlParams => {
        this.perfil = urlParams['perfil'];
        if (this.perfil) {
          this.inicializarPaginacao();
          this.listarUsuarios();
          if (this.perfil == 0) {
            this.descricaoPerfil = 'Usuários de Autocadastro';
          } else if (this.perfil == 1) {
            this.descricaoPerfil = 'Membros';
          } else if (this.perfil == 2) {
            this.descricaoPerfil = 'Administradores';
          }
        }
      })
   /* this.service
    .getUsuarios()
    .subscribe(response => this.usuarios = response);*/
  }

  listarUsuarios() {
    this.service.getUsuariosByPerfil(this.perfil, this.paginaAtual.toString(), this.tamanho.toString())
        .subscribe( response => {
          this.usuarios = response.content;
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

  novoUsuario() {
    this.router.navigate(["/usuarios/form/''/" + this.perfil ]);
  }

  preparar(usuario : Usuario) {
    this.usuarioSelecionado = usuario;
  }

  inativarUsuario() {
    this.service
    .inativar(this.usuarioSelecionado)
    .subscribe(
      response => {
        this.mensagemSucesso = `Usuário ${this.usuarioSelecionado.nome} inativado com sucesso.`
        this.ngOnInit();
      },
      erro => this.mensagemErro = `Ocorreu um erro ao inativar o usuário ${this.usuarioSelecionado.nome}.`
    )
  }

  deletarUsuario() {
    this.service
    .deletar(this.usuarioSelecionado)
    .subscribe(
      response => {
        this.mensagemSucesso = `Usuário ${this.usuarioSelecionado.nome} excluído com sucesso.`
        this.ngOnInit();
      },
      erro => this.mensagemErro = `Ocorreu um erro ao excluir o usuário ${this.usuarioSelecionado.nome}.`
    )
  }

  handlePageSizeChange(event: any): void {
    this.tamanho = event.target.value;
    this.listarUsuarios();
  }

  handlePageChange(page: number): void {
    this.paginaAtual = page;
    this.listarUsuarios();
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

  converterEmMembro() {
    if (this.usuarioSelecionado.perfil == 0) {
      this.service.converterEmMembro(this.usuarioSelecionado.id)
        .subscribe(
          response => {
            this.mensagemSucesso = `Usuário ${this.usuarioSelecionado.nome} convertido em membro com sucesso.`
            this.ngOnInit();
          },
          erro => this.mensagemErro = `Ocorreu um erro ao converter usuário ${this.usuarioSelecionado.nome} em membro.`
        )
    } else {
      this.mensagemErro = "Usuário selecionado não é de autocadastro! A conversão não pode ser realizada.";
    }
  }

  definirDadosDoUsuarioLogado() {
    this.loginUsuarioLogado = this.service.getUsuarioAutenticado();
    let usuarioObservable = new Observable<Usuario>();
    usuarioObservable = this.service.getUsuarioByCredential(this.loginUsuarioLogado);
    usuarioObservable
      .subscribe(usuario => {
        this.usuario = usuario;
        if (usuario.igrejas.length > 0) {
          this.igrejas = usuario.igrejas;
        } else {
          this.igrejasService.getIgrejasByGrupoCongregacional(usuario.grupoCongregacional.id)
            .subscribe( response => this.igrejas = response
            )
        }
        });
  }

  gerarRelatorioDeMembrosDaIgreja() {
    this.definirDadosDoUsuarioLogado();
    setTimeout(() => this.definirIgrejaEGerar(), 1000);
  }
  
  definirIgrejaEGerar() {
    if (this.igrejas && this.igrejas.length >= 1) this.idIgrejaSelecionada = this.igrejas[0].id;
    if (this.idIgrejaSelecionada) {
      this.isProcessando = true;
      this.reportsService.gerarRelatorioDeMembrosDaIgreja(this.idIgrejaSelecionada)
        .subscribe(res => {
          let blob = new Blob([res.body], { type: res.headers.get('content-type') + '; charset=utf-8'});
          let headers = res.headers ? res.headers : new Map();
          let fileName = headers.get('content-disposition').split("filename=")[1];
          this.fileSaver.save(blob,fileName);
          this.isProcessando = false;
        }
        );
    }
  }

}
