import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FullCalendarModule } from '@fullcalendar/angular';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { CalendarioComponent } from './calendario.component';
import { CalendarioRoutingModule } from './calendario-routing.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BrowserModule } from '@angular/platform-browser'

@NgModule({
  declarations: [
    CalendarioComponent
  ],
  imports: [
    BrowserModule,
    FullCalendarModule,
    FontAwesomeModule,
    CalendarioRoutingModule
    /*CommonModule,
    FormsModule,
    NgbModule,
    AutocompleteLibModule,
    CalendarioRoutingModule,
    FontAwesomeModule*/
  ]
})
export class CalendarioModule { }
