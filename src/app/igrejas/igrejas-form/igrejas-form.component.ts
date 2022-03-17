import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { GrupoCongregacional } from 'src/app/grupos-congregacionais/grupoCongregacional';
import { GruposCongregacionaisService } from 'src/app/services/grupoCongregacional.service';
import { IgrejasService } from 'src/app/services/igrejas.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { Usuario } from 'src/app/usuarios/usuario';
import { Igreja } from '../igreja';

@Component({
  selector: 'app-igrejas-form',
  templateUrl: './igrejas-form.component.html',
  styleUrls: ['./igrejas-form.component.css']
})
export class IgrejasFormComponent implements OnInit {

  loginUsuarioLogado: string;
  igreja : Igreja = new Igreja();
  success: boolean = false;
  errors: String[];
  id: number;
  acaoCadastrar: boolean;
  grupos: GrupoCongregacional[] = [];
  isProcessandoGrupo: boolean = true;
  usuarioLogado : Usuario;
  idGrupoSelecionado : number;

  constructor(private service : IgrejasService,
              private router : Router,
              private activatedRoute : ActivatedRoute,
              private usuarioService: UsuariosService,
              private gruposService : GruposCongregacionaisService) { }

  ngOnInit(): void {
      let params : Observable<Params> = this.activatedRoute.params;
      params.subscribe( urlParams => {
        this.id = urlParams['id'];
        if (this.id) {
          this.service.getIgrejaById(this.id)
          .subscribe(
            response => {
              this.igreja = response;
            },            
            errorResponse => this.igreja = new Igreja()
          )
        }

      this.loginUsuarioLogado = this.usuarioService.getUsuarioAutenticado();
      setTimeout( () => this.definirDadosDoUsuarioLogado(), 500);
    })
  }

  onSubmit() {
    if (this.igreja.id && this.igreja.id > 0) {
      if (!this.igreja.grupoCongregacional || this.igreja.grupoCongregacional.id == 0) {
        this.definirGrupoDaIgreja();
      }
      this.service
      .atualizar(this.igreja)
      .subscribe(response => {
        this.success = true;
        this.errors = [];
        this.voltarParaListagem();
      }, errrorResponse => {
        this.errors = ['Ocorreu um erro ao atualizar Igreja!']
      })
    } else {
      this.acaoCadastrar = true;
      this.definirGrupoDaIgreja();
      this.igreja.usuarioCadastro = this.usuarioLogado;
      this.service.salvar(this.igreja)
      .subscribe( response => {
        this.success = true;
        this.errors = [];
        this.voltarParaListagem();
      }, errorResponse => {
        this.success = false;
        if (errorResponse.error.errors) {
          this.errors = errorResponse.error.errors;
        } else {
          this.errors = [];
          this.errors[0] = errorResponse.error.message;
        }
      })
    }
  }

  definirDadosDoUsuarioLogado() {
    this.usuarioService.getUsuarioByCredential(this.loginUsuarioLogado)
      .toPromise().then( response => {
        this.usuarioLogado = response;
        if (this.usuarioLogado.perfil == 2) {
          this.grupos[0] = this.usuarioLogado.grupoCongregacional;
          this.isProcessandoGrupo = false;
        }
        if (this.usuarioLogado.perfil == 3) {
          this.gruposService.getTodos()
            .toPromise().then( response => {
              this.grupos = response;
              this.isProcessandoGrupo = false;
            })
        }
      }, errrorResponse => {
        this.errors = ['Ocorreu um erro ao definir dados para cadastro de Igreja!']
      })
  }

  voltarParaListagem() {
    if (this.success) {
      setTimeout(() => {
        this.router.navigate(['/igrejas/list/'])
      } , 1500);
    } else {
      this.router.navigate(['/igrejas/list/'])
    }
  }

  atribuirGrupo(event:any) {
    if (event.target && event.target != "") {
      this.idGrupoSelecionado = event.target.value;
    }
  }

  definirGrupoDaIgreja() {
    if (this.grupos.length == 1) {
      this.idGrupoSelecionado = this.grupos[0].id;
    }
    this.igreja.grupoCongregacional = new GrupoCongregacional();
    this.igreja.grupoCongregacional.id = this.idGrupoSelecionado;
  }

}
