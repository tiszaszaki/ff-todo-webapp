import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { FfTodoAlertService } from '../ff-todo-alert.service';
import { FfTodoCommonService } from '../ff-todo-common.service';
import { Task } from '../task';
import { Todo } from '../todo';

@Component({
  selector: 'app-ff-todo-list-per-phase',
  templateUrl: './ff-todo-list-per-phase.component.html',
  styleUrls: ['./ff-todo-list-per-phase.component.css']
})
export class FfTodoListPerPhaseComponent implements OnInit, OnDestroy {

  constructor(     
      private common: FfTodoCommonService,
      private alertServ: FfTodoAlertService) { }

  @Input() content! : Todo[];
  @Input() phase_idx!: number;

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

  public todoSearchingCaseSense!: Boolean;
  public todoSearchingCaseSenseListener!: Subscription;
  public todoSearchingHighlight!: Boolean;
  public todoSearchingHighlightListener!: Subscription;

  public todoSearchRules!: Map<String,String>;
  public todoSearchingRulesListener!: Subscription;

  public searchresCount: number = 0;

  notifyTodoSearchResults() {
    this.alertServ.addAlertMessage({type: 'info',
        message: `Searching resulted ${this.searchresCount} Todo(s) in phase '${this.common.getTodoPhaseLabel(this.phase_idx)}'.`});
  }

  ngOnInit(): void {
    this.todoSearchingCaseSenseListener = this.common.todoSearchingCaseSenseChange.subscribe(result => this.todoSearchingCaseSense = result);
    this.todoSearchingHighlightListener = this.common.todoSearchingHighlightChange.subscribe(result => this.todoSearchingHighlight = result);

    this.todoSearchingRulesListener = this.common.todoSearchingRulesChange.subscribe(results => {
      this.todoSearchRules = results;

      this.showDescriptionLength[1] = false;
      this.showDateCreated[1] = false;
      this.showTaskCount[1] = false;

      for (let fieldName of results.keys())
      {
        this.showDescriptionLength[1] ||= (fieldName == 'descriptionLength');
        this.showDateCreated[1] ||= (fieldName == 'dateCreated');
        this.showTaskCount[1] ||= (fieldName == 'taskCount');

        console.log(`updateTodoShowingField(${this.phase_idx}, 'searching'): [${[this.showDescriptionLength[1], this.showDateCreated[1], this.showTaskCount[1]]}]`);
      }

      this.notifyTodoSearchResults();
    });
  }

  ngOnDestroy(): void {
    this.todoSearchingCaseSenseListener.unsubscribe();
    this.todoSearchingHighlightListener.unsubscribe();

    this.todoSearchingRulesListener.unsubscribe();
  }
}
