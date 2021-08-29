import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FfTodoMockRequestService } from '../ff-todo-mock-request.service';
import { Todo } from '../todo';
import { TodoOperator } from '../todo-operator';

@Component({
  selector: 'app-ff-todo-generic-todo-form',
  templateUrl: './ff-todo-generic-todo-form.component.html',
  styleUrls: ['./ff-todo-generic-todo-form.component.css']
})
export class FfTodoGenericTodoFormComponent implements OnInit, OnChanges{
  @Input() mode!: TodoOperator;

  @Input() data!: Todo;
  @Output() dataChange = new EventEmitter<Todo>();

  @Input() shown!: Boolean;
  @Output() shownChange = new EventEmitter<Boolean>();

  @Input() phase_labels!: String[];
  @Input() descriptionMaxLength!: number;

  @Output() submitEvent = new EventEmitter<void>();
  @Output() submitIdEvent = new EventEmitter<number>();
  @Output() submitDataEvent = new EventEmitter<Todo>();

  model!: Todo;

  formTitle!: String;
  confirmMessage!: String;

  updateModel() {
    if (this.data)
    {
      this.model = this.data;
    }
    else
    {
      this.model = new Todo();
    }
  }

  constructor() {
  }

  ADD = TodoOperator.ADD;
  EDIT = TodoOperator.EDIT;
  REMOVE = TodoOperator.REMOVE;
  REMOVE_ALL = TodoOperator.REMOVE_ALL;

  ngOnInit(): void {
    this.formTitle = '<Form title to be filled>';
    this.confirmMessage = '<Confirm message to be filled>';

    switch (this.mode)
    {
      case this.ADD: {
        this.formTitle = 'Add a new Todo';
      } break;
      case this.EDIT: {
        if (this.data)
        {
          let id=this.data.id;
          this.model = this.data;
          this.formTitle = `Edit Todo with ID ${id}`;
        }
      } break;
      case this.REMOVE: {
        if (this.data)
        {
          let id=this.data.id;
          this.model = this.data;
          this.formTitle = 'Remove Todo with ID ${id}';
        }
      } break;
      case this.REMOVE_ALL: {
        this.formTitle = 'Removing all Todos';
        this.confirmMessage = 'Are you sure to remove all Todos from the board?';
      } break;
      default: { 
        this.formTitle = '';
      } break;
    }
  }

  isOperatorIncluded(...operators : TodoOperator[]) : boolean {
    return (operators.find(op => op == this.mode) !== undefined);
  }

  ngOnChanges(changes: SimpleChanges) {
    this.updateModel();
  }

  dismissForm() {
    this.shown = !this.shown;
  }

  submitForm() {
    if (this.isOperatorIncluded(this.ADD,this.EDIT))
    {
      this.submitDataEvent.emit(this.model);
    }
    if (this.isOperatorIncluded(this.REMOVE))
    {
      this.submitIdEvent.emit(this.model.id);
    }
    if (this.isOperatorIncluded(this.REMOVE_ALL))
    {
      this.submitEvent.emit();
    }
    this.dismissForm();
  }
}
