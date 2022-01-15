import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { ContribuicoesService } from 'src/app/contribuicoes.service';
import { IgrejasService } from 'src/app/igrejas.service';
import { Igreja } from 'src/app/igrejas/igreja';
import { TipoContribuicao } from 'src/app/tipo-contribuicao/tipoContribuicao';
import { TiposContribuicaoService } from 'src/app/tiposContribuicao.service';
import { UsuariosService } from 'src/app/usuarios.service';
import { Usuario } from 'src/app/usuarios/usuario';
import { UsuarioResumido } from 'src/app/usuarios/usuarioResumido';

import { Contribuicao } from '../contribuicao';

@Component({
  selector: 'app-contribuicoes-form',
  templateUrl: './contribuicoes-form.component.html',
  styleUrls: ['./contribuicoes-form.component.css']
})
export class ContribuicoesFormComponent implements OnInit {

  loginUsuarioLogado: string;
  contribuicao : Contribuicao;
  success: boolean = false;
  errors: String[];
  id: number;
  acaoCadastrar: boolean;
  data: any;
  keyword = 'nome';
  tiposContribuicao: any;
  igrejas: Igreja[];
  isProcessandoIgreja: boolean = true;
  isProcessandoTipos: boolean = true;
  dataContribuicaoTemp: string;
  editando: boolean;

  constructor( private service : ContribuicoesService,
    private tiposService: TiposContribuicaoService,
    private router : Router,
    private usuarioService: UsuariosService,
    private igrejasService: IgrejasService,
    private activatedRoute : ActivatedRoute) {
      this.contribuicao = new Contribuicao();
  }

  ngOnInit(): void {
    this.loginUsuarioLogado = this.usuarioService.getUsuarioAutenticado();
    this.contribuicao.tipoContribuicao = new TipoContribuicao();
    this.definirDadosContribuicao();
  }

  onSubmit() {
    if (this.id) {
      this.service
      .atualizar(this.contribuicao)
      .toPromise().then(response => {
        this.success = true;
        this.errors = [];
        this.voltarParaListagem();
      }, errrorResponse => {
        this.errors = ['Ocorreu um erro ao atualizar a contribuição!']
      })
    } else {
      this.acaoCadastrar = true;
      this.definirIgrejaCadastro();
      this.service
      .salvar(this.contribuicao)
      .toPromise().then( response => {
        this.success = true;
        this.errors = [];
        this.voltarParaListagem();
      }, errorResponse => {
        this.success = false;
        if (errorResponse.error.errors) {
          this.errors = errorResponse.error.errors;
        } else {
          this.errors = ['Erro! Verifique se foram preenchidos todos os dados obrigatórios.'];
        }
      })
    }
  }

  definirDadosContribuicao() {
    this.usuarioService.getUsuarioByCredential(this.loginUsuarioLogado)
      .toPromise().then(usuario => {
        this.contribuicao.usuarioCadastro = usuario;
        if (usuario.igrejas.length > 0) {
          this.igrejas = usuario.igrejas;
        } else {
          this.igrejasService.getIgrejasByGrupoCongregacional(usuario.grupoCongregacional.id)
            .toPromise().then(response => {
              this.igrejas = response;
              this.definirIgrejaCadastro();
              this.definirTiposContribuicao();
            });
          }
          let params : Observable<Params> = this.activatedRoute.params;
          params.subscribe( urlParams => {
            this.id = urlParams['id'];
            if (this.id) {
              this.service.getContribuicaoById(this.id)
              .toPromise().then(
                response => {
                  this.contribuicao = response;
                  this.editando = true;
                  setTimeout(() => {
                    (document.getElementById('idTiposContribuicao') as HTMLInputElement).value = this.contribuicao.tipoContribuicao.id.toString();
                  }, 250);
                },
                errorResponse => this.contribuicao = new Contribuicao()
              )
            }
          })
        });
  }

  definirIgrejaCadastro() {
    if (this.igrejas.length == 1) {
      this.contribuicao.igreja = new Igreja();
      this.contribuicao.igreja.id = this.igrejas[0].id;
    }
    this.isProcessandoIgreja = false;
  }

  definirTiposContribuicao() {
      this.tiposService.getTiposContribuicao(this.contribuicao.igreja.id)
        .subscribe(tipos => {
          this.tiposContribuicao = tipos;
        })
      this.isProcessandoTipos = false;
  }

  voltarParaListagem() {
    if (this.success) {
      setTimeout(() => {
        this.router.navigate(['/contribuicoes/list']);
      } , 1500);
    } else {
      this.router.navigate(['/contribuicoes/list']);
    }
  }

  onChangeSearch(event: string) {
    this.editando = false;
    this.data = [];
    let usuariosObservable = new Observable<Usuario[]>();
    usuariosObservable = this.usuarioService.getMembrosPorNomeLike(event);
    usuariosObservable.subscribe( response => {
      let usuarios = [];
      usuarios = response;
      let usuariosRes = [];
      for(let i = 0; i < usuarios.length; i++){
        let usuarioRes = new UsuarioResumido();
        usuarioRes.id = usuarios[i].id;
        usuarioRes.nome = usuarios[i].nome;
        usuariosRes.push(usuarioRes);
      }
      this.data = usuariosRes;
    });
  }

  membroSelecionado(event: any) {
    if (!this.contribuicao.membro) {
      this.contribuicao.membro = new Usuario();
    }
    this.contribuicao.membro.id = event.id;
  }

  atribuirIgreja(event: any) {
    if (!this.contribuicao.igreja) {
      this.contribuicao.igreja = new Igreja();
    }
    this.contribuicao.igreja.id = event.target.value;
  }

  atribuirTipoDeContribuicao(event: any) {
    if (!this.contribuicao.tipoContribuicao) {
      this.contribuicao.tipoContribuicao = new TipoContribuicao();
    }
    this.contribuicao.tipoContribuicao.id = event.target.value;
  }

  converterData(event: any) {
    let data = event.day+"-"+event.month+"-"+event.year;
    let parsedDate = moment(data, "DD-MM-YYYY");
    let outputDate = parsedDate.format("DD/MM/YYYY");
    this.contribuicao.dataContribuicao = outputDate;
  }
  

}
