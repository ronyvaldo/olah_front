import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { Observable } from 'rxjs';
import { GrupoCongregacional } from 'src/app/grupos-congregacionais/grupoCongregacional';
import { Igreja } from 'src/app/igrejas/igreja';
import { TiposDespesasService } from 'src/app/services/tiposDespesas.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { Usuario } from 'src/app/usuarios/usuario';
import { TipoDespesa } from './tipoDespesa';

@Component({
  selector: 'app-tipoDespesa',
  templateUrl: './tipo-despesa-form.component.html',
  styleUrls: ['./tipo-despesa-form.component.css']
})
export class TipoDespesaFormComponent implements OnInit {

  loginUsuarioLogado: string;
  igrejas: Igreja[];
  grupoCongregacional: GrupoCongregacional;
  tipoDespesa: TipoDespesa = new TipoDespesa();
  igrejaSelecionada: Igreja;
  mostrar: boolean = false;
  success: boolean = false;
  erro: boolean = false;
  mensagemErro: string;
  
  @ViewChild('closeModal', { static: false }) closeModal: ElementRef;
  @ViewChild('exitModal', { static: false }) exitModal: ElementRef;

  @Output() public attEventos: EventEmitter<any> = new EventEmitter<any>();

  public fasTimesCircle = faTimesCircle;

  constructor(private service : TiposDespesasService,
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
          if (this.igrejas.length >= 1) {
            this.igrejaSelecionada = this.igrejas[0];
          }
        } else if (usuario.grupoCongregacional) {
          this.grupoCongregacional = usuario.grupoCongregacional;
        }
      });
  }

  onSubmit() {
    if (this.grupoCongregacional) {
      this.tipoDespesa.grupoCongregacional = this.grupoCongregacional;
    } else {
      this.tipoDespesa.igreja = this.igrejaSelecionada;
    }
    this.service
      .salvar(this.tipoDespesa)
      .toPromise().then( response => {
        this.success = true;
        this.erro = false;
        this.mensagemErro = '';
        this.tipoDespesa = new TipoDespesa();
        setTimeout(() => this.close(), 1200);
      }, errorResponse => {
        this.erro = true;
        this.success = false;
        this.mensagemErro = errorResponse.error.message;
      })
  }

  close() {
    $(document).ready(function() {
      $("#closeModal").trigger('click');
    })
    this.success = false;
    this.erro = false;
  }

  cadastroLiberado() {
    return this.tipoDespesa.nome && this.tipoDespesa.nome.trim() != '';
  }

  limparDados() {
    this.success = false;
    this.erro = false;
    this.mensagemErro = '';
    this.tipoDespesa.nome = '';
  }

}
