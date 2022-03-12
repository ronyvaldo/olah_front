import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { GrupoCongregacional } from 'src/app/grupos-congregacionais/grupoCongregacional';
import { Igreja } from 'src/app/igrejas/igreja';
import { TiposContribuicaoService } from 'src/app/services/tiposContribuicao.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { Usuario } from 'src/app/usuarios/usuario';
import { TipoContribuicao } from './tipoContribuicao';

@Component({
  selector: 'app-tipoContribuicao',
  templateUrl: './tipo-contribuicao-form.component.html',
  styleUrls: ['./tipo-contribuicao-form.component.css']
})
export class TipoContribuicaoFormComponent implements OnInit {

  loginUsuarioLogado: string;
  igrejas: Igreja[];
  grupoCongregacional: GrupoCongregacional;
  tipoContribuicao: TipoContribuicao = new TipoContribuicao();
  igrejaSelecionada: Igreja;
  mostrar: boolean = false;
  
  @ViewChild('closeModal', { static: false }) closeModal: ElementRef;
  @ViewChild('exitModal', { static: false }) exitModal: ElementRef;

  @Output() public attEventos: EventEmitter<any> = new EventEmitter<any>();

  constructor(private service : TiposContribuicaoService,
              private usuarioService : UsuariosService) { }

  ngOnInit(): void {
    this.loginUsuarioLogado = this.usuarioService.getUsuarioAutenticado();
    this.definirDadosUsuarioLogado();
  }

  definirDadosUsuarioLogado() {
    let usuarioObservable = new Observable<Usuario>();
    usuarioObservable = this.usuarioService.getUsuarioByCredential(this.loginUsuarioLogado);
    usuarioObservable
      .subscribe(usuario => {
        if (usuario.igrejas.length > 0) {
          this.igrejas = usuario.igrejas;
          if (this.igrejas.length == 1) {
            this.igrejaSelecionada = this.igrejas[0];
          }
        } else if (usuario.grupoCongregacional) {
          this.grupoCongregacional = usuario.grupoCongregacional;
        }
      });
  }

  onSubmit() {
    if (this.grupoCongregacional) {
      this.tipoContribuicao.grupoCongregacional = this.grupoCongregacional;
    } else {
      this.tipoContribuicao.igreja = this.igrejaSelecionada;
    }
    this.service
      .salvar(this.tipoContribuicao)
      .toPromise().then( response => {
        //this.success = true;
        //this.errors = [];
      }, errorResponse => {
        //this.success = false;
        if (errorResponse.error.errors) {
          //this.errors = errorResponse.error.errors;
        } else {
          //this.errors = ['Erro! Verifique se foram preenchidos todos os dados obrigatórios.'];
        }
      })
  }





  toggle() {
    this.mostrar = !this.mostrar;
    alert(this.mostrar);
  }

  abrirTelaCadastrar() {
    alert("teste");
  }

}
