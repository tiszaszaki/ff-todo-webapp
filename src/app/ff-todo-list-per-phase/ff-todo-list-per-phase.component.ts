import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Task } from '../task';
import { Todo } from '../todo';

@Component({
  selector: 'app-ff-todo-list-per-phase',
  templateUrl: './ff-todo-list-per-phase.component.html',
  styleUrls: ['./ff-todo-list-per-phase.component.css']
})
export class FfTodoListPerPhaseComponent implements OnInit {

  constructor() { }

  @Input() content! : Todo[];
  @Input() phaseNum!: number;

  @Input() customDateFormat!: string;

  @Input() readonlyTodo!: Boolean;
  @Input() readonlyTask!: Boolean;

  @Input() todosortfield!: String;
  @Input() todosortdir!: Boolean;

  @Input() tasksortfield!: String;
  @Input() tasksortdir!: Boolean;

  @Input() todosearchexec!: Boolean;
  @Input() todosearchcase!: Boolean;

  @Input() todosearchterm!: String;
  @Input() todosearchfield!: String;

  @Output() editTodoEvent = new EventEmitter<number>();
  @Output() removeTodoEvent = new EventEmitter<number>();

  @Output() shiftLeftTodoEvent = new EventEmitter<Todo>();
  @Output() shiftRightTodoEvent = new EventEmitter<Todo>();

  @Output() addTaskEvent = new EventEmitter<number>();
  @Output() removeAllTasksEvent = new EventEmitter<number>();

  @Output() editTaskEvent = new EventEmitter<Task>();
  @Output() checkTaskEvent = new EventEmitter<Task>();
  @Output() removeTaskEvent = new EventEmitter<Task>();

  ngOnInit(): void {
  }

}
