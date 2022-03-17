import { Component, AfterViewInit, ViewChild, ViewContainerRef } from '@angular/core';
import { EventosService } from './services/eventos.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'olah-app';

  @ViewChild(
    'StickyNoteTemplate',
    {
      read: ViewContainerRef
    }
  ) stickyNoteTemplate: ViewContainerRef;


  constructor(private eventosService: EventosService) {
  }

  ngOnInit(): void {
    this.listenOpenStickyNotes();
  }

  private listenOpenStickyNotes(): void {
    this.eventosService.open(() => this.stickyNoteTemplate);
  }

}
