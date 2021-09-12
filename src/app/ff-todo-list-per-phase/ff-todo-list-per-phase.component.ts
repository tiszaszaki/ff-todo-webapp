import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Task } from '../task';
import { Todo } from '../todo';

@Component({
  selector: 'app-ff-todo-list-per-phase',
  templateUrl: './ff-todo-list-per-phase.component.html',
  styleUrls: ['./ff-todo-list-per-phase.component.css']
})
export class FfTodoListPerPhaseComponent implements OnInit, OnDestroy {

  constructor() { }

  @Input() content! : Todo[];
  @Input() phaseNum!: number;

  @Input() displayDateFormat!: string;

  @Input() todoQuerySuccess!: Boolean;

  @Input() readonlyTodo!: Boolean;
  @Input() readonlyTask!: Boolean;

  @Input() showDescriptionLength!: Boolean[];
  @Input() showTaskCount!: Boolean[];
  @Input() showDateCreated!: Boolean[];

  @Input() todosortfield!: String;
  @Input() todosortdir!: Boolean;
  @Input() todosortexec!: Boolean;

  @Input() tasksortfield!: String;
  @Input() tasksortdir!: Boolean;
  @Input() tasksortexec!: Boolean;

  @Input() todosearchcase!: Boolean;
  @Input() todosearchhighlight!: Boolean;
  @Input() todosearchexec!: Boolean;

  @Input() todosearchRules!: Map<String,String>;

  @Output() editTodoEvent = new EventEmitter<number>();
  @Output() cloneTodoEvent = new EventEmitter<number>();
  @Output() removeTodoEvent = new EventEmitter<number>();

  @Output() shiftLeftTodoEvent = new EventEmitter<Todo>();
  @Output() shiftRightTodoEvent = new EventEmitter<Todo>();

  @Output() addTaskEvent = new EventEmitter<number>();
  @Output() removeAllTasksEvent = new EventEmitter<number>();

  @Output() editTaskEvent = new EventEmitter<Task>();
  @Output() checkTaskEvent = new EventEmitter<Task>();
  @Output() removeTaskEvent = new EventEmitter<Task>();

  @Input() notifySearchResultsIn = new Observable<void>();

  @Output() notifySearchResultsOut = new EventEmitter<Number>();

  private notifySearchResultsListener = new Subscription;

  public searchresCount: number = 0;

  ngOnInit(): void {
    this.notifySearchResultsListener = this.notifySearchResultsIn.subscribe(() => this.notifySearchResultsOut.emit(this.searchresCount));
  }

  ngOnDestroy(): void {
    this.notifySearchResultsListener.unsubscribe();
  }
}
