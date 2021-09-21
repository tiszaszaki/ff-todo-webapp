import { Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subscription } from 'rxjs';
import { Task } from '../task';
import { TaskOperator } from '../task-operator';

@Component({
  selector: 'app-ff-todo-generic-task-form',
  templateUrl: './ff-todo-generic-task-form.component.html',
  styleUrls: ['./ff-todo-generic-task-form.component.css']
})
export class FfTodoGenericTaskFormComponent implements OnInit, OnChanges, OnDestroy {
  @Input() mode!: TaskOperator;

  @Input() model!: Task;
  @Output() modelChange = new EventEmitter<Task>();

  @Input() todoId!: number;

  @Input() shown!: Boolean;
  @Output() shownChange = new EventEmitter<Boolean>();

  @Output() submitEvent = new EventEmitter<void>();
  @Output() submitIdEvent = new EventEmitter<number>();
  @Output() submitDataEvent = new EventEmitter<Task>();

  @Input() preparingFormEvent!: Observable<void>;

  @ViewChild('genericTaskForm') formElement!: ElementRef;

  public modeStr!: String;
  public formId!: String;

  public formTitle!: String;
  public confirmMessage!: String;
  public confirmButtonCaption! : String;

  private preparingFormListener!: Subscription;

  public readonly ADD = TaskOperator.ADD;
  public readonly EDIT = TaskOperator.EDIT;
  public readonly REMOVE = TaskOperator.REMOVE;
  public readonly CHECK = TaskOperator.CHECK;
  public readonly REMOVE_ALL = TaskOperator.REMOVE_ALL;

  constructor(private modalService: NgbModal) {
  }

  private resetModel() {
    this.model = new Task();
    this.model.name = '';
    this.model.done = false;
  }

  private updateDisplay() {
    this.formTitle = '<Form title to be filled>';
    this.confirmMessage = '<Confirm message to be filled>';
    this.confirmButtonCaption = "<Confirm>";

    switch (this.mode)
    {
      case this.ADD: {
        this.formTitle = `Add a new Task for Todo with ID #${this.todoId+1}`;
      } break;
      case this.EDIT: {
        if (this.model)
        {
          let id=this.model.id;
          this.formTitle = `Edit Task with ID #${id+1}`;
        }
      } break;
      case this.REMOVE: {
        if (this.model)
        {
          let id=this.model.id;
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
        this.confirmMessage = '';
        this.confirmButtonCaption = '';
      } break;
    }
  }

  showModal()
  {
    console.log(`Trying to open a modal with ID (${this.formId})...`);

    const tempModal = this.modalService.open(this.formElement);

    tempModal.result.then((result) => {
      console.log(`${this.formId}: ${result}`);
      this.submitForm();
    }, (reason) => {
      console.log(`${this.formId}: ${this.getDismissReason(reason)}`);
      this.dismissForm();
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'Closed by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'Closed by clicking on a backdrop';
    } else {
      return `${reason}`;
    }
  }

  ngOnInit(): void {
    this.modeStr = TaskOperator[this.mode].toLowerCase();
    this.formId = `${this.modeStr}TaskForm`;
    this.resetModel();

    this.preparingFormListener = this.preparingFormEvent.subscribe(() => this.showModal());
  }

  isOperatorIncluded(...operators : TaskOperator[]) : boolean {
    return (operators.find(op => op == this.mode) !== undefined);
  }

  ngOnChanges(changes: SimpleChanges) {
    this.updateDisplay();
  }

  ngOnDestroy() {
    this.preparingFormListener.unsubscribe();
  }

  dismissForm() {
    this.resetModel();
  }

  submitForm(condition?: Boolean) {
    if ((condition === undefined) || condition)
    {
      if (this.isOperatorIncluded(this.ADD,this.EDIT,this.CHECK,this.REMOVE))
      {
        this.submitDataEvent.emit(this.model);
      }
      if (this.isOperatorIncluded(this.REMOVE_ALL))
      {
        this.submitEvent.emit();
      }
      if (this.isOperatorIncluded())
      {
        this.submitEvent.emit();
      }
      this.dismissForm();
    }
  }
}
