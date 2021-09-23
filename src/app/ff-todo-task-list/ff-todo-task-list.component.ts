import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Subject, Subscription } from 'rxjs';
import { FfTodoAlertService } from '../ff-todo-alert.service';
import { FfTodoCommonService } from '../ff-todo-common.service';
import { FfTodoRealRequestService } from '../ff-todo-real-request.service';
import { Task } from '../task';
import { TaskOperator } from '../task-operator';

@Component({
  selector: 'app-ff-todo-task-list',
  templateUrl: './ff-todo-task-list.component.html',
  styleUrls: ['./ff-todo-task-list.component.css']
})
export class FfTodoTaskListComponent implements OnInit, OnDestroy {

  constructor(
      private highlighter: DomSanitizer,
      private common: FfTodoCommonService,
      private todoServ: FfTodoRealRequestService,
      private alertServ: FfTodoAlertService) { }

  @Input() todoId!: number;
  @Input() phase_idx!: number;

  @Input('tasks') tasklistString! : String;

  public prepareEditTaskFormTrigger = new Subject<void>();
  public prepareRemoveTaskFormTrigger = new Subject<void>();

  public tasksortfield!: String;
  public tasksortdir!: Boolean;
  public tasksortexec!: Boolean;
  public taskSortingSettingsListener!: Subscription;

  public showTaskCount!: Boolean[];

  public taskSelected!: Task;

  public taskCount!: Number;

  public readonlyTask!: Boolean;
  public readonlyTaskListener!: Subscription;

  public highlightedNames = new Map<Number,SafeHtml>();

  public tasks! : Task[];

  public tasklist_collapse_status: boolean = true;

  public readonly EDIT_TASK = TaskOperator.EDIT;
  public readonly REMOVE_TASK = TaskOperator.REMOVE;

  ngOnInit(): void {
    this.readonlyTaskListener = this.common.readonlyTaskChange.subscribe(result => this.readonlyTask = result);

    this.taskSortingSettingsListener = this.common.taskSortingSettingsChange.subscribe(result => {
      this.tasksortexec = result.exec;
      this.tasksortfield = result.field;
      this.tasksortdir = result.dir;
    });

    this.tasks = JSON.parse(this.tasklistString as string);

    this.taskCount = this.tasks.length;

    for (let task of this.tasks)
    {
      this.highlightedNames.set(task.id, this.highlighter.bypassSecurityTrustHtml(task.name as string));
    }

    if (!this.showTaskCount)
      this.showTaskCount = [];

    if (this.showTaskCount.length == 0)
      this.showTaskCount.push(false, false);
    if (this.showTaskCount.length == 1)
      this.showTaskCount.push(false);
  }

  ngOnDestroy(): void {
    this.readonlyTaskListener.unsubscribe();

    this.taskSortingSettingsListener.unsubscribe();
  }

  prepareEditTaskForm(task : Task) {
    this.taskSelected = task;
    this.prepareEditTaskFormTrigger.next();
  }

  prepareRemoveTaskForm(task : Task) {
    this.taskSelected = task;
    this.prepareRemoveTaskFormTrigger.next();
  }

  updateTask(patchedTask : Task) {
    let id = patchedTask.id;
    console.log(`Trying to update Task with ID (${id}) to (${JSON.stringify(patchedTask)}) for Todo with ID (${this.todoId})...`);
    this.todoServ.editTask(patchedTask)
    .subscribe(_=> {
      this.alertServ.addAlertMessage({type: 'success', message: `Successfully updated Task with ID (${id}) to (${JSON.stringify(patchedTask)}) for Todo with ID (${this.todoId}).`});
      this.todoServ.getTodo(this.todoId)
      .subscribe(todo => { 
        this.common.updateTodoList(new Set([todo.phase]));
      });
    }, errorMsg => {
      this.alertServ.addAlertMessage({type: 'danger', message: `Failed to update Task with ID (${id}). See browser console for details.`});
    });
  }

  checkTask(task : Task) {
    let id = task.id;
    console.log(`Trying to check Task with ID (${id}) for Todo with ID (${this.todoId})...`);
    this.todoServ.checkTask(id)
    .subscribe(_=> {
      this.alertServ.addAlertMessage({type: 'success', message: `Successfully checked Task with ID (${id}) for Todo with ID (${this.todoId}).`});
      this.todoServ.getTodo(this.todoId)
      .subscribe(todo => { 
        this.common.updateTodoList(new Set([todo.phase]));
      });
    }, errorMsg => {
      this.alertServ.addAlertMessage({type: 'danger', message: `Failed to check Task with ID (${id}). See browser console for details.`});
    });
  }

  removeTask(task : Task) {
    let id = task.id;
    console.log(`Trying to remove Task with ID (${id}) for Todo with ID (${this.todoId}})...`);
    this.todoServ.removeTask(id)
    .subscribe(_ => {
      this.todoServ.getTodo(this.todoId)
      .subscribe(todo => { 
        this.alertServ.addAlertMessage({type: 'success', message: `Successfully removed Task with ID (${id}) from Todo with ID (${todo.id}).`});
        this.common.updateTodoList(new Set([todo.phase]));
      });
    }, errorMsg => {
      this.todoServ.getTodo(this.todoId)
      .subscribe(todo => { 
        this.alertServ.addAlertMessage({type: 'danger', message: `Failed to remove Task with ID (${id}) from Todo with ID (${todo.id}). See browser console for details.`});
      });
    });
  }
}
