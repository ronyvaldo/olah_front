import { TranslationWidth } from '@angular/common';
import { Injectable } from '@angular/core';
import { NgbDatepickerI18n, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

const I18N_VALUES = {
  'pt-BR': {
    weekdays: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
    months: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
  }
};

@Injectable()
export class I18n {
  language = 'pt-BR';
}

// Define custom service providing the months and weekdays translations
@Injectable()
export class CustomDatepickerI18n extends NgbDatepickerI18n {
    getMonthShortName(month: number, year?: number): string {
        throw new Error('Method not implemented.');
    }
  
 getWeekdayLabel(weekday: number, width?: TranslationWidth): string {
      throw new Error('Method not implemented.');
  }
  getDayAriaLabel(date: NgbDateStruct): string {
      throw new Error('Method not implemented.');
  }

  constructor(private _i18n: I18n) {
    super();
  }

  /*getWeekdayShortName(weekday: number): string {
    return I18N_VALUES[this._i18n.language].weekdays[weekday - 1];
  }
  getMonthShortName(month: number): string {
    return I18N_VALUES[this._i18n.language].months[month - 1];
  }*/
  getMonthFullName(month: number): string {
    return this.getMonthShortName(month);
  }
}