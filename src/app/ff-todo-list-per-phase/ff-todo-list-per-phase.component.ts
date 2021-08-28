import { Component, Input, OnInit } from '@angular/core';
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

  @Input() readonlyTodo!: Boolean;
  @Input() readonlyTask!: Boolean;

  @Input() todosortfield!: string;
  @Input() todosortdir!: Boolean;

  @Input() tasksortfield!: string;
  @Input() tasksortdir!: Boolean;

  ngOnInit(): void {
  }

}
