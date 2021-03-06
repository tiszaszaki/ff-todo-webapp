import { Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subscription } from 'rxjs';
import { Board } from '../board';
import { BoardOperator } from '../board-operator';
import { FfTodoCommonService } from '../ff-todo-common.service';

@Component({
  selector: 'app-ff-todo-generic-board-form',
  templateUrl: './ff-todo-generic-board-form.component.html',
  styleUrls: ['./ff-todo-generic-board-form.component.css']
})
export class FfTodoGenericBoardFormComponent implements OnInit, OnChanges, OnDestroy {
  @Input() mode!: BoardOperator;

  @Input() model!: Board;
  @Output() modelChange = new EventEmitter<Board>();

  @Output() submitEvent = new EventEmitter<void>();
  @Output() submitIdEvent = new EventEmitter<number>();
  @Output() submitDataEvent = new EventEmitter<Board>();

  @Input() preparingFormEvent!: Observable<void>;

  @ViewChild('genericBoardForm') formElement!: ElementRef;

  public modeStr!: String;
  public formId!: String;

  public nameMaxLength!: number;
  public nameMaxLengthListener!: Subscription;

  public descriptionMaxLength!: number;
  public descriptionMaxLengthListener!: Subscription;

  public authorMaxLength!: number;
  public authorMaxLengthListener!: Subscription;

  public inputDateFormat!: string;
  public inputDateFormatDisp!: String;

  public displayDateFormat!: string;

  public formTitle!: String;

  public placeholderName!: String;
  public placeholderDescription!: String;
  public placeholderAuthor!: String;

  public confirmMessage!: String;
  public submitButtonCaption! : String;
  public confirmButtonCaption! : String;

  private preparingFormListener!: Subscription;

  public readonly ADD = BoardOperator.ADD;
  public readonly EDIT = BoardOperator.EDIT;
  public readonly VIEW = BoardOperator.VIEW;
  public readonly REMOVE = BoardOperator.REMOVE;

  constructor(
      private modalService: NgbModal,
      private common: FfTodoCommonService) {
    this.inputDateFormat = this.common.inputDateFormat;
    this.inputDateFormatDisp = "No datetime set";
    this.displayDateFormat = this.common.displayDateFormat;
  }

  private resetModel() {
    this.model = new Board();
    this.model.name = '';
    this.model.description = '';
    this.model.author = '';
  }

  private updateDisplay() {
    this.formTitle = '<Form title to be filled>';

    this.placeholderName = '<Name placeholder to be filled>';
    this.placeholderDescription = '<Description placeholder to be filled>';
    this.placeholderAuthor = '<Author placeholder to be filled>';

    this.confirmMessage = '<Confirm message to be filled>';
    this.submitButtonCaption = "<Submit>";
    this.confirmButtonCaption = "<Confirm>";

    switch (this.mode)
    {
      case this.ADD: {
        this.formTitle = `Add a new Board`;

        this.placeholderName = "Enter name for new Board...";
        this.placeholderDescription = "Enter description for new Board (optional)...";
        this.placeholderAuthor = "Enter author's name for new Board (optional)...";

        this.submitButtonCaption = "Save";
      } break;
      case this.EDIT: {
        if (this.model)
        {
          let id=this.model.id;
          this.formTitle = `Edit Board with ID ${id}`;

          this.placeholderName = "Change name for this Board...";
          this.placeholderDescription = "Change description for this Board...";
          this.placeholderAuthor = "Change author's name for this Board...";

          this.submitButtonCaption = "Update";
        }
      } break;
      case this.VIEW: {
        if (this.model)
        {
          let id=this.model.id;
          this.formTitle = `View Board details with ID ${id}`;
          this.placeholderName = "No name defined for this Board.";
          this.placeholderDescription = "No description defined for this Board.";
          this.placeholderAuthor = "No author defined for this Board.";

          this.submitButtonCaption = "<no submit action>";
        }
      } break;
      case this.REMOVE: {
        if (this.model)
        {
          let id=this.model.id;
          let name=this.model.name;
          this.formTitle = `Remove Board with ID ${id}`;
          this.confirmMessage = `Are you sure to remove this Board (${name})?`;
          this.confirmButtonCaption = 'Remove';
        }
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
    this.modeStr = BoardOperator[this.mode].toLowerCase();
    this.formId = `${this.modeStr}BoardForm`;

    this.nameMaxLengthListener = this.common.boardNameMaxLengthChange.subscribe(result => {
      result = this.nameMaxLength = result as number;
    });

    this.descriptionMaxLengthListener = this.common.boardDescriptionMaxLengthChange.subscribe(result => {
      result = this.descriptionMaxLength = result as number;
    });

    this.authorMaxLengthListener = this.common.boardAuthorMaxLengthChange.subscribe(result => {
      result = this.authorMaxLength = result as number;
    });

    if (this.isOperatorIncluded(this.ADD,this.EDIT))
    {
      this.common.updateBoardNameMaxLength();
      this.common.updateBoardDescriptionMaxLength();
      this.common.updateBoardAuthorMaxLength();
    }

    this.resetModel();

    this.preparingFormListener = this.preparingFormEvent.subscribe(() => this.showModal());
  }

  isOperatorIncluded(...operators : BoardOperator[]) : boolean {
    return (operators.find(op => op == this.mode) !== undefined);
  }

  ngOnChanges(changes: SimpleChanges) {
    this.updateDisplay();
  }

  ngOnDestroy() {
    this.nameMaxLengthListener.unsubscribe();
    this.descriptionMaxLengthListener.unsubscribe();
    this.authorMaxLengthListener.unsubscribe();

    this.preparingFormListener.unsubscribe();
  }

  submitForm(condition?: Boolean) {
    if ((condition === undefined) || condition)
    {
      if (this.isOperatorIncluded(this.ADD,this.EDIT,this.REMOVE))
      {
        this.submitDataEvent.emit(this.model);
      }
      if (this.isOperatorIncluded())
      {
        this.submitEvent.emit();
      }
      setTimeout(() => this.resetModel(), 1000);
    }
  }
}
