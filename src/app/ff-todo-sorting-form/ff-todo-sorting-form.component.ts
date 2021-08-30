import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-ff-todo-sorting-form',
  templateUrl: './ff-todo-sorting-form.component.html',
  styleUrls: ['./ff-todo-sorting-form.component.css']
})
export class FfTodoSortingFormComponent implements OnInit {

  constructor() {
    this.resetTodoSorting();
  }

  todosortfield!: String;
  todosortdir!: Boolean;

  @Output() todosortfieldChange = new EventEmitter<String>();
  @Output() todosortdirChange = new EventEmitter<Boolean>();

  @Input() todo_list_count!: number;

  todoSortingFields = [
    {name: '', display: '(unsorted)'},
    {name: 'name', display: 'Todo name'},
    {name: 'description', display: 'Todo description'},
    {name: 'descriptionLength', display: 'Todo description length'},
    {name: 'taskCount', display: 'Task count in Todo'},
    {name: 'dateCreated', display: 'Date of Todo created'},
    {name: 'dateModified', display: 'Date of Todo updated'}
  ];

  resetTodoSorting() {
    this.todosortfield = '';
    this.todosortdir = false;

    this.todosortfieldChange.emit(this.todosortfield);
    this.todosortdirChange.emit(this.todosortdir);
  }

  ngOnInit(): void {
  }

}
