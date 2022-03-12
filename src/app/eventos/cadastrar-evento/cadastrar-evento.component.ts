import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter, Input, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Evento } from '../evento';
import { EventosService } from '../../services/eventos.service';
import { faTimesCircle, faSyncAlt } from '@fortawesome/free-solid-svg-icons';
import { faCalendarCheck, faGrinTongueWink } from '@fortawesome/free-regular-svg-icons';
import { Igreja } from 'src/app/igrejas/igreja';

@Component({
  selector: 'app-cadastrar-evento',
  templateUrl: './cadastrar-evento.component.html',
  styleUrls: ['./cadastrar-evento.component.css']
})
export class CadastrarEventoComponent implements OnInit {

  public formCadastroEvento: FormGroup;

  public evento: Evento = new Evento();

  public isSuccesful: boolean = false;
  public changeButton: boolean = false;

  public fasTimesCircle = faTimesCircle;
  public fasSyncAlt = faSyncAlt;
  public farCalendarCheck = faCalendarCheck;
  public farGrinTongueWink = faGrinTongueWink;


  @ViewChild('closeModal', { static: false }) closeModal: ElementRef;
  @ViewChild('exitModal', { static: false }) exitModal: ElementRef;

  @Output() public attEventos: EventEmitter<any> = new EventEmitter<any>();

  @Input() public idEvento: number;

  idIgrejaSelecionada: number;

  constructor(
    private fb: FormBuilder,
    private eventosService: EventosService
  ) {
  }

  ngOnInit(){
    this.formCadastroEvento = this.fb.group({
      nome: [null, [Validators.required]],
      dataInicio: [null, [Validators.required]],
      dataTermino: [null, [Validators.required]],
      horarioInicio: [null, [Validators.required]],
      horarioTermino: [null, [Validators.required]],
    });
  }

  onSubmit() {
    this.changeButton = true;
    this.evento = this.formCadastroEvento.getRawValue();
    if (this.idEvento && this.idEvento > 0) {
      this.evento.id = this.idEvento;
    }
    const inicio = new Date(this.evento.dataInicio).getUTCDate() + "/" + (new Date(this.evento.dataInicio).getUTCMonth() + 1) + "/" + new Date(this.evento.dataInicio).getFullYear();
    const fim = new Date(this.evento.dataTermino).getUTCDate() + "/" + (new Date(this.evento.dataTermino).getUTCMonth() + 1) + "/" + new Date(this.evento.dataTermino).getFullYear();
    this.evento.dataInicio = inicio;
    this.evento.dataTermino = fim;
    if ((this.evento && !this.evento.id) || !this.evento.igreja) {
      this.evento.igreja = new Igreja();
      this.evento.igreja.id = this.idIgrejaSelecionada;
    }
    (this.evento && this.evento.id > 0 ? this.eventosService.atualizar(this.evento) : this.eventosService.salvar(this.evento))
      .subscribe(response => {
        this.formCadastroEvento.reset();
        this.closeModal.nativeElement.hidden = true;
        this.isSuccesful = true;
        setTimeout((response : any) => {
          this.closeModal.nativeElement.click();
          this.attEventos.emit();
          this.closeModal.nativeElement.hidden = false;
          this.isSuccesful = false;
          this.changeButton = false;
        }, 2000)
      },
        error => {
          this.changeButton = false;
          this.formCadastroEvento.reset();
        }
      );
  }

  eventoById(eventoId:any) {
    this.eventosService.getById(eventoId)
      .subscribe(response => {
        this.idEvento = eventoId;
        this.evento = response;
        const anoInicio = this.evento.dataInicio.substring(6);
        const mesInicio = this.evento.dataInicio.substring(3,5);
        const diaInicio = this.evento.dataInicio.substring(0,2);
        const inicioFormatado = anoInicio+'-'+mesInicio+'-'+diaInicio;
        const anoTermino = this.evento.dataTermino.substring(6);
        const mesTermino = this.evento.dataTermino.substring(3,5);
        const diaTermino = this.evento.dataTermino.substring(0,2);
        const terminoFormatado = anoTermino+'-'+mesTermino+'-'+diaTermino;
        this.evento.dataInicio = inicioFormatado;
        this.evento.dataTermino = terminoFormatado;
        this.formCadastroEvento.controls['nome'].setValue(this.evento.nome);
        this.formCadastroEvento.controls['dataInicio'].setValue(this.evento.dataInicio);
        this.formCadastroEvento.controls['dataTermino'].setValue(this.evento.dataTermino);
        this.formCadastroEvento.controls['horarioInicio'].setValue(this.evento.horarioInicio);
        this.formCadastroEvento.controls['horarioTermino'].setValue(this.evento.horarioTermino);
      },
        error => {
          console.log(error.message);
        }
      );
  }

  atribuirIgreja(idIgreja:any) {
    this.idIgrejaSelecionada = idIgreja;
  }
}
