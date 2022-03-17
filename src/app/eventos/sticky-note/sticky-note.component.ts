import {Component, TemplateRef, ViewChild, ViewContainerRef} from '@angular/core';
import {TemplatePortal} from '@angular/cdk/portal';
import {ConnectedPosition, Overlay, OverlayRef} from '@angular/cdk/overlay';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
import {StickyNoteDto} from './sticky-note-dto';

@Component({
  selector: 'app-sticky-note',
  templateUrl: './sticky-note.component.html',
  styleUrls: ['./sticky-note.component.css']
})
export class StickyNoteComponent {

  @ViewChild(TemplateRef, {static: true}) dialogTemplate: TemplateRef<any>;
  content: SafeHtml;
  private overlayRef: OverlayRef;

  constructor(
    private overlay: Overlay,
    private viewContainerRef: ViewContainerRef,
    private sanitizer: DomSanitizer
  ) {
  }

  public openNote(stickyNote: StickyNoteDto): void {
    this.content = this.validateHtmlContent(stickyNote.content);

    const portal = new TemplatePortal(this.dialogTemplate, this.viewContainerRef);

    const overlayConfig = {
      positionStrategy: this.overlay
        .position()
        .flexibleConnectedTo(stickyNote.coordinates)
        .withPositions([StickyNoteComponent.leftTopPosition()])
    };
    this.overlayRef = this.overlay.create(overlayConfig);
    this.overlayRef.attach(portal);
  }

  private static leftTopPosition(): ConnectedPosition {
    return {
      originX: 'center',
      originY: 'center',
      overlayX: 'start',
      overlayY: 'top'
    } as ConnectedPosition;
  }

  private validateHtmlContent(content: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(content);
  }
}