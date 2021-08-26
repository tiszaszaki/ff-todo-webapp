import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ff-todo-list',
  templateUrl: './ff-todo-list.component.html',
  styleUrls: ['./ff-todo-list.component.css']
})
export class FfTodoListComponent implements OnInit {

  constructor() {
    for (let phase of this.phase_labels)
    {
      this.todo_list.push([]);
      this.task_count.push(0);
    }
  }

  todo_list: Array<Array<Object>> = [];
  task_count: Array<Number> = [];

  todo_sorting_field = [];
  todo_sorting_direction = [];

  task_sorting_field = [];
  task_sorting_direction = [];

  todoSortingFields = [
    ['name', 'Todo name'],
    ['description', 'Todo description'],
    ['descriptionLength', 'Todo description length'],
    ['taskCount', 'Task count in Todo'],
    ['dateCreated', 'Date of Todo created'],
    ['dateModified', 'Date of Todo updated']
  ];

  taskSortingFields = [
    ['name', 'Task name'],
    ['done', 'Task checked']
  ];

  phase_labels = ['Backlog', 'In progress', 'Done'];

  readonlyTodo = false;

  ngOnInit(): void {
    this.todo_list[0].push(
      {name:'Sonic'}
    );
  }

}
