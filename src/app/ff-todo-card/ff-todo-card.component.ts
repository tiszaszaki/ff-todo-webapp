import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Subject, Subscription } from 'rxjs';
import { FfTodoAlertService } from '../ff-todo-alert.service';
import { FfTodoCommonService } from '../ff-todo-common.service';
import { FfTodoRealRequestService } from '../ff-todo-real-request.service';
import { ShiftDirection } from '../shift-direction';
import { Task } from '../task';
import { TaskOperator } from '../task-operator';
import { Todo } from '../todo';
import { TodoOperator } from '../todo-operator';

@Component({
  selector: 'app-ff-todo-card',
  templateUrl: './ff-todo-card.component.html',
  styleUrls: ['./ff-todo-card.component.css']
})
export class FfTodoCardComponent implements OnInit, OnChanges, OnDestroy {

  constructor(
      private highlighter: DomSanitizer,
      private common: FfTodoCommonService,
      private todoServ: FfTodoRealRequestService,
      private alertServ: FfTodoAlertService) {
    this.displayDateFormat = this.common.displayDateFormat;
  }

  @Input() content!: Todo;

  @Input() tasksortfield!: String;
  @Input() tasksortdir!: Boolean;
  @Input() tasksortexec!: Boolean;

  @Input() showDescriptionLength!: Boolean[];
  @Input() showTaskCount!: Boolean[];
  @Input() showDateCreated!: Boolean[];

  @Input() searchresCount!: number;

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

  @Output() searchresCountUpdate = new EventEmitter<number>();

  public todoSelected!: Todo;

  public prepareEditTodoFormTrigger = new Subject<void>();
  public prepareCloneTodoFormTrigger = new Subject<void>(); 
  public prepareRemoveTodoFormTrigger = new Subject<void>();

  public prepareAddTaskFormTrigger = new Subject<void>();
  public prepareRemoveAllTasksFormTrigger = new Subject<void>();

  public phaseMin!: number;
  public phaseMax!: number;
  public todoPhaseValRangeListener!: Subscription;

  public displayDateFormat!: string;

  public todosearchexec!: Boolean;

  public highlightedName!: SafeHtml;
  public highlightedDescription!: SafeHtml;

  public readonlyTodo!: Boolean;
  public readonlyTodoListener!: Subscription;
  public readonlyTask!: Boolean;
  public readonlyTaskListener!: Subscription;

  private oldPhase! : number;

  public isCardValid!: Boolean;

  public phaseLeftExists!: Boolean;
  public phaseRightExists!: Boolean;

  public descriptionLength!: Number;

  public tasklistStr! : String;
  public taskCount!: Number;

  public readonly LEFT = ShiftDirection.LEFT;
  public readonly RIGHT = ShiftDirection.RIGHT;

  public readonly EDIT_TODO = TodoOperator.EDIT;
  public readonly CLONE_TODO = TodoOperator.CLONE;

  public readonly REMOVE_TODO = TodoOperator.REMOVE;

  public readonly ADD_TASK = TaskOperator.ADD;
  public readonly REMOVE_ALL_TASKS = TaskOperator.REMOVE_ALL;

