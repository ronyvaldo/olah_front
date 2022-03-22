import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { EventosService } from '../services/eventos.service';
import { Evento } from './evento';
import { faCalendarPlus, faCalendarTimes, faEdit, faFrown } from '@fortawesome/free-regular-svg-icons';
import { faCalendarDay } from '@fortawesome/free-solid-svg-icons';
import { Usuario } from '../usuarios/usuario';
import { UsuariosService } from '../services/usuarios.service';
import { Igreja } from '../igrejas/igreja';
import { IgrejasService } from '../services/igrejas.service';
import { EventoUsuario } from './eventoUsuario';
import { HtmlParser } from '@angular/compiler';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.css']
})
export class EventosComponent implements OnInit {

  
  public isEmpty: boolean = true;
  
  public p: number = 1;
  
  public idEvento: number;
  
  public farCalendarPlus = faCalendarPlus;
  public farCalendarTimes = faCalendarTimes;
  public farEdit = faEdit;
  public fasCalendarDay = faCalendarDay;
  public farFrown = faFrown;
  
  usuarioLogado: Usuario;
  idIgrejaSelecionada: number;
  igrejas: Igreja[];
  isProcessandoIgreja: boolean = true;
  loginUsuarioLogado: string;
  listaEventos: Evento[];
  totalElementos = 0;
  paginaAtual: number = 0;
  tamanho = 10;
  paginas: number[];
  ultimaPagina: number;
  mensagemSucesso : String;
  mensagemErro : String;
  eventoSelecionado: Evento;
  perfilAdministrativo: boolean;
  errors: String[];

  @ViewChild('excluirComponent', { static: false }) excluirComponent: any;

  @ViewChild('alterarComponent', { static: false }) alterarComponent: any;

  constructor(private eventosService: EventosService,
      private usuarioService : UsuariosService,
      private igrejasService: IgrejasService,
      private elementRef:ElementRef) { }
   
  ngOnInit() {
    this.loginUsuarioLogado = this.usuarioService.getUsuarioAutenticado();
    this.definirDadosDoUsuario();
    setTimeout(() => this.definirIgrejaSelecionada(), 800);
    this.errors = [];
  }
  
  listarEventos() {
    this.eventosService.getByIgreja(this.idIgrejaSelecionada, this.paginaAtual.toString(), this.tamanho.toString())
      .subscribe(response => {
        this.listaEventos = response.content;
        this.totalElementos = response.totalElements;
        this.paginaAtual = response.number;
        this.isEmpty = this.listaEventos.length < 1;
        this.definirPaginas();
      },
        error => {
          console.log(error.message);
        }
      );
  }

  criarEventosUsuarioDinamicamente() {
    if (!this.perfilAdministrativo) {
      $(document).ready(() => {
        var divPai = $('#divUsuario');
        
        for (let i = 0; i < this.listaEventos.length; i++) {
          var novaDiv = '';
          let evento = this.listaEventos[i].nome;
          let idEvento = this.listaEventos[i].id;
          let dataInicio = this.listaEventos[i].dataInicio;
          let dataTermino = this.listaEventos[i].dataTermino;
          let horarioInicio = this.listaEventos[i].horarioInicio;
          let horarioTermino = this.listaEventos[i].horarioTermino;
          let textoHora = (dataInicio == dataTermino || !dataTermino || dataTermino == '') ?
                      "<br/><br/> Dia "+dataInicio + " das "+horarioInicio+ " às "+horarioTermino
                      : " <br/><br/>Início: "+dataInicio+" às "+horarioInicio+"<br/> Término: "+dataTermino+" às "+horarioTermino;
          let buttonId = "button"+idEvento;

          novaDiv+='<div class="col-xl-3 col-md-5" style="margin: 1em;"> ';
          novaDiv+='<div class="card '+ this.getBgDinamicamente(i) +' text-white mb-4"> ';
          novaDiv+='<div class="card-body"><b><font color="black" font-weight: bold;>'+evento+'</font></b>'+textoHora+'</div> ';
          novaDiv+='<div class="card-footer d-flex align-items-center justify-content-between"> ';
          novaDiv+='<div class="button-container"> ';
          if (!this.listaEventos[i].usuarioInscrito) {
            novaDiv+='<button id="'+ buttonId +'" type="submit" mat-mini-fab color="primary" title="Inscrever-se neste evento" style="border:none;"> ';
            novaDiv+='Inscrever-se</button>';
          } else {
            //novaDiv+='<p style="border-width: 2px; border-style: dashed; border-color: #f00; size: 20em">';
            novaDiv+='<span class="material-icons" font-size="30px" style="color: black;">';
            novaDiv+='done</span>&nbsp;<u>Inscrito</u>';
          }
          novaDiv+='</div></div></div></div>';

          divPai.append(novaDiv);
          if (!this.listaEventos[i].usuarioInscrito) {
            this.elementRef.nativeElement.querySelector("#"+buttonId)
              .addEventListener('click', () => this.inscrever(idEvento));
          }
        }
      })
    }
  }

