import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { GruposCongregacionaisService } from 'src/app/services/grupoCongregacional.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { Usuario } from 'src/app/usuarios/usuario';
import { GrupoCongregacional } from '../grupoCongregacional';

@Component({
  selector: 'app-grupos-congregacionais-form',
  templateUrl: './grupos-congregacionais-form.component.html',
  styleUrls: ['./grupos-congregacionais-form.component.css']
})
export class GruposCongregacionaisFormComponent implements OnInit {

  loginUsuarioLogado: string;
  usuarioLogado : Usuario;
  grupoCongregacional : GrupoCongregacional = new GrupoCongregacional();
  success: boolean = false;
  errors: String[];
  id: number;
  acaoCadastrar: boolean;

  constructor(private service : GruposCongregacionaisService,
              private router : Router,
              private activatedRoute : ActivatedRoute,
              private usuarioService: UsuariosService) { }


  ngOnInit(): void {
      let params : Observable<Params> = this.activatedRoute.params;
      params.subscribe( urlParams => {
        this.id = urlParams['id'];
        if (this.id) {
          this.service.getGrupoById(this.id)
          .subscribe(
            response => {
              this.grupoCongregacional = response;
            },            
            errorResponse => this.grupoCongregacional = new GrupoCongregacional()
          )
        }
        this.loginUsuarioLogado = this.usuarioService.getUsuarioAutenticado();
        setTimeout( () => this.definirDadosDoUsuarioLogado(), 500);
    })
  }

  onSubmit() {
    if (this.grupoCongregacional.id && this.grupoCongregacional.id > 0) {
      this.service
      .atualizar(this.grupoCongregacional)
      .subscribe(response => {
        this.success = true;
        this.errors = [];
        this.voltarParaListagem();
      }, errrorResponse => {
        this.errors = ['Ocorreu um erro ao atualizar o Grupo Congregacional!']
      })
    } else {
      this.acaoCadastrar = true;
      this.grupoCongregacional.usuarioCadastro = this.usuarioLogado;
      this.service.salvar(this.grupoCongregacional)
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

  voltarParaListagem() {
    if (this.success) {
      setTimeout(() => {
        this.router.navigate(['/gruposCongregacionais/list/'])
      } , 1500);
    } else {
      this.router.navigate(['/gruposCongregacionais/list/'])
    }
  }

  definirDadosDoUsuarioLogado() {
    this.usuarioService.getUsuarioByCredential(this.loginUsuarioLogado)
      .toPromise().then( response => {
        this.usuarioLogado = response;
      }, errrorResponse => {
        this.errors = ['Ocorreu um erro ao definir dados para cadastro do Grupo Congregacional!']
      })
  }

}