  ngOnInit(): void {
    this.todoPhaseValRangeListener = this.common.todoPhaseValRangeChange.subscribe(results => {
      this.phaseMin = results[0] as number;
      this.phaseMax = results[1] as number;

      this.isCardValid = true;
      this.isCardValid &&= (this.content.name != '');
      this.isCardValid &&= ((this.content.phase >= this.phaseMin) && (this.content.phase <= this.phaseMax));

      this.phaseLeftExists = ((this.content.phase - 1) >= this.phaseMin);
      this.phaseRightExists = ((this.content.phase + 1) <= this.phaseMax);
    });

    this.common.triggerTodoPhaseValRange();

    this.readonlyTodoListener = this.common.readonlyTodoChange.subscribe(result => this.readonlyTodo = result);
    this.readonlyTaskListener = this.common.readonlyTaskChange.subscribe(result => this.readonlyTask = result);

    this.highlightedName = this.highlighter.bypassSecurityTrustHtml(this.content.name as string);
    this.highlightedDescription = this.highlighter.bypassSecurityTrustHtml(this.content.description as string);

    this.descriptionLength = this.content.description.length;

    if (this.content.tasks)
    {
      this.taskCount = this.content.tasks.length;
    }
    else
    {
      this.content.tasks = [];
      this.taskCount = 0;
    }

    this.tasklistStr = JSON.stringify(this.content.tasks);

    if (this.showDescriptionLength.length == 0)
      this.showDescriptionLength.push(false, false);
    if (this.showDescriptionLength.length == 1)
      this.showDescriptionLength.push(false);

    if (this.showDateCreated.length == 0)
      this.showDateCreated.push(false, false);
    if (this.showDateCreated.length == 1)
      this.showDateCreated.push(false);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.searchresCount)
    {
      this.searchresCountUpdate.emit(this.searchresCount);
    }
  }

  ngOnDestroy() {
    this.todoPhaseValRangeListener.unsubscribe();

    this.readonlyTodoListener.unsubscribe();
    this.readonlyTaskListener.unsubscribe();
  }

  prepareEditTodoForm() {
    console.log(`Preparing form for editing Todo...`);
    this.oldPhase = this.content.phase;
    this.todoSelected = this.content;
    this.prepareEditTodoFormTrigger.next();
  }

  prepareCloneTodoForm() {
    console.log(`Preparing form for cloning Todo...`);
    this.oldPhase = this.content.phase;
    this.todoSelected = this.content;
    this.prepareCloneTodoFormTrigger.next();
  }

  prepareRemoveTodoForm() {
    console.log(`Preparing form for removing Todo...`);
    this.todoSelected = this.content;
    this.prepareRemoveTodoFormTrigger.next();
  }

  prepareAddTaskForm() {
    console.log(`Preparing form for editing Task...`);
    this.prepareAddTaskFormTrigger.next();
  }

  prepareRemoveAllTasksForm() {
    let id=this.content.id;
    console.log(`Preparing form for removing all Tasks for Todo with ID (${id})...`);
    this.prepareRemoveAllTasksFormTrigger.next();
  }

  refreshTodo() {
    this.todoServ.getTodo(this.content.id)
    .subscribe(todo => {
      this.content = todo;

      this.common.triggerTodoPhaseValRange();

      this.highlightedName = this.highlighter.bypassSecurityTrustHtml(this.content.name as string);
      this.highlightedDescription = this.highlighter.bypassSecurityTrustHtml(this.content.description as string);

      this.descriptionLength = this.content.description.length;

      if (this.content.tasks)
      {
        this.taskCount = this.content.tasks.length;
      }
      else
      {
        this.content.tasks = [];
        this.taskCount = 0;
      }

      this.tasklistStr = JSON.stringify(this.content.tasks);
    });
  }

  updateTodo(todo : Todo) {
    let id = todo.id;
    console.log(`Trying to update Todo with ID (${id}) to (${JSON.stringify(todo)})...`);
    this.todoServ.editTodo(id, todo)
    .subscribe(_ => {
      this.alertServ.addAlertMessage({type: 'success', message: `Successfully updated Todo with ID (${id}) to (${JSON.stringify(todo)}).`});
      this.common.updateTodoList(new Set([this.oldPhase, todo.phase]));
    }, errorMsg => {
      this.alertServ.addAlertMessage({type: 'danger', message: `Failed to update Todo with ID (${id}). See browser console for details.`});
    });
  }

  cloneTodo(todo : Todo) {
    let id = todo.id;
    let phase = todo.phase;
    console.log(`Trying to clone Todo with ID (${id})...`);
    /*
    this.todoServ.cloneTodo(id, phase as number)
    .subscribe(todo => {
      this.alertServ.addAlertMessage({type: 'success', message: `Successfully cloned Todo with ID (${id}) to (${JSON.stringify(todo)}).`});
      this.getTodos(new Set([this.oldPhase, todo.phase]));
    }, errorMsg => {
      this.alertServ.addAlertMessage({type: 'danger', message: `Failed to clone Todo with ID (${id}). See browser console for details.`});
    });
    */
  }

  removeTodo(todo : Todo) {
    let id = todo.id;
    console.log(`Trying to remove Todo with ID (${id})...`);
    this.todoServ.removeTodo(id)
    .subscribe(_ => {
      this.alertServ.addAlertMessage({type: 'success', message: `Successfully removed Todo with ID (${id}).`});
      this.common.updateTodoList(new Set([todo.phase]));
    }, errorMsg => {
      this.alertServ.addAlertMessage({type: 'danger', message: `Failed to remove Todo with ID (${id}). See browser console for details.`});
    });
  }

  shiftTodo(dir : ShiftDirection) {
    let id = this.content.id;
    this.oldPhase = this.content.phase;
    let new_phase = this.content.phase += dir;
    this.content.phase = new_phase;
    console.log(`Trying to shift Todo with ID (${id})...`);
    if ((new_phase >= this.phaseMin) && (new_phase <= this.phaseMax))
    {
      this.todoServ.editTodo(id, this.content)
      .subscribe(_ => {
        this.alertServ.addAlertMessage({type: 'success', message: `Successfully shifted Todo with ID (${id}) to phase (${new_phase})...`});
        this.common.updateTodoList(new Set([this.oldPhase, new_phase]));
      }, errorMsg => {
        this.alertServ.addAlertMessage({type: 'danger', message: `Failed to shift Todo with ID (${id}). See browser console for details.`});
      });
    }
  }

  addTask(task : Task) {
    console.log(`Trying to add new Task (${JSON.stringify(task)}) for Todo with ID (${this.content.id})...`);
    this.todoServ.addTask(task, this.content.id)
    .subscribe(task => {
      this.todoServ.getTodo(this.content.id)
      .subscribe(todo => { 
        this.alertServ.addAlertMessage({type: 'success', message: `Successfully added new Task (${JSON.stringify(task)}) for Todo with ID (${todo.id}).`});
        this.common.updateTodoList(new Set([todo.phase]));
      });
    }, errorMsg => {
      this.todoServ.getTodo(this.content.id)
      .subscribe(todo => { 
        this.alertServ.addAlertMessage({type: 'danger', message: `Failed to add new Task for Todo with ID (${todo.id}). See browser console for details.`});
      });
    });
  }

  removeAllTasks() {
    this.todoServ.removeAllTasks(this.content.id)
    .subscribe(_ => {
        console.log(`Successfully removed all Tasks from Todo with ID (${(this.content.id)}).`);
        this.todoServ.getTodo(this.content.id)
        .subscribe(todo => {
          this.alertServ.addAlertMessage({type: 'success', message: `Successfully removed all Tasks from Todo with ID (${todo.id}).`});
          this.common.updateTodoList(new Set([todo.phase]));
        });
    }, errorMsg => {
      this.todoServ.getTodo(this.content.id)
      .subscribe(todo => { 
        this.alertServ.addAlertMessage({type: 'danger', message: `Failed to remove all Tasks from Todo with ID (${todo.id}). See browser console for details.`});
      });
    });
  }
}
