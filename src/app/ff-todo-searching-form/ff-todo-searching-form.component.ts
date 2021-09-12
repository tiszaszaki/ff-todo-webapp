import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subscription } from 'rxjs';
import { SearchingRule } from '../searching-rule';

@Component({
  selector: 'app-ff-todo-searching-form',
  templateUrl: './ff-todo-searching-form.component.html',
  styleUrls: ['./ff-todo-searching-form.component.css']
})
export class FfTodoSearchingFormComponent implements OnInit, OnDestroy {

  @Output() todosearchcaseChange = new EventEmitter<Boolean>();
  @Output() todosearchhighlightChange = new EventEmitter<Boolean>();

  @Output() todosearchruleRemove = new EventEmitter<String>();
  @Output() todosearchruleChange = new EventEmitter<SearchingRule>();
  @Output() todosearchruleReset = new EventEmitter<void>();

  @Output() updateSubmitStateEvent = new EventEmitter<Boolean>();

  @Input() preparingFormEvent!: Observable<void>;
  @Input() resetFormEvent!: Observable<void>;

  @Input() todo_list_count!: number;

  @Input() todosearchcase!: Boolean;
  @Input() todosearchhighlight!: Boolean;

  @Input() todosearchRules!: Map<String,String>;

  @ViewChild('searchTodoForm') formElement!: TemplateRef<FfTodoSearchingFormComponent>;

  public todosearchterm!: String;
  public todosearchfield!: String;

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

  constructor(private modalService: NgbModal) {
    this.resetTodoSearching();
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
    this.todosearchruleRemove.emit(this.todosearchfield);

    this.resetTodoSearchRule();
  }

  updateSubmitState(state: Boolean)
  {
    this.submitted = state;

    if (!state)
    {
      this.resetTodoSearching();
    }

    this.todosearchcaseChange.emit(this.todosearchcase);
    this.todosearchhighlightChange.emit(this.todosearchhighlight);

    this.todosearchruleChange.emit({term: this.todosearchterm, field: this.todosearchfield});

    this.updateSubmitStateEvent.emit(state);
  }

  private resetTodoSearchRule() {
    this.todosearchterm = '';
    this.todosearchfield = '';
  }

  private resetTodoSearching() {
    this.todosearchcase = false;
    this.todosearchhighlight = false;
    this.resetTodoSearchRule();
    this.todosearchruleReset.emit();
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
  }

  ngOnDestroy(): void {
    this.preparingFormListener.unsubscribe();
    this.resetFormListener.unsubscribe();
  }
}
