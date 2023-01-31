import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class TodoCalendarComponent extends Component {
  @tracked currentDate = this.date;
  @tracked currentMonthNumberOfDays = this.numberDaysInMonth(
    this.currentDate.month,
    this.currentDate.year
  );

  // Get current date as an object
  get date() {
    const DATE = new Date();
    return {
      day: DATE.getDate(),
      month: DATE.getMonth() + 1, // Starts from 0
      year: DATE.getFullYear(),
    };
  }

  // Function to get the days of the week
  get daysOfWeek() {
    return [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
  }

  // Get number of days in a month
  @action
  numberDaysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
  }

  // Get the day of the week from a given date
  @action
  getDayOfTheWeek(date) {
    const DATE = new Date(date.year, date.month - 1, date.day);
    return this.daysOfWeek[DATE.getDay()];
  }

  // ------------------ MAIN FUNCTION TO DISPLAY THE CALENDAR
  /* Get the full calendar as an array of objects, each object contains a week of the calendar. Each week contains every day's information. 
     Weeks start on Monday and finish on Sunday. Initial and final days of the 1st and last week are filled with days from previos/next month*/
  @action
  getCalendar(month, year) {
    const N_DAYS = this.numberDaysInMonth(month, year);
    const DAYS = this.daysOfWeek;
    let calendar = [];

    // Create an object for every day of the current month
    for (let i = 1; i < N_DAYS + 1; i++) {
      const DATE = {
        day: i,
        month: month,
        year: year,
      };
      const DAY = {
        number: i,
        date: `${DATE.day}/${DATE.month}/${DATE.year}`,
        day: this.getDayOfTheWeek(DATE),
        currentMonth: true,
      };
      calendar.push(DAY);
    }

    // Make week 1 start from a Monday (add days of previous month before)
    let keepLoop = true;
    let n_days_previous_month = this.numberDaysInMonth(month - 1, year);

    while (keepLoop) {
      if (calendar[0].day !== 'Monday') {
        const NULL_DAY = {
          number: n_days_previous_month,
          date: null,
          day: DAYS.at(DAYS.indexOf(calendar[0].day) - 1),
          currentMonth: false,
        };
        n_days_previous_month--;
        calendar.unshift(NULL_DAY);
      } else {
        keepLoop = false;
      }
    }

    // Create an array of objects per week
    let weekCalendar = [];
    const N_WEEKS = calendar.reduce((total, current) => {
      return current.day === 'Monday' ? total + 1 : total;
    }, 0);

    for (let i = 0; i < N_WEEKS; i++) {
      const WEEK = {
        week: i,
        days: calendar.splice(0, 7),
      };
      weekCalendar.push(WEEK);
    }

    // Fill last week with empy days until sunday
    keepLoop = true;
    let newDay = 1;
    while (keepLoop) {
      const DAY = weekCalendar.at(-1).days.at(-1).day;
      const NEXT_DAY =
        DAYS.at(DAYS.indexOf(DAY) + 1) !== undefined
          ? DAYS.at(DAYS.indexOf(DAY) + 1)
          : 'Sunday';
      if (DAY !== 'Sunday') {
        const NULL_DAY = {
          number: newDay,
          date: null,
          day: NEXT_DAY,
          currentMonth: false,
        };
        newDay++;
        weekCalendar.at(-1).days.push(NULL_DAY);
      } else {
        keepLoop = false;
      }
    }
    
    return weekCalendar;
  }

  // ---------------------------------- DISPLAYED MONTH CONTROLLER ---------------------
  @tracked displayingMonth = this.monthOfYear[this.currentDate.month - 1];
  @tracked displayingYear = this.currentDate.year;

  // Function to get the months of the year
  get monthOfYear() {
    return [
      { number: 1, text: 'January' },
      { number: 2, text: 'February' },
      { number: 3, text: 'March' },
      { number: 4, text: 'April' },
      { number: 5, text: 'May' },
      { number: 6, text: 'June' },
      { number: 7, text: 'July' },
      { number: 8, text: 'August' },
      { number: 9, text: 'September' },
      { number: 10, text: 'October' },
      { number: 11, text: 'November' },
      { number: 12, text: 'December' },
    ];
  }

  // go to previous month
  @action
  showPreviousMonth() {
    const INDEX_CURRENT_MONTH = this.displayingMonth.number - 1;
    this.displayingMonth =
      INDEX_CURRENT_MONTH - 1 < 0
        ? this.monthOfYear.at(-1)
        : this.monthOfYear[INDEX_CURRENT_MONTH - 1];
    if (INDEX_CURRENT_MONTH - 1 < 0) this.displayingYear--;
  }

  // go to next month
  @action
  showNextMonth() {
    const INDEX_CURRENT_MONTH = this.displayingMonth.number - 1;
    this.displayingMonth =
      INDEX_CURRENT_MONTH + 1 > 11
        ? this.monthOfYear[0]
        : this.monthOfYear[INDEX_CURRENT_MONTH + 1];
    if (INDEX_CURRENT_MONTH + 1 > 11) this.displayingYear++;
  }
}

