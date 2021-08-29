import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from "@angular/forms";
import { FfTodoMockRequestService } from '../ff-todo-mock-request.service';
import { Todo } from '../todo';
import { TodoOperator } from '../todo-operator';

@Component({
  selector: 'app-ff-todo-add-todo-form',
  templateUrl: './ff-todo-add-todo-form.component.html',
  styleUrls: ['./ff-todo-add-todo-form.component.css']
})
export class FfTodoAddTodoFormComponent {
  @Input() mode!: TodoOperator;
  @Input() data!: Todo;

  @Input() shown!: Boolean | String;
  @Output() shownChange = new EventEmitter<Boolean>();

  @Input() phase_labels!: String[];
  @Input() descriptionMaxLength!: number;

  validatingForm! : FormGroup;

  model!: Todo;

  formTitle!: String;

  constructor(private todoServ: FfTodoMockRequestService) {
    this.model = new Todo();
  }

  ngOnInit(): void {
    let ADD = TodoOperator.ADD;
    let EDIT = TodoOperator.EDIT;

    this.formTitle = '<Form title to be filled>';

    switch (this.mode)
    {
      case ADD: {
        this.formTitle = 'Add a new Todo';
      } break;
      case EDIT: {
        if (this.data)
        {
          let id=this.data.id;

          this.model = this.data;

          this.formTitle = `Edit Todo with ID ${id}`;
        }
      } break;
      default: { 
        // TODO: throw exception
      } break;
    }
  }

  dismissForm() {
    this.shown = !this.shown;
  }

  addTodo() {
    console.log('Trying to add a new Todo...');
    this.todoServ.addTodo(this.model).subscribe(_ => { this.dismissForm(); });
  }
}
