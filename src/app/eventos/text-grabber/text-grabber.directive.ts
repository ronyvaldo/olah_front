import {Directive, ElementRef, HostListener, Inject, Renderer2} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {fromEvent} from 'rxjs';
import { EventosService } from 'src/app/services/eventos.service';

@Directive({
  selector: '[appTextGrabber]'
})
export class TextGrabberDirective {

  private static EXISTENCE_TIME = 3000;

  selectedText: string = '';

  constructor(
    private text: ElementRef,
    private renderer2: Renderer2,
    private eventosService : EventosService
  ) {
  }

  @HostListener('click', ['$event']) onSelectStart() {
    this.saveSelectedText();

    const grabberDiv = this.createGrabberDiv();
    this.calculateGrabberPosition(grabberDiv);
    this.addGrabberToText(grabberDiv);
    this.closeGrabber(grabberDiv);
    this.handleOnClickGrabber(grabberDiv);
  }

  private saveSelectedText() {
    this.selectedText = window.getSelection()!.toString();
  }

  private handleOnClickGrabber(grabberDiv: HTMLDivElement) {
    fromEvent(grabberDiv, 'click').pipe().subscribe(
      // @ts-ignore
      (event: MouseEvent) => {
        event.preventDefault();
        event.stopPropagation();
        if (this.selectedText.length !== 0) {
          this.eventosService.initOpenNote(this.selectedText, event);
        }
      }
    );
  }

  private calculateGrabberPosition(grabberDiv: HTMLDivElement) {
    let oRange = window.getSelection()!.getRangeAt(0);
    let oRect = oRange.getBoundingClientRect();
    this.renderer2.setStyle(grabberDiv, 'top', `${oRect.y - 8}px`);
    this.renderer2.setStyle(grabberDiv, 'left', `${oRect.x - 4}px`);
  }

  private addGrabberToText(grabberDiv: HTMLDivElement) {
    this.renderer2.appendChild(this.text.nativeElement, grabberDiv);
  }

  private createGrabberDiv() {
    const grabberDiv: HTMLDivElement = this.renderer2.createElement('div');
    this.renderer2.addClass(grabberDiv, 'grabber');
    return grabberDiv;
  }

  private closeGrabber(grabberDiv: HTMLDivElement) {
    setTimeout(() => {
      this.renderer2.removeChild(this.text.nativeElement, grabberDiv);
    }, TextGrabberDirective.EXISTENCE_TIME);
  }
}
