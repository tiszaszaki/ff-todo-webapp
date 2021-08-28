import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-ff-todo-sorting-form',
  templateUrl: './ff-todo-sorting-form.component.html',
  styleUrls: ['./ff-todo-sorting-form.component.css']
})
export class FfTodoSortingFormComponent implements OnInit {

  constructor() { }

  @Input() todosortfield!: string;
  @Input() todosortdir!: Boolean | string;

  @Output() todosortfieldChange = new EventEmitter<string>();
  @Output() todosortdirChange = new EventEmitter<string>();

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
  }

  ngOnInit(): void {
  }

}
