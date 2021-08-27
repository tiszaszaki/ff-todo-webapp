import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-ff-todo-task-sorting-form',
  templateUrl: './ff-todo-task-sorting-form.component.html',
  styleUrls: ['./ff-todo-task-sorting-form.component.css']
})
export class FfTodoTaskSortingFormComponent implements OnInit {

  constructor() { }

  @Input() task_sorting_field?: string = '';
  @Input() task_sorting_direction?: Boolean = false;

  @Input() task_list_count!: number;

  taskSortingFields = [
    {name: 'name', display: 'Task name'},
    {name: 'done', display: 'Task checked'}
  ];

  resetTaskSorting() {
  }

  ngOnInit(): void {
  }

}
