import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-ff-todo-searching-form',
  templateUrl: './ff-todo-searching-form.component.html',
  styleUrls: ['./ff-todo-searching-form.component.css']
})
export class FfTodoSearchingFormComponent implements OnInit {

  @Output() todosearchtermChange = new EventEmitter<String>();
  @Output() todosearchfieldChange = new EventEmitter<String>();

  @Output() updateSubmitStateEvent = new EventEmitter<Boolean>();

  @Input() todo_list_count!: number;

  @Input() todosearchterm!: String;
  @Input() todosearchfield!: String;

  public submitted: Boolean = false;

  public readonly todoSearchingFields = [
    {name: '', display: '(not searching)'},
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

    this.todosearchtermChange.emit(this.todosearchterm);
    this.todosearchfieldChange.emit(this.todosearchfield);

    this.updateSubmitStateEvent.emit(state);
  }

  private resetTodoSearching() {
    this.todosearchterm = '';
    this.todosearchfield = '';
  }

  ngOnInit(): void {
  }

}