  getBgDinamicamente(i : number) {
      let arr = ['bg-info','bg-primary','bg-warning','bg-danger','bg-success'];
      if (i > 5 && i < 11) {
        i = i - 5;
      } else if (i > 10) {
        i = Math.ceil(i % 5);
      }
      /*if (i > 1) {
        i = i-1;
      }*/
      return arr[i];
  }

  excluirEventos(){
    this.excluirComponent.eventoById(this.idEvento);
  }

  alterarEventos(){
    this.alterarComponent.eventoById(this.idEvento);
  }

  handlePageSizeChange(event: any): void {
    this.tamanho = event.target.value;
    this.listarEventos();
  }

  handlePageChange(page: number): void {
    this.paginaAtual = page;
    this.listarEventos();
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

  definirDadosDoUsuario() {
    this.usuarioService.getUsuarioByCredential(this.loginUsuarioLogado)
      .toPromise().then(usuario => {
        this.usuarioLogado = usuario;
        if (usuario.perfil == 2 || usuario.perfil == 3) {
          this.perfilAdministrativo = true;
        } else {
          this.perfilAdministrativo = false;
        }
        if (usuario.igrejas.length > 0) {
          this.igrejas = usuario.igrejas;
        } else {
          this.igrejasService.getIgrejasByGrupoCongregacional(usuario.grupoCongregacional.id)
            .toPromise().then(response => {
              this.igrejas = response;
              if (this.igrejas.length == 1) {
                this.idIgrejaSelecionada = this.igrejas[0].id;
              }
            });
          }
        });
    this.isProcessandoIgreja = false;
  }

  definirIgrejaSelecionada() {
    if (!this.perfilAdministrativo && this.usuarioLogado.igrejas) {
      this.idIgrejaSelecionada = this.usuarioLogado.igrejas[0].id;
      this.eventosService.getEventosUsuario(this.usuarioLogado.id, this.idIgrejaSelecionada)
        .subscribe(response => {
            this.listaEventos = response;
        });
      setTimeout(() => this.criarEventosUsuarioDinamicamente(), 500);
    } else {
      this.alterarComponent.atribuirIgreja(this.idIgrejaSelecionada);
      this.listarEventos();
    }
  }

  preparar(evento : Evento) {
    this.eventoSelecionado = evento;
  }

  deletarEvento() {
    this.eventosService
    .deletar(this.eventoSelecionado)
    .subscribe(
      response => {
        this.mensagemSucesso = `Evento ${this.eventoSelecionado.nome} excluído com sucesso.`
        this.ngOnInit();
      },
      erro => this.mensagemErro = `Ocorreu um erro ao excluir o evento ${this.eventoSelecionado.nome}.`
    )
  }

  inscrever(id: any) {
    const eventoUsuario = new EventoUsuario();
    eventoUsuario.evento = new Evento();
    eventoUsuario.evento.id = id;
    eventoUsuario.usuario = this.usuarioLogado;
    this.eventosService.inscrever(eventoUsuario)
      .subscribe(
        response => {
          let buttonId = "button"+id;
          $("#"+buttonId).replaceWith('<span class="material-icons" font-size="30px" style="color: black;">'+
                      'done</span>&nbsp;<u>Inscrito</u>');
        }, errorResponse => {
          console.log(errorResponse.error);
          this.errors = errorResponse.error.errors;
        });
  }
  

}
