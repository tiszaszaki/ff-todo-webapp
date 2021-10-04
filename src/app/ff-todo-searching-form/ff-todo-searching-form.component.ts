import { Component, Input, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subscription } from 'rxjs';
import { FfTodoAlertService } from '../ff-todo-alert.service';
import { FfTodoCommonService } from '../ff-todo-common.service';

@Component({
  selector: 'app-ff-todo-searching-form',
  templateUrl: './ff-todo-searching-form.component.html',
  styleUrls: ['./ff-todo-searching-form.component.css']
})
export class FfTodoSearchingFormComponent implements OnInit, OnDestroy {

  @Input() preparingFormEvent!: Observable<void>;
  @Input() resetFormEvent!: Observable<void>;

  @Input() todo_list_count!: number;

  @ViewChild('searchTodoForm') formElement!: TemplateRef<FfTodoSearchingFormComponent>;

  public todoSearchingCaseSense!: Boolean;
  //public todoSearchingCaseSenseListener!: Subscription;
  public todoSearchingHighlight!: Boolean;
  //public todoSearchingHighlightListener!: Subscription;

  public todoSearchRules!: Map<String,String>;
  //public todoSearchingRulesListener!: Subscription;

  public todosearchterm!: String;
  public todosearchfield!: String;

  public submitted!: Boolean;

  public placeholderTerm: String = "What are you searching for?";

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
      private common: FfTodoCommonService,
      private alertServ: FfTodoAlertService) {
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

      this.common.updateTodoSearchCase(this.todoSearchingCaseSense);
      this.common.updateTodoSearchHighlight(this.todoSearchingHighlight);

      this.resetTodoSearchRule();
    }
    else
    {
      this.alertServ.addAlertMessage({type: 'info', message: 'Successfully reseted searching settings.'});
      this.resetTodoSearching();
    }
  }

  private resetTodoSearchRule() {
    this.todosearchterm = '';
    this.todosearchfield = '';
  }

  private resetTodoSearching() {
    this.resetTodoSearchRule();
    this.common.resetTodoSearching();
  }

  showModal()
  {
    //console.log(`Trying to open a modal with ID (searchTodoForm)...`);

    const tempModal = this.modalService.open(this.formElement);

    this.submitted = this.common.hasSearchRules();

    if (this.submitted)
    {
      let temp = this.common.getTodoSearchingSettings();

      this.todoSearchRules = this.common.getTodoSearchingRules();
      this.todoSearchingCaseSense = temp.casesense;
      this.todoSearchingHighlight = temp.highlight;
    }

    tempModal.result.then((result) => {
      //console.log(`searchTodoForm: ${result}`);
    }, (reason) => {
      //console.log(`searchTodoForm: ${this.getDismissReason(reason)}`);
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
    this.resetTodoSearchRule();

    this.todoSearchingCaseSense = false;
    this.todoSearchingHighlight = false;

    this.preparingFormListener = this.preparingFormEvent.subscribe(() => this.showModal());
    this.resetFormListener = this.resetFormEvent.subscribe(() => this.resetTodoSearching());

    /*
    this.todoSearchingCaseSenseListener = this.common.todoSearchingCaseSenseChange.subscribe(result => {
      if (this.modalService.hasOpenModals())
      {
        this.todoSearchingCaseSense = result;
      }
    });
    this.todoSearchingHighlightListener = this.common.todoSearchingHighlightChange.subscribe(result => {
      if (this.modalService.hasOpenModals())
      {
        this.todoSearchingHighlight = result;
      }
    });

    this.todoSearchingRulesListener = this.common.todoSearchingRulesChange.subscribe(results => {
      this.submitted = this.common.hasSearchRules();
      if (this.modalService.hasOpenModals())
      {
        this.todoSearchRules = results;
      }
    });
    */
  }

  ngOnDestroy(): void {
    this.preparingFormListener.unsubscribe();
    this.resetFormListener.unsubscribe();

    /*
    this.todoSearchingCaseSenseListener.unsubscribe();
    this.todoSearchingHighlightListener.unsubscribe();

    this.todoSearchingRulesListener.unsubscribe();
    */
  }
}
