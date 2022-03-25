import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Usuario } from '../usuario';
import { UsuariosService } from '../../services/usuarios.service';
import { Observable } from 'rxjs';
import { Igreja } from 'src/app/igrejas/igreja';
import { IgrejasService } from 'src/app/services/igrejas.service';
import * as moment from 'moment';
import { GrupoCongregacional } from 'src/app/grupos-congregacionais/grupoCongregacional';
import { GruposCongregacionaisService } from 'src/app/services/grupoCongregacional.service';

@Component({
  selector: 'app-usuarios-form',
  templateUrl: './usuarios-form.component.html',
  styleUrls: ['./usuarios-form.component.css']
})
export class UsuariosFormComponent implements OnInit {

  usuario : Usuario;
  loginUsuarioLogado: string;
  success: boolean = false;
  errors: String[];
  id: number;
  perfil: number;
  descricaoPerfil: string;
  acaoCadastrar: boolean;
  idIgrejaSelecionada: number;
  igrejas: Igreja[];
  dataNascimentoTemp: string;
  idade: number;
  nomeGrupoCongregacional: string;
  idGrupoCongregacional: number;
  grupos : GrupoCongregacional[];

  constructor( private service : UsuariosService,
    private igrejasService: IgrejasService,
    private gruposService : GruposCongregacionaisService,
    private router : Router,
    private activatedRoute : ActivatedRoute) { 
    this.usuario = new Usuario();
  }

  ngOnInit(): void {
    this.loginUsuarioLogado = this.service.getUsuarioAutenticado();
    let params : Observable<Params> = this.activatedRoute.params;
    params.subscribe( urlParams => {
      this.id = urlParams['id'];
      this.perfil =  urlParams['perfil'];
      if (this.id) {
        this.service.getUsuarioById(this.id)
        .subscribe(
          response => {
            this.usuario = response;
            this.calcularIdade();
          },            
          errorResponse => this.usuario = new Usuario()
        )
      }
      if (this.perfil) {
        if (this.perfil == 1) {
           this.descricaoPerfil = 'Membro';
        } else if (this.perfil == 2) {
          this.descricaoPerfil = 'Administrador';
        }
      }
    })
    setTimeout(() => this.definirDadosDoUsuarioLogado(), 500);
  }

  definirDadosDoUsuarioLogado() {
    let usuarioObservable = new Observable<Usuario>();
    usuarioObservable = this.service.getUsuarioByCredential(this.loginUsuarioLogado);
    usuarioObservable
      .subscribe(usuario => {
        this.usuario.usuarioCadastro = usuario;
        if (usuario.grupoCongregacional) {
            /*this.nomeGrupoCongregacional = usuario.grupoCongregacional.nome;
            this.idGrupoCongregacional = usuario.grupoCongregacional.id;*/
            this.grupos = [];
            this.grupos.push(usuario.grupoCongregacional);
        } else {
          this.gruposService.getTodos()
              .toPromise().then( response => {
                this.grupos = response;
              })
        }
        if (usuario.igrejas && usuario.igrejas.length > 0) {
          this.igrejas = usuario.igrejas;
        } else {
          if (usuario.perfil == 3) {
            this.igrejasService.getTodas()
              .subscribe( response => this.igrejas = response
              )
          } else {
            this.igrejasService.getIgrejasByGrupoCongregacional(usuario.grupoCongregacional.id)
              .subscribe( response => this.igrejas = response
              )
          }
        }
        });
  }

  onSubmit() {
    if (this.id && this.id > 0) {
      if (this.usuario.igrejas.length == 0) {
        this.definirIgrejaUsuarioCadastro();
      }
      this.service
      .atualizar(this.usuario)
      .subscribe(response => {
        this.success = true;
        this.errors = [];
        this.voltarParaListagem();
      }, errrorResponse => {
        this.errors = ['Ocorreu um erro ao atualizar o usuário!']
      })
    } else {
      this.acaoCadastrar = true;
      this.usuario.perfil = this.perfil;
      if (!this.idIgrejaSelecionada && this.usuario.perfil == 2) {
        this.usuario.grupoCongregacional = new GrupoCongregacional();
        this.usuario.grupoCongregacional.id = this.idGrupoCongregacional;
      } else {
        this.definirIgrejaUsuarioCadastro();
      }
      this.service
        .salvar(this.usuario)
        .subscribe( response => {
          this.success = true;
          this.errors = [];
          this.voltarParaListagem();
        }, errorResponse => {
          this.success = false;
          this.errors = errorResponse.error.errors;
        })
    }
  }

  definirIgrejaUsuarioCadastro() {
    if (this.igrejas.length >= 1) {
      this.idIgrejaSelecionada = this.igrejas[0].id;
    }
    this.usuario.igrejas = new Array<Igreja>();
    this.usuario.igrejas.push(new Igreja());
    this.usuario.igrejas[0].id = this.idIgrejaSelecionada;
  }

  voltarParaListagem() {
    let perfil: number;
    perfil = this.perfil ? this.perfil : this.usuario.perfil;
    if (this.success) {
      setTimeout(() => {
        this.router.navigate(['/usuarios/list/'+ perfil])
      } , 1500);
    } else {
      this.router.navigate(['/usuarios/list/'+ perfil])
    }
  }

  atribuirIgreja(event: any) {
    if (event.target && event.target != "") {
      this.idIgrejaSelecionada = event.target.value;
    }
  }

  atribuirGrupo(event: any) {
    if (event.target && event.target != "") {
      this.idGrupoCongregacional = event.target.value;
      this.idIgrejaSelecionada = 0;
    }
  }

  converterData(event: any) {
    let data = event.day+"-"+event.month+"-"+event.year;
    let parsedDate = moment(data, "DD-MM-YYYY");
    let outputDate = parsedDate.format("DD/MM/YYYY");
    this.usuario.dataNascimento = outputDate;
    this.calcularIdade();
  }

  calcularIdade() {
    if (this.perfil == 1 && this.usuario.dataNascimento) {
      var today = new Date();
      var birthDate = new Date(this.usuario.dataNascimento);
      var age = today.getFullYear() - birthDate.getFullYear();
      var m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          age--;
      }
      this.idade = age;
    }
  }
  
}
