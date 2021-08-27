import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-ff-todo-sorting-form',
  templateUrl: './ff-todo-sorting-form.component.html',
  styleUrls: ['./ff-todo-sorting-form.component.css']
})
export class FfTodoSortingFormComponent implements OnInit {

  constructor() { }

  @Input() todo_sorting_field?: string = '';
  @Input() todo_sorting_direction?: Boolean = false;

  @Input() todo_list_count!: number;

  todoSortingFields = [
    {name: 'name', display: 'Todo name'},
    {name: 'description', display: 'Todo description'},
    {name: 'descriptionLength', display: 'Todo description length'},
    {name: 'taskCount', display: 'Task count in Todo'},
    {name: 'dateCreated', display: 'Date of Todo created'},
    {name: 'dateModified', display: 'Date of Todo updated'}
  ];

  resetTodoSorting() {
  }

  ngOnInit(): void {
  }

}
