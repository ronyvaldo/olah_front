import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Evento } from '../eventos/evento';
import { environment } from 'src/environments/environment';
import { PaginaEvento } from '../eventos/PaginaEvento';
import { EventoUsuario } from '../eventos/eventoUsuario';

@Injectable({
  providedIn: 'root'
})
export class EventosService {

  apiURL: string = environment.apiUrlBase + "/api/eventos";

  apiUrlUsuario: string = environment.apiUrlBase + "/api/eventoUsuario";

  constructor(private http: HttpClient) { }

  getTodos(): Observable<Evento[]>{
    return this.http.get<any>(this.apiURL);
  }

  getByIgreja(idIgreja: number, page: string, size: string) : Observable<PaginaEvento> {
    const params = new HttpParams()
    .set('page', page)
    .set('size', size);
    return this.http.get<any>(this.apiURL + `/idIgreja=${idIgreja}?${params.toString()}`);
  }

  salvar(evento : Evento): Observable<Evento> {
    return this.http.post<Evento>(this.apiURL, evento);
  }

  deletar(evento : Evento): Observable<Evento> {
    return this.http.delete<any>(this.apiURL + `/${evento.id}`);
  }
  
  getById(id: number): Observable<Evento> {
    return this.http.get<any>(this.apiURL + `/${id}`);
  }

  atualizar(evento : Evento): Observable<Evento> {
    return this.http.put<Evento>(this.apiURL + `/${evento.id}`, evento);
  }

  inscrever(eventoUsuario : EventoUsuario): Observable<EventoUsuario> {
    return this.http.post<EventoUsuario>(this.apiUrlUsuario, eventoUsuario);
  }

}
