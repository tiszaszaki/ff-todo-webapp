import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-ff-todo-task-sorting-form',
  templateUrl: './ff-todo-task-sorting-form.component.html',
  styleUrls: ['./ff-todo-task-sorting-form.component.css']
})
export class FfTodoTaskSortingFormComponent implements OnInit {

  @Output() tasksortfieldChange = new EventEmitter<String>();
  @Output() tasksortdirChange = new EventEmitter<Boolean>();
  @Output() tasksortResetTrigger = new EventEmitter<void>();

  @Input() task_list_count!: number;

  @Input() tasksortfield!: String;
  @Input() tasksortdir!: Boolean;

  public readonly taskSortingFields = [
    {name: '', display: '(unsorted)'},
    {name: 'name', display: 'Task name'},
    {name: 'done', display: 'Task checked'}
  ];

  constructor() {
    this.tasksortfield = '';
    this.tasksortdir = false;
  }

  resetTaskSorting() {
    this.tasksortResetTrigger.emit();
  }

  ngOnInit(): void {
  }

}
