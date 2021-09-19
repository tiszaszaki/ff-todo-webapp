import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subscription } from 'rxjs';
import { FfTodoCommonService } from '../ff-todo-common.service';
import { Todo } from '../todo';
import { TodoOperator } from '../todo-operator';

@Component({
  selector: 'app-ff-todo-generic-todo-form',
  templateUrl: './ff-todo-generic-todo-form.component.html',
  styleUrls: ['./ff-todo-generic-todo-form.component.css']
})
export class FfTodoGenericTodoFormComponent implements OnInit, OnChanges, OnDestroy {
  @Input() mode!: TodoOperator;

  @Input() model!: Todo;
  @Output() modelChange = new EventEmitter<Todo>();

  @Input() descriptionMaxLength!: number;

  @Input() inputDateFormat!: string;

  @Output() submitEvent = new EventEmitter<void>();
  @Output() submitIdEvent = new EventEmitter<number>();
  @Output() submitDataEvent = new EventEmitter<Todo>();

  @Input() preparingFormEvent!: Observable<void>;

  @ViewChild('genericTodoForm') formElement!: TemplateRef<FfTodoGenericTodoFormComponent>;

  public modeStr!: String;
  public formId!: String;

  public inputDateFormatDisp!: String;

  public formTitle!: String;
  public confirmMessage!: String;
  public confirmButtonCaption! : String;

  private preparingFormListener!: Subscription;

  public readonly ADD = TodoOperator.ADD;
  public readonly EDIT = TodoOperator.EDIT;
  public readonly CLONE = TodoOperator.CLONE;
  public readonly SHIFT = TodoOperator.SHIFT;
  public readonly REMOVE = TodoOperator.REMOVE;
  public readonly REMOVE_ALL = TodoOperator.REMOVE_ALL;

  constructor(
      private modalService: NgbModal,
      private common: FfTodoCommonService) { }

  iterateTodoPhases() {
    return this.common.iterateTodoPhases();
  }

  getTodoPhaseLabel(idx: number) {
    return this.common.getTodoPhaseLabel(idx);
  }

  private resetModel() {
    this.model = new Todo();
    this.model.name = '';
    this.model.description = '';
    this.model.phase = 0;
  }

  private updateDisplay() {
    this.formTitle = '<Form title to be filled>';
    this.confirmMessage = '<Confirm message to be filled>';
    this.confirmButtonCaption = "<Confirm>";

    switch (this.mode)
    {
      case this.ADD: {
        this.formTitle = 'Add a new Todo';
      } break;
      case this.EDIT: {
        if (this.model)
        {
          let id=this.model.id;
          this.formTitle = `Edit Todo with ID #${id+1}`;
        }
      } break;
      case this.CLONE: {
        if (this.model)
        {
          let id=this.model.id;
          this.formTitle = `Clone Todo with ID #${id+1}`;
        }
      } break;
      case this.REMOVE: {
        if (this.model)
        {
          let id=this.model.id;
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
    this.modeStr = TodoOperator[this.mode].toLowerCase();
    this.formId = `${this.modeStr}TodoForm`;

    if (this.isOperatorIncluded(this.ADD,this.EDIT))
    {
      this.inputDateFormatDisp = this.inputDateFormat.toLowerCase();
    }

    this.resetModel();

    this.preparingFormListener = this.preparingFormEvent.subscribe(() => this.showModal());
  }

  ngOnDestroy(): void {
    this.preparingFormListener.unsubscribe();
  }

  isOperatorIncluded(...operators : TodoOperator[]) : boolean {
    return (operators.find(op => op == this.mode) !== undefined);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.model)
    if (this.model.deadline)
    {
      console.log(this.model.deadline);
    }

    this.updateDisplay();
  }

  dismissForm() {
    this.resetModel();
  }

  submitForm(condition?: Boolean) {
    if ((condition === undefined) || condition)
    {
      if (this.isOperatorIncluded(this.ADD,this.EDIT,this.CLONE,this.REMOVE))
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
}
