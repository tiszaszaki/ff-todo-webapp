import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Subject, Subscription } from 'rxjs';
import { FfTodoAbstractRequestService } from '../ff-todo-abstract-request.service';
import { FfTodoAlertService } from '../ff-todo-alert.service';
import { FfTodoCommonService } from '../ff-todo-common.service';
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
      private todoServ: FfTodoAbstractRequestService,
      private alertServ: FfTodoAlertService) {
    this.displayDateFormat = this.common.displayDateFormat;     
  }

  @Input() todoId!: number;
  @Input() phase_idx!: number;
  @Input() readonly!: boolean;

  public prepareEditTaskFormTrigger = new Subject<void>();
  public prepareRemoveTaskFormTrigger = new Subject<void>();

  public todoSortingSettingsListener!: Subscription;
  public todoSearchingRulesListener!: Subscription;

  public tasksortfield!: String;
  public tasksortdir!: Boolean;
  public tasksortexec!: Boolean;
  public taskSortingSettingsListener!: Subscription;

  public showTaskCount!: Boolean[];

  public taskSelected!: Task;

  public taskCount!: number;
  public taskChecked!: number;

  public displayDateFormat!: string;

  public readonlyTask!: boolean;
  public readonlyTaskListener!: Subscription;

  public highlightedNames = new Map<Number,SafeHtml>();

  public tasks! : Task[];

  public tasklist_collapse_status: boolean = false;

  public readonly EDIT_TASK = TaskOperator.EDIT;
  public readonly REMOVE_TASK = TaskOperator.REMOVE;

  ngOnInit(): void {
    if (this.readonly)
      this.readonlyTask = this.readonly;
    else
      this.readonlyTaskListener = this.common.readonlyTaskChange.subscribe(result => this.readonlyTask = result as boolean);

    this.showTaskCount = [false, false];

    this.todoSortingSettingsListener = this.common.todoSortingSettingsChange.subscribe(result => {
      if (this.phase_idx == result.phase)
      {
        this.showTaskCount[0] = (result.field == 'taskCount');
      }
    });

    this.common.triggerTodoSortingSettings(this.phase_idx);

    this.todoSearchingRulesListener = this.common.todoSearchingRulesChange.subscribe(results => {
      for (let fieldName of results.keys())
      {
        this.showTaskCount[1] ||= (fieldName == 'taskCount');
      }
    });

    this.common.triggerTodoSearchingRules();

    this.taskSortingSettingsListener = this.common.taskSortingSettingsChange.subscribe(result => {
      if (this.phase_idx == result.phase)
      {
        this.tasksortexec = result.exec;
        this.tasksortfield = result.field;
        this.tasksortdir = result.dir;
      }
    });

    this.todoServ.getTasksFromTodo(this.todoId).subscribe(tasks => {
      this.tasks = tasks;

      this.tasks.sort((a: Task, b: Task) => {
        let res;
        if (a.id < b.id) {
          res = -1;
        } else if (a.id > b.id) {
          res = 1;
        } else {
          res = 0;
        }
        return res;
      });
  
      this.taskCount = this.tasks.length;
  
      this.taskChecked = 0;
  
      for (let task of this.tasks)
      {
        this.taskChecked += (task.done ? 1 : 0);
  
        this.highlightedNames.set(task.id, this.highlighter.bypassSecurityTrustHtml(task.name as string));
      }
    });

  }

  ngOnDestroy(): void {
    if (!this.readonly)
      this.readonlyTaskListener.unsubscribe();

    this.todoSortingSettingsListener.unsubscribe();
    this.todoSearchingRulesListener.unsubscribe();

    this.taskSortingSettingsListener.unsubscribe();
  }

  isTaskCountShown() {
    return (this.showTaskCount.length == 2) && (this.showTaskCount[0] || this.showTaskCount[1]);
  }

  getTaskDeadline(task : Task) {
    return task.deadline;
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
    .subscribe(() => {
      this.alertServ.addAlertMessage({type: 'success', message: `Successfully updated Task with ID (${id}) for Todo with ID (${this.todoId}).`});
      this.common.updateTodo(this.todoId);
    }, errorMsg => {
      this.alertServ.addAlertMessage({type: 'danger', message: `Failed to update Task with ID (${id}). See browser console for details.`});
    });
  }

  checkTask(task : Task) {
    let id = task.id;
    let checkedTask = task;
    checkedTask.done = !checkedTask.done;
    console.log(`Trying to check Task with ID (${id}) for Todo with ID (${this.todoId})...`);
    this.todoServ.editTask(checkedTask)
    .subscribe(() => {
      this.alertServ.addAlertMessage({type: 'success', message: `Successfully checked Task with ID (${id}) for Todo with ID (${this.todoId}).`});
      this.common.updateTodo(this.todoId);
    }, errorMsg => {
      this.alertServ.addAlertMessage({type: 'danger', message: `Failed to check Task with ID (${id}). See browser console for details.`});
    });
  }

  removeTask(task : Task) {
    let id = task.id;
    console.log(`Trying to remove Task with ID (${id}) for Todo with ID (${this.todoId}})...`);
    this.todoServ.removeTask(id)
    .subscribe(() => {
      this.alertServ.addAlertMessage({type: 'success', message: `Successfully removed Task with ID (${id}) from Todo with ID (${this.todoId}).`});
      this.common.updateTodo(this.todoId);
    }, errorMsg => {
      this.todoServ.getTodo(this.todoId)
      .subscribe(todo => { 
        this.alertServ.addAlertMessage({type: 'danger', message: `Failed to remove Task with ID (${id}) from Todo with ID (${todo.id}). See browser console for details.`});
      });
    });
  }
}
