import { Component, OnInit } from '@angular/core';

export class Todo {
  public id: number;
  public name: String;
  public description: String;
  public phase: Number;
  public datemodified?: Date;
  public datecreated?: Date;

  constructor() {
    this.id = 0;
    this.name = '';
    this.description = '';
    this.phase = 0;
    this.datemodified = new Date();
    this.datecreated = new Date();
  }
};

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

      this.todo_sorting_field.push('');
      this.todo_sorting_direction.push(false);

      this.task_sorting_field.push('');
      this.task_sorting_direction.push(false);
    }
  }

  todo_list: Array<Array<Todo>> = [];
  task_count: Array<Number> = [];

  todo_sorting_field: Array<string> = [];
  todo_sorting_direction: Array<Boolean> = [];

  task_sorting_field: Array<string> = [];
  task_sorting_direction: Array<Boolean> = [];

  customDateFormat: string = 'yyyy-MM-dd hh:mm:ss.sss';

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
      {id:0, name:'Sonic', description:'Fejlesztése', phase:0},
      {id:1, name:'Munkám', description:'Folyamatban', phase:1}
    );
  }

}
