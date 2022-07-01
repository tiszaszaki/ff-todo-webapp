import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FfTodoAbstractRequestService } from '../ff-todo-abstract-request.service';
import { FfTodoCommonService } from '../ff-todo-common.service';
import { TaskOperator } from '../task-operator';
import { Task } from '../task';
import { Subject } from 'rxjs';
import { FfTodoAlertService } from '../ff-todo-alert.service';
import { CookieService } from 'ngx-cookie-service';
import { CurrentRoutingStatus } from '../current-routing-status';

@Component({
  selector: 'app-ff-todo-task-index',
  templateUrl: './ff-todo-task-index.component.html',
  styleUrls: ['./ff-todo-task-index.component.css']
})
export class FfTodoTaskIndexComponent implements OnInit, OnDestroy {

  public taskList!: Task[];

  private queryIdx!: number;

  private todoParentMapping!: Map<Number, Number>;

  public tasksortfield!: String;
  public tasksortdir!: Boolean;
  public tasksortexec!: Boolean;

  public taskQueryFinished!: Boolean;
  public taskQuerySuccess!: Boolean;

  public dumpErrorMessage!: String;

  public taskSelected!: Task;

  public readonly VIEW_TASK = TaskOperator.VIEW;
  public readonly REMOVE_TASK = TaskOperator.REMOVE;

  public prepareViewTaskFormTrigger = new Subject<void>();
  public prepareRemoveTaskFormTrigger = new Subject<void>();

  constructor(
      private todoServ: FfTodoAbstractRequestService,
      private route: ActivatedRoute,
      private common: FfTodoCommonService,
      private alertServ: FfTodoAlertService,
      private cookies: CookieService) {
    this.taskList = [];

    this.todoParentMapping = new Map<Number,Number>();
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(_ => {
      let currentRoute: CurrentRoutingStatus = { path: '/task-index', params: []};
      this.cookies.set(this.common.cookies.currentRoute, JSON.stringify(currentRoute));
      this.common.changeRouteStatus(false, true);
      this.alertServ.addAlertMessage({type: 'success', message: `Successfully redirected to index of Tasks.`});
    });

    this.common.changePageTitle("Index of Tasks");

    this.tasksortexec = true;
    this.tasksortfield = "id";
    this.tasksortdir = false;

    this.updateTaskList();
  }

  ngOnDestroy(): void {
    this.common.changePageTitle("");
  }

  prepareViewTaskForm(task: Task) {
    this.taskSelected = task;
    this.prepareViewTaskFormTrigger.next();
  }

  prepareRemoveTaskForm(task: Task) {
    this.taskSelected = task;
    this.prepareRemoveTaskFormTrigger.next();
  }

  removeTask(task : Task) {
    let id = task.id;
    console.log(`Trying to remove Task with ID (${id})...`);
    this.todoServ.removeTask(id)
    .subscribe(() => {
      this.alertServ.addAlertMessage({type: 'success', message: `Successfully removed Task with ID (${id}).`});
      this.updateTaskList();
    }, errorMsg => {
      this.alertServ.addAlertMessage({type: 'danger', message: `Failed to remove Task with ID (${id}). See browser console for details.`});
    });
  }

  getTaskListSize() {
    return this.taskList.length;
  }

  hasTaskGrandparent(task: Task): Boolean {
    if (task.todoId)
      return (this.todoParentMapping.has(task.todoId));
    else
      return false;
  }

  getTaskGrandparent(task: Task): Number {
    let result: Number = -1;

    if (task.todoId)
      result = this.todoParentMapping.get(task.todoId)!;

    return result;
  }

  clearTaskNames()
  {
    this.taskList = [];
  }

  addTodoParent(todoId?: Number)
  {
    this.todoServ.getTodo(Number(todoId)).subscribe(todo => {
      let _boardId=(todo.boardId ? todo.boardId : -1);
      if (todoId)
        this.todoParentMapping.set(todoId, _boardId);
      this.queryIdx++;
    });
  }

  addTaskEntry(task: Task)
  {
    this.taskList.push(task);
    this.addTodoParent(task.todoId);
  }

  private updateTaskList()
  {
    this.taskQueryFinished = false;
    this.taskQuerySuccess = false;

    this.todoServ.getTasks().subscribe(results => {
      this.queryIdx = 0;

      this.clearTaskNames();

      for (let task of results)
      {
        this.addTaskEntry(task);
        this.queryIdx++;
      }

      if (this.queryIdx == results.length * 2)
      {
        this.taskQueryFinished = true;
        this.taskQuerySuccess = true;
      }
    }, errorMsg => {
      this.taskQueryFinished = true;
      this.taskQuerySuccess = false;
      this.dumpErrorMessage = JSON.stringify(errorMsg);
    });
  }
}
