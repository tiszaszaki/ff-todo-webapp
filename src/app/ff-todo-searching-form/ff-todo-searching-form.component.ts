import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SearchingRule } from '../searching-rule';

@Component({
  selector: 'app-ff-todo-searching-form',
  templateUrl: './ff-todo-searching-form.component.html',
  styleUrls: ['./ff-todo-searching-form.component.css']
})
export class FfTodoSearchingFormComponent implements OnInit {

  @Output() todosearchcaseChange = new EventEmitter<Boolean>();
  @Output() todosearchhighlightChange = new EventEmitter<Boolean>();

  @Output() todosearchruleChange = new EventEmitter<SearchingRule>();

  @Output() updateSubmitStateEvent = new EventEmitter<Boolean>();

  @Input() todo_list_count!: number;

  @Input() todosearchcase!: Boolean;
  @Input() todosearchhighlight!: Boolean;

  @Input() todosearchRules!: Map<String,String>;

  public todosearchterm!: String;
  public todosearchfield!: String;

  public submitted: Boolean = false;

  public readonly todoSearchingFields = [
    {name: '', display: '(not searching)'},
    {name: 'id', display: 'Todo ID'},
    {name: 'name', display: 'Todo name'},
    {name: 'description', display: 'Todo description'},
    {name: 'descriptionLength', display: 'Todo description length'},
    {name: 'taskCount', display: 'Task count in Todo'},
    {name: 'dateCreated', display: 'Date of Todo created'},
    {name: 'dateModified', display: 'Date of Todo updated'}
  ];

  constructor() {
    this.resetTodoSearching();
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

  private resetTodoSearching() {
    this.todosearchcase = false;
    this.todosearchhighlight = false;
    this.todosearchterm = '';
    this.todosearchfield = '';
  }

  ngOnInit(): void {
  }
}
