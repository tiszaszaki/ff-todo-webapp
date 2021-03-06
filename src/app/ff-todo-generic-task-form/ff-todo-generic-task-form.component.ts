import { Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subscription } from 'rxjs';
import { FfTodoCommonService } from '../ff-todo-common.service';
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

  @Output() submitEvent = new EventEmitter<void>();
  @Output() submitIdEvent = new EventEmitter<number>();
  @Output() submitDataEvent = new EventEmitter<Task>();

  @Input() preparingFormEvent!: Observable<void>;

  @ViewChild('genericTaskForm') formElement!: ElementRef;

  public modeStr!: String;
  public formId!: String;

  public nameMaxLength!: number;
  public nameMaxLengthListener!: Subscription;

  public inputDateFormat!: string;
  public inputDateFormatDisp!: String;

  public displayDateFormat!: string;

  public formTitle!: String;
  public placeholderName!: String;

  public confirmMessage!: String;
  public submitButtonCaption! : String;
  public confirmButtonCaption! : String;

  public changedDeadline: Boolean = false;

  private preparingFormListener!: Subscription;

  public readonly ADD = TaskOperator.ADD;
  public readonly EDIT = TaskOperator.EDIT;
  public readonly VIEW = TaskOperator.VIEW;
  public readonly REMOVE = TaskOperator.REMOVE;
  public readonly CHECK = TaskOperator.CHECK;
  public readonly REMOVE_ALL = TaskOperator.REMOVE_ALL;

  constructor(
      private modalService: NgbModal,
      private common: FfTodoCommonService) {
  this.inputDateFormat = this.common.inputDateFormat;
  this.inputDateFormatDisp = "No datetime set";
  this.displayDateFormat = this.common.displayDateFormat;
}

  private resetModel() {
    this.model = new Task();
    this.model.name = '';
    this.model.done = false;
  }

  private updateDisplay() {
    this.formTitle = '<Form title to be filled>';
    this.placeholderName = '<Name placeholder to be filled>';

    this.confirmMessage = '<Confirm message to be filled>';
    this.submitButtonCaption = "<Submit>";
    this.confirmButtonCaption = "<Confirm>";

    switch (this.mode)
    {
      case this.ADD: {
        this.formTitle = `Add a new Task for Todo with ID ${this.todoId}`;
        this.placeholderName = "Enter name for new Task...";

        this.submitButtonCaption = "Save";
      } break;
      case this.EDIT: {
        if (this.model)
        {
          let id=this.model.id;
          this.formTitle = `Edit Task with ID ${id}`;
          this.placeholderName = "Change name for this Task...";

          this.submitButtonCaption = "Update";
        }
      } break;
      case this.VIEW: {
        if (this.model)
        {
          let id=this.model.id;
          this.formTitle = `View Task details with ID ${id}`;
          this.placeholderName = "No name defined for this Task.";

          this.submitButtonCaption = "<no submit action>";
        }
      } break;
      case this.REMOVE: {
        if (this.model)
        {
          let id=this.model.id;
          this.formTitle = `Remove Task with ID ${id}`;
          this.confirmMessage = `Are you sure to remove this Task?`;
          this.confirmButtonCaption = 'Remove';
        }
      } break;
      case this.REMOVE_ALL: {
        let id=this.todoId;
        this.formTitle = `Remove all Tasks from Todo with ID ${id}`;
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
    //console.log(`Trying to open a modal with ID (${this.formId})...`);

    const tempModal = this.modalService.open(this.formElement, this.common.getCommonModalSettings("", ""));

    tempModal.result.then((result) => {
      //console.log(`${this.formId}: ${result}`);
      this.submitForm();
    }, (reason) => {
      //console.log(`${this.formId}: ${this.getDismissReason(reason)}`);
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

    this.nameMaxLengthListener = this.common.taskNameMaxLengthChange.subscribe(result => {
      result = this.nameMaxLength = result as number;
    });

    if (this.isOperatorIncluded(this.ADD,this.EDIT,this.VIEW))
    {
      this.common.updateTaskNameMaxLength();
      
      this.inputDateFormatDisp = this.inputDateFormat.toLowerCase();
    }

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
    this.nameMaxLengthListener.unsubscribe();

    this.preparingFormListener.unsubscribe();
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
      setTimeout(() => this.resetModel(), 1000);
    }
  }
}
