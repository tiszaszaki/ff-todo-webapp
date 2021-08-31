import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
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

  public model!: Todo;

  public formTitle!: String;
  public confirmMessage!: String;
  public confirmButtonCaption! : String;

  public readonly ADD = TodoOperator.ADD;
  public readonly EDIT = TodoOperator.EDIT;
  public readonly REMOVE = TodoOperator.REMOVE;
  public readonly REMOVE_ALL = TodoOperator.REMOVE_ALL;

  resetModel() {
    this.model = new Todo();
    this.model.name = '';
    this.model.description = '';
    this.model.phase = NaN;
  }

  updateModel() {
    if (this.data)
    {
      this.model = this.data;
    }
    else
    {
      this.resetModel();
    }
  }

  updateDisplay() {
    this.formTitle = '<Form title to be filled>';
    this.confirmMessage = '<Confirm message to be filled>';
    this.confirmButtonCaption = "<Confirm>";

    switch (this.mode)
    {
      case this.ADD: {
        this.formTitle = 'Add a new Todo';
      } break;
      case this.EDIT: {
        if (this.data)
        {
          let id=this.data.id;
          this.formTitle = `Edit Todo with ID #${id+1}`;
        }
      } break;
      case this.REMOVE: {
        if (this.data)
        {
          let id=this.data.id;
          this.formTitle = `Remove Todo with ID #${id+1}`;
          this.confirmMessage = `Are you sure to remove this Todo?`;
          this.confirmButtonCaption = 'Remove';
        }
      } break;
      case this.REMOVE_ALL: {
        this.formTitle = 'Removing all Todos';
        this.confirmMessage = 'Are you sure to remove all Todos from the board?';
        this.confirmButtonCaption = 'Remove All';
      } break;
      default: { 
        this.formTitle = '';
      } break;
    }
  }

  constructor() {
  }

  ngOnInit(): void {
    this.resetModel();
  }

  isOperatorIncluded(...operators : TodoOperator[]) : boolean {
    return (operators.find(op => op == this.mode) !== undefined);
  }

  ngOnChanges(changes: SimpleChanges) {
    this.updateModel();
    this.updateDisplay();
  }

  dismissForm() {
    this.shown = !this.shown;
    this.shownChange.emit(this.shown);
    this.resetModel();
  }

  submitForm() {
    if (this.isOperatorIncluded(this.ADD,this.EDIT,this.REMOVE))
    {
      this.submitDataEvent.emit(this.model);
    }
    if (this.isOperatorIncluded())
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
