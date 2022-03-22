import { Injectable, ComponentFactoryResolver, ViewContainerRef, ComponentRef } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Evento } from '../eventos/evento';
import { environment } from 'src/environments/environment';
import { PaginaEvento } from '../eventos/PaginaEvento';
import { EventoUsuario } from '../eventos/eventoUsuario';
import { StickyNoteDto } from '../eventos/sticky-note/sticky-note-dto';
import { StickyNoteComponent } from '../eventos/sticky-note/sticky-note.component';

@Injectable({
  providedIn: 'root'
})
export class EventosService {

  private noteSubject = new Subject<StickyNoteDto>();

  apiURL: string = environment.apiUrlBase + "/api/eventos";

  apiUrlUsuario: string = environment.apiUrlBase + "/api/eventoUsuario";

  constructor(private http: HttpClient,
    private componentFactory: ComponentFactoryResolver) { }

  getTodos(): Observable<Evento[]>{
    return this.http.get<any>(this.apiURL);
  }

  getByIgreja(idIgreja: number, page: string, size: string) : Observable<PaginaEvento> {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size);
    return this.http.get<any>(this.apiURL + `/idIgreja=${idIgreja}?${params.toString()}`);
  }

  getEventosUsuario(idUsuario: number, idIgreja: number): Observable<Evento[]>{
    return this.http.get<any>(this.apiURL + `/idUsuario=${idUsuario}?idIgreja=${idIgreja}`);
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

  public open(noteTemplateRef: () => ViewContainerRef): void {
    this.noteSubject.asObservable().subscribe(helpTextData => {
      const stickyNoteComponent = this.createNoteComponent(noteTemplateRef);
      stickyNoteComponent.instance.openNote(helpTextData);
    });
  }

  public initOpenNote(text: string, event: MouseEvent): void {
    this.noteSubject.next({
      content: text,
      coordinates: event
    });
  }

  private createNoteComponent(stickyNotesRef: () => ViewContainerRef): ComponentRef<StickyNoteComponent> {
    const factory = this.componentFactory.resolveComponentFactory(StickyNoteComponent);
    return stickyNotesRef().createComponent(factory);
  }

  ngOnDestroy(): void {
    this.noteSubject.unsubscribe();
  }


}
