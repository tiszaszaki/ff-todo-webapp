import { Component, OnInit } from '@angular/core';

export interface Task {
  id: number;
  name: String;
  done: Boolean;
};

export interface Todo {
  id: number;
  name: String;
  description: String;
  phase: Number;
  datemodified?: Date;
  datecreated?: Date;
  
  tasks?: Array<Task>; 
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

  updateSortingRelatedOptions(idx : number) {
    
  }

  resetTodoSorting(idx : number) {
    this.todo_sorting_field[idx] = '';
    this.todo_sorting_direction[idx] = false;
  }

  resetTaskSorting(idx : number) {
    this.task_sorting_field[idx] = '';
    this.task_sorting_direction[idx] = false;
  }

  todo_count: number = 0;
  todo_list: Array<Array<Todo>> = [];
  task_count: Array<Number> = [];

  todo_sorting_field: Array<string> = [];
  todo_sorting_direction: Array<Boolean> = [];

  task_sorting_field: Array<string> = [];
  task_sorting_direction: Array<Boolean> = [];

  customDateFormat: string = 'yyyy-MM-dd hh:mm:ss.sss';

  taskSortingFields = [
    ['name', 'Task name'],
    ['done', 'Task checked']
  ];

  phase_labels = ['Backlog', 'In progress', 'Done'];

  readonlyTodo = false;

  addTodo() {
  }

  removeAllTodos() {
  }

  ngOnInit(): void {
    this.todo_list[0].push(
      {id:0, name:'Sonic', description:'Fejlesztése', phase:0},
      {id:1, name:'Munkám', description:'Folyamatban', phase:1}
    );
    for (let todo of this.todo_list[0])
    {
      todo.datecreated = new Date();
      todo.datemodified = new Date();
    }
    this.todo_count += this.todo_list[0].length;
  }

}
