import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-ff-todo-task-sorting-form',
  templateUrl: './ff-todo-task-sorting-form.component.html',
  styleUrls: ['./ff-todo-task-sorting-form.component.css']
})
export class FfTodoTaskSortingFormComponent implements OnInit {

  constructor() {
    this.resetTaskSorting();
  }

  tasksortfield!: String;
  tasksortdir!: Boolean;

  @Output() tasksortfieldChange = new EventEmitter<String>();
  @Output() tasksortdirChange = new EventEmitter<Boolean>();

  @Input() task_list_count!: number;

  taskSortingFields = [
    {name: '', display: '(unsorted)'},
    {name: 'name', display: 'Task name'},
    {name: 'done', display: 'Task checked'}
  ];

  resetTaskSorting() {
    this.tasksortfield = '';
    this.tasksortdir = false;

    this.tasksortfieldChange.emit(this.tasksortfield);
    this.tasksortdirChange.emit(this.tasksortdir);
  }

  ngOnInit(): void {
  }

}
