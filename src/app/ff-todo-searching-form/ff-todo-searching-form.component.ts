import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subscription } from 'rxjs';
import { FfTodoCommonService } from '../ff-todo-common.service';

@Component({
  selector: 'app-ff-todo-searching-form',
  templateUrl: './ff-todo-searching-form.component.html',
  styleUrls: ['./ff-todo-searching-form.component.css']
})
export class FfTodoSearchingFormComponent implements OnInit, OnDestroy {

  @Output() updateSubmitStateEvent = new EventEmitter<Boolean>();

  @Input() preparingFormEvent!: Observable<void>;
  @Input() resetFormEvent!: Observable<void>;

  @Input() todo_list_count!: number;

  @ViewChild('searchTodoForm') formElement!: TemplateRef<FfTodoSearchingFormComponent>;

  public todoSearchingCaseSense!: Boolean;
  public todoSearchingCaseSenseListener!: Subscription;
  public todoSearchingHighlight!: Boolean;
  public todoSearchingHighlightListener!: Subscription;

  public todoSearchRules!: Map<String,String>;
  public todoSearchingRulesListener!: Subscription;

  public todosearchterm: String = '';
  public todosearchfield: String = '';

  public submitted: Boolean = false;

  private preparingFormListener!: Subscription;
  private resetFormListener!: Subscription;

  public readonly todoSearchingFields = [
    {name: '', display: '(not searching)'},
    {name: 'id', display: 'Todo ID'},
    {name: 'name', display: 'Todo name'},
    {name: 'description', display: 'Todo description'},
    {name: 'descriptionLength', display: 'Todo description length'},
    {name: 'taskCount', display: 'Task count in Todo'},
    {name: 'dateCreated', display: 'Date of Todo created'},
    {name: 'dateModified', display: 'Date of Todo updated'},
    {name: 'tasks.name', display: 'Task name'},
    {name: 'tasks.done', display: 'Task checked'}
  ];

  constructor(
      private modalService: NgbModal,
      private common: FfTodoCommonService) {
  }

  getTodoSearchingFieldDisplay(field: String): String {
    let result: String='';

    for (let fieldEntry of this.todoSearchingFields)
    {
      if (fieldEntry.name == field)
      {
        result = fieldEntry.display;
        break;
      }
    }

    return result;
  }

  removeTodoSearchRule() {
    this.common.deleteSearchRule(this.todosearchfield);
  }

  updateSubmitState(state: Boolean)
  {
    if (state)
    {
      this.common.addSearchRule(this.todosearchfield, this.todosearchterm);
    }
    else
    {
      this.resetTodoSearching();
    }

    this.common.updateTodoSearchCase(this.todoSearchingCaseSense);
    this.common.updateTodoSearchHighlight(this.todoSearchingHighlight);
  }

  private resetTodoSearchRule() {
    this.todosearchterm = '';
    this.todosearchfield = '';
  }

  private resetTodoSearching() {
    this.todoSearchingCaseSense = false;
    this.todoSearchingHighlight = false;
    this.resetTodoSearchRule();
    this.common.clearSearchRules();
  }

  showModal()
  {
    console.log(`Trying to open a modal with ID (searchTodoForm)...`);

    const tempModal = this.modalService.open(this.formElement);

    tempModal.result.then((result) => {
      console.log(`searchTodoForm: ${result}`);
      this.updateSubmitState(true);
      this.resetTodoSearchRule();
    }, (reason) => {
      console.log(`searchTodoForm: ${this.getDismissReason(reason)}`);
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
    this.preparingFormListener = this.preparingFormEvent.subscribe(() => this.showModal());
    this.resetFormListener = this.resetFormEvent.subscribe(() => this.resetTodoSearching());

    this.todoSearchingCaseSenseListener = this.common.todoSearchingCaseSenseChange.subscribe(result => this.todoSearchingCaseSense = result);
    this.todoSearchingHighlightListener = this.common.todoSearchingHighlightChange.subscribe(result => this.todoSearchingHighlight = result);

    this.todoSearchingRulesListener = this.common.todoSearchingRulesChange.subscribe(results => {
      this.todoSearchRules = results;
      this.resetTodoSearchRule();
    });
  }

  ngOnDestroy(): void {
    this.preparingFormListener.unsubscribe();
    this.resetFormListener.unsubscribe();

    this.todoSearchingCaseSenseListener.unsubscribe();
    this.todoSearchingHighlightListener.unsubscribe();

    this.todoSearchingRulesListener.unsubscribe();
  }
}
