import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Task } from '../task';
import { TaskOperator } from '../task-operator';

@Component({
  selector: 'app-ff-todo-generic-task-form',
  templateUrl: './ff-todo-generic-task-form.component.html',
  styleUrls: ['./ff-todo-generic-task-form.component.css']
})
export class FfTodoGenericTaskFormComponent implements OnInit, OnChanges {
  @Input() mode!: TaskOperator;

  @Input() data!: Task;
  @Output() dataChange = new EventEmitter<Task>();

  @Input() todoId!: number;

  @Input() shown!: Boolean;
  @Output() shownChange = new EventEmitter<Boolean>();

  @Output() submitEvent = new EventEmitter<void>();
  @Output() submitIdEvent = new EventEmitter<number>();
  @Output() submitDataEvent = new EventEmitter<Task>();

  public model!: Task;

  public formTitle!: String;
  public confirmMessage!: String;
  public confirmButtonCaption! : String;

  public readonly ADD = TaskOperator.ADD;
  public readonly EDIT = TaskOperator.EDIT;
  public readonly REMOVE = TaskOperator.REMOVE;
  public readonly CHECK = TaskOperator.CHECK;
  public readonly REMOVE_ALL = TaskOperator.REMOVE_ALL;

  resetModel() {
    this.model = new Task();
    this.model.name = '';
    this.model.done = false;
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
        this.formTitle = `Add a new Task for Todo with ID #${this.todoId+1}`;
      } break;
      case this.EDIT: {
        if (this.data)
        {
          let id=this.data.id;
          this.formTitle = `Edit Task with ID #${id+1}`;
        }
      } break;
      case this.REMOVE: {
        if (this.data)
        {
          let id=this.data.id;
          this.formTitle = `Remove Task with ID #${id+1}`;
          this.confirmMessage = `Are you sure to remove this Task?`;
          this.confirmButtonCaption = 'Remove';
        }
      } break;
      case this.REMOVE_ALL: {
        let id=this.todoId;
        this.formTitle = `Remove all Tasks from Todo with ID #${id+1}`;
        this.confirmMessage = `Are you sure to remove all Tasks?`;
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

  isOperatorIncluded(...operators : TaskOperator[]) : boolean {
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
    if (this.isOperatorIncluded(this.ADD,this.EDIT,this.CHECK,this.REMOVE))
    {
      this.submitDataEvent.emit(this.model);
    }
    if (this.isOperatorIncluded(this.REMOVE_ALL))
    {
      this.submitIdEvent.emit(this.todoId);
    }
    if (this.isOperatorIncluded())
    {
      this.submitEvent.emit();
    }
    this.dismissForm();
  }
}
