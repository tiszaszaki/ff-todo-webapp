import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-ff-todo-sorting-form',
  templateUrl: './ff-todo-sorting-form.component.html',
  styleUrls: ['./ff-todo-sorting-form.component.css']
})
export class FfTodoSortingFormComponent implements OnInit {

  @Output() todosortfieldChange = new EventEmitter<String>();
  @Output() todosortdirChange = new EventEmitter<Boolean>();
  @Output() todosortResetTrigger = new EventEmitter<void>();

  @Input() todo_list_count!: number;

  @Input() todosortfield!: String;
  @Input() todosortdir!: Boolean;

  public readonly todoSortingFields = [
    {name: '', display: '(unsorted)'},
    {name: 'name', display: 'Todo name'},
    {name: 'description', display: 'Todo description'},
    {name: 'descriptionLength', display: 'Todo description length'},
    {name: 'taskCount', display: 'Task count in Todo'},
    {name: 'dateCreated', display: 'Date of Todo created'},
    {name: 'dateModified', display: 'Date of Todo updated'}
  ];

  constructor() {
    this.todosortfield = '';
    this.todosortdir = false;
  }

  resetTodoSorting() {
    this.todosortResetTrigger.emit();
  }

  ngOnInit(): void {
  }

}
