export interface CalendarStructureOptions {
  sixWeeksPerMonth: boolean,
  weekStartDay: number,
  actualDate: Date,
  languageCode: string,
}

export interface DayObject {
  dayText: string,
  dayNumber: number,
  monthText: string,
  monthNumber: number,
  year: number,
}

const defaultOptions = {
  sixWeeksPerMonth: false,
  weekStartDay: 0,
  actualDate: new Date(),
  languageCode: 'default',
};

/**
   *
   * @param options.sixWeeksPerMonth true/false
   * @param options.weekStartDay 0-6 which day the week starts on
   * @param options.actualDate current date of calendar
   * @param options.languageCode BCP 47 language tag
*/

export default class CalendarStructure {
  private options: CalendarStructureOptions;

  public constructor(opts: CalendarStructureOptions = defaultOptions) {
    this.options = {
      ...opts,
      weekStartDay: (opts.weekStartDay < 7 && opts.weekStartDay >= 0) ? opts.weekStartDay : 0,
    };
  }

  public getWeeksArr() {
    const date = new Date(this.options.actualDate.getTime());
    const monthWeeks: any[] = [];

    date.setDate(1);

    for (let i = 1; i <= 6; i++) {
      monthWeeks.push(this.getDaysArr(date));
      date.setDate(date.getDate() + 7);
    }

    if (!this.options.sixWeeksPerMonth && (monthWeeks[1][0].monthNumber !== monthWeeks[5][0].monthNumber)) {
      monthWeeks.pop();
    }

    return monthWeeks;
  }

  public getDaysArr(date: Date) {
    const weekDate = (date && (date.constructor === new Date().constructor)) ? new Date(date.getTime()) : new Date(this.options.actualDate.getTime());
    const daysToWeekStart = this.daysToWeekStart(weekDate);
    const weekArr: any[] = [];

    weekDate.setHours(24 * daysToWeekStart);
    for (let i = 0; i < 7; i++) {
      weekArr[i] = this.buildDayObj(weekDate);
      weekDate.setHours(+24);
    }
    return weekArr;
  }

  public setOtherDay(diff: number) {
    this.updateDate(diff, 'day');
  }

  public setOtherWeek(diff: number) {
    this.updateDate(diff, 'week');
  }

  public setOtherMonth(diff: number) {
    this.updateDate(diff, 'month');
  }

  public setOtherYear(diff: number) {
    this.updateDate(diff, 'year');
  }

  private daysToWeekStart(weekDate: Date) {
    const diff = this.options.weekStartDay - weekDate.getDay();
    const result = (this.options.weekStartDay > weekDate.getDay()) ? (diff - 7) : diff;
    return result;
  }

  private buildDayObj(date: Date): DayObject {
    return {
      dayText: date.toLocaleDateString(this.options.languageCode, { weekday: 'long' }),
      dayNumber: date.getDate(),
      monthText: date.toLocaleDateString(this.options.languageCode, { month: 'long' }), // self.languageData.months[date.getMonth()],
      monthNumber: date.getMonth(),
      year: date.getFullYear(),
    };
  }

  private updateDate(difference: number = 0, t: 'day' | 'week' | 'month' | 'year'): void {
    const isInt = difference % 1 === 0;
    type test = {
      set: 'setDate' | 'setMonth' | 'setFullYear',
      get: 'getDate' | 'getMonth' | 'getFullYear',
      multiplier: number
    }
    const types: {day: test, week: test, month: test, year: test} = {
      day: {
        set: 'setDate',
        get: 'getDate',
        multiplier: 1,
      },
      week: {
        set: 'setDate',
        get: 'getDate',
        multiplier: 7,
      },
      month: {
        set: 'setMonth',
        get: 'getMonth',
        multiplier: 1,
      },
      year: {
        set: 'setFullYear',
        get: 'getFullYear',
        multiplier: 1,
      },
    };
    const type = types[t] || false;

    if (difference !== 0 && isInt && type) {
      (this.options.actualDate as Date)[type.set](this.options.actualDate[type.get]() + (difference * type.multiplier));
    }
  }
}
