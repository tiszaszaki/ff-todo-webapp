import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { ModalDismissReasons, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subscription } from 'rxjs';
import { FfTodoCommonService } from '../ff-todo-common.service';
import { Todo } from '../todo';
import { Task } from '../task';
import { TodoOperator } from '../todo-operator';
import { FfTodoAbstractRequestService } from '../ff-todo-abstract-request.service';

@Component({
  selector: 'app-ff-todo-generic-todo-form',
  templateUrl: './ff-todo-generic-todo-form.component.html',
  styleUrls: ['./ff-todo-generic-todo-form.component.css']
})
export class FfTodoGenericTodoFormComponent implements OnInit, OnChanges, OnDestroy {
  @Input() mode!: TodoOperator;

  @Input() model!: Todo;
  @Output() modelChange = new EventEmitter<Todo>();

  @Output() submitEvent = new EventEmitter<void>();
  @Output() submitIdEvent = new EventEmitter<number>();
  @Output() submitDataEvent = new EventEmitter<Todo>();

  @Input() preparingFormEvent!: Observable<void>;

  @ViewChild('genericTodoForm') formElement!: TemplateRef<FfTodoGenericTodoFormComponent>;

  public modeStr!: String;
  public formId!: String;

  public taskList!: Task[];

  public deadlineTemp!: NgbDateStruct;

  public nameMaxLength!: number;
  public nameMaxLengthListener!: Subscription;
  public descriptionMaxLength!: number;
  public descriptionMaxLengthListener!: Subscription;

  public inputDateFormat!: string;
  public inputDateFormatDisp!: String;

  public formTitle!: String;

  public placeholderName!: String;
  public placeholderDescription!: String;

  public confirmMessage!: String;
  public submitButtonCaption! : String;
  public confirmButtonCaption! : String;

  public changedDeadline: Boolean = false;

  private preparingFormListener!: Subscription;

  public readonly ADD = TodoOperator.ADD;
  public readonly EDIT = TodoOperator.EDIT;
  public readonly VIEW = TodoOperator.VIEW;
  public readonly CLONE = TodoOperator.CLONE;
  public readonly SHIFT = TodoOperator.SHIFT;
  public readonly REMOVE = TodoOperator.REMOVE;
  public readonly REMOVE_ALL = TodoOperator.REMOVE_ALL;

  constructor(
      private modalService: NgbModal,
      private todoServ: FfTodoAbstractRequestService,
      private common: FfTodoCommonService) {
    this.inputDateFormat = this.common.inputDateFormat;
  }

  iterateBoardList() {
    return this.common.iterateBoardList();
  }

  getBoardName(idx: number) {
    let result=this.common.getBoardName(idx);

    if (this.isOperatorIncluded(this.CLONE))
    if (idx == this.common.getBoardSelected())
      result += " (default)";

    if (this.isOperatorIncluded(this.VIEW))
    if (this.model.boardId)
    if (idx == this.model.boardId)
      result += " (selected)";
  
    return result;
  }

  getBoardTooltip(id: number) {
    return `Board with ID ${id}`;
  }

  iterateTodoPhases() {
    return this.common.iterateTodoPhases();
  }

  getTodoPhaseLabel(idx: number) {
    let result=this.common.getTodoPhaseLabel(idx);

    if (this.isOperatorIncluded(this.VIEW))
    if (idx == this.model.phase)
      result += " (selected)";

    return result;
  }

  getTodoPhaseTooltip(idx: number) {
    return `Phase #${idx + 1}`;
  }

  private resetModel() {
    this.model = new Todo();
    this.model.name = '';
    this.model.description = '';
    this.model.phase = 0;
    if (this.isOperatorIncluded(this.CLONE))
      this.model.boardId = this.common.getBoardSelected() as number;
    if (this.isOperatorIncluded(this.VIEW))
      this.todoServ.getTasksFromTodo(this.model.id).subscribe(tasks => this.taskList = tasks);
  }

  private updateDisplay() {
    this.formTitle = '<Form title to be filled>';

    this.placeholderName = '<Name placeholder to be filled>';
    this.placeholderDescription = '<Description placeholder to be filled>';

    this.confirmMessage = '<Confirm message to be filled>';
    this.submitButtonCaption = "<Submit>";
    this.confirmButtonCaption = "<Confirm>";

    switch (this.mode)
    {
      case this.ADD: {
        this.formTitle = 'Add a new Todo';

        this.placeholderName = "Enter name for new Todo...";
        this.placeholderDescription = "Enter description for new Todo (optional)...";

        this.submitButtonCaption = "Save";
      } break;
      case this.EDIT: {
        if (this.model)
        {
          let id=this.model.id;
          this.formTitle = `Edit Todo with ID ${id}`;

          this.placeholderName = "Change name for this Todo...";
          this.placeholderDescription = "Change description for this Todo...";

          this.submitButtonCaption = "Update";
        }
      } break;
      case this.VIEW: {
        if (this.model)
        {
          let id=this.model.id;
          this.formTitle = `View details of Todo with ID ${id}`;

          this.placeholderName = "No name defined for this Todo.";
          this.placeholderDescription = "No description defined for this Todo.";

          this.submitButtonCaption = "<no submit action>";
        }
      } break;
      case this.CLONE: {
        if (this.model)
        {
          let id=this.model.id;
          this.formTitle = `Clone Todo with ID ${id}`;

          this.placeholderName = "Name for this Todo left blank.";
          this.placeholderDescription = "Description for this Todo left blank.";

          this.submitButtonCaption = "Clone";
        }
      } break;
      case this.REMOVE: {
        if (this.model)
        {
          let id=this.model.id;
          this.formTitle = `Remove Todo with ID ${id}`;
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
    this.modeStr = TodoOperator[this.mode].toLowerCase();
    this.formId = `${this.modeStr}TodoForm`;

    this.nameMaxLengthListener = this.common.todoNameMaxLengthChange.subscribe(result => {
      result = this.nameMaxLength = result as number;
    });

    this.descriptionMaxLengthListener = this.common.todoDescriptionMaxLengthChange.subscribe(result => {
      result = this.descriptionMaxLength = result as number;
    });

    if (this.isOperatorIncluded(this.ADD,this.EDIT))
    {
      this.common.updateTodoNameMaxLength();
      this.common.updateTodoDescriptionMaxLength();
      
      this.inputDateFormatDisp = this.inputDateFormat.toLowerCase();
    }

    if (this.isOperatorIncluded(this.CLONE))
    {
      this.inputDateFormatDisp = "TBD";
    }

    this.resetModel();

    this.preparingFormListener = this.preparingFormEvent.subscribe(() => this.showModal());
  }

  ngOnDestroy(): void {
    this.nameMaxLengthListener.unsubscribe();
    this.descriptionMaxLengthListener.unsubscribe();

    this.preparingFormListener.unsubscribe();
  }

  isOperatorIncluded(...operators : TodoOperator[]) : boolean {
    return (operators.find(op => op == this.mode) !== undefined);
  }

  ngOnChanges(changes: SimpleChanges) {  
    this.updateDisplay();
  }

  submitForm(condition?: Boolean) {
    if ((condition === undefined) || condition)
    {
      if (this.isOperatorIncluded(this.ADD,this.EDIT,this.VIEW,this.CLONE,this.REMOVE))
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
      setTimeout(() => this.resetModel(), 1000);
    }
  }
}
