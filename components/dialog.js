import Component from '@glimmer/component';
import {action} from "@ember/object";
import { tracked } from '@glimmer/tracking';

export default class TodoDialogComponent extends Component {    
    @tracked fullList = [];
    @tracked dialogID;

    // Set dialog ID number
    @action
    dialogIDNumber(id) {
        this.dialogID = id;
    }

    // Close dialog window
    @action
    closeDialog(){        
        document.getElementById("dialog-" + this.dialogID).close();
    }

    // Add an element to the to-do list (element comming from user text input)
    @action
    addToDo(){
        const TEXT_FIELD = document.getElementById("text-input-" + this.dialogID);        
        const TIME = document.getElementById("time-select-" + this.dialogID)?.value;        
        this.fullList = [... this.fullList, `${TIME}: ${TEXT_FIELD.value}`]; // Arrays do not get tracked by push()
        TEXT_FIELD.value = "";   
    }
    
    // Return elements in to-do list, ordered by time
    get toDoList(){                
        return this.fullList.sort();
    }

    // Function to add element to component, when the list contains elements
    get containsToDo(){
        return (this.fullList.length > 0)? true : false;
    }

    // Function to provide the times that are available
    get times(){
        // Get already exisiting to-do list appointments        
        const EXISTING_TODO_TIMES = this.fullList.map(todo => todo.substring(0, 13));
        
        let times = [];
        for (let i = 0; i< 24; i++){
            const START = (i.toString().length === 1)? `0${i}:00` : `${i}:00`;
            const END = ((i+1).toString().length <2)? `0${i+1}:00` : `${i+1}:00`;
            const NEW_TIME = `${START} - ${END}`;
            // Determine whether appoint is available or not
            const AVAILABLE = (EXISTING_TODO_TIMES.find(time => time === NEW_TIME) !== undefined) ? false : true;

            times.push({
                time: NEW_TIME,
                availability: AVAILABLE
            });
        }
        
        return times;
    }

    // Disable the "add" button when text field is empty and no time is selected
    @tracked allowClick = false;    
    @action
    disabledButton(){      
        this.allowClick = 
            (document.getElementById("text-input-" + this.dialogID)?.value === "" ||
             document.getElementById("time-select-" + this.dialogID)?.value === "default") ? false : true;
    }
}
