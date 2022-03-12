import { Component, OnInit } from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import { faArrowCircleLeft } from '@fortawesome/free-solid-svg-icons';
import { EventosService } from '../services/eventos.service';
import { Evento } from '../eventos/evento';
import { Router } from '@angular/router';

@Component({
  selector: 'app-calendario',
  templateUrl: './calendario.component.html',
  styleUrls: ['./calendario.component.css']
})
export class CalendarioComponent implements OnInit {

  public calendarPlugins = [dayGridPlugin];

  public fasArrowCircleLeft = faArrowCircleLeft;

  public events: Array<any> = []
  public listaEventos: Evento[];
  public isCharging: boolean = true;
  public dataInicioFormatada: Array<any> = []
  public dataTerminoFormatada: Array<any> = []

  constructor(
    private eventosService: EventosService,
    private route: Router
    ) { }

  ngOnInit() {
   this.listarEventosCalendario();
  }

  listarEventosCalendario() {
    this.eventosService.getTodos()
      .subscribe(res => {
        this.listaEventos = res;
        for (let i = 0; i < this.listaEventos.length; i++) {
          const anoInicio = this.listaEventos[i].dataInicio.substring(6);
          const mesInicio = this.listaEventos[i].dataInicio.substring(3, 5);
          const diaInicio = this.listaEventos[i].dataInicio.substring(0, 2);
          this.dataInicioFormatada[i] = anoInicio + '-' + mesInicio + '-' + diaInicio;
          const anoTermino = this.listaEventos[i].dataTermino.substring(6);
          const mesTermino = this.listaEventos[i].dataTermino.substring(3, 5);
          const diaTermino = this.listaEventos[i].dataTermino.substring(0, 2);
          this.dataTerminoFormatada[i] = anoTermino + '-' + mesTermino + '-' + diaTermino;

          this.events = this.events.concat({
            title: this.listaEventos[i].nome.toUpperCase(),
            start:
              this.dataInicioFormatada[i] + 'T' + this.listaEventos[i].horarioInicio,
            end: this.dataTerminoFormatada[i] + 'T' + this.listaEventos[i].horarioTermino
          })
        }
        this.isCharging = this.listaEventos.length < 0;
      }, (err => {
        alert('Não foi possível renderizar o calendário, por favor, tente novamente mais tarde!');
        this.route.navigate(['agendamentos']);
      })
      )
  }

}
