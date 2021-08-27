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
    ['name', 'Todo name'],
    ['description', 'Todo description'],
    ['descriptionLength', 'Todo description length'],
    ['taskCount', 'Task count in Todo'],
    ['dateCreated', 'Date of Todo created'],
    ['dateModified', 'Date of Todo updated']
  ];

  resetTodoSorting() {
  }

  ngOnInit(): void {
  }

}
