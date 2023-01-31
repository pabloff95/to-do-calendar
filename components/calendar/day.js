import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class TodoCalendarDayComponent extends Component {
  // Add class to current month days and the other days from other months, with style purpose
  @action
  currenMonthClass(isCurrentMonth) {
    return isCurrentMonth ? 'current-month' : 'not-current-month';
  }
  
  // Function to open the dialog window. Date added so days from other months (not current) will not open additional dialogs
  @action
  showDialog(id, date){
    if (date) document.getElementById("dialog-" + id).showModal();      
  }
}
