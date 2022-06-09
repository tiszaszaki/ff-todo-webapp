import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { FfTodoAbstractRequestService } from '../ff-todo-abstract-request.service';
import { FfTodoAlertService } from '../ff-todo-alert.service';
import { FfTodoCommonService } from '../ff-todo-common.service';
import { Todo } from '../todo';
import { TodoOperator } from '../todo-operator';

@Component({
  selector: 'app-ff-todo-index',
  templateUrl: './ff-todo-index.component.html',
  styleUrls: ['./ff-todo-index.component.css']
})
export class FfTodoIndexComponent implements OnInit, OnDestroy {

  public todoList!: Todo[];

  public todoSortExec!: Boolean;
  public todoSortField!: String;
  public todoSortDir!: Boolean;

  public todoQueryFinished!: Boolean;
  public todoQuerySuccess!: Boolean;

  public dumpErrorMessage!: String;

  public todoSelected!: Todo;

  public readonly VIEW_TODO = TodoOperator.VIEW;
  public readonly REMOVE_TODO = TodoOperator.REMOVE;

  public prepareViewTodoFormTrigger = new Subject<void>();
  public prepareRemoveTodoFormTrigger = new Subject<void>();

  constructor(
      private todoServ: FfTodoAbstractRequestService,
      private route: ActivatedRoute,
      private common: FfTodoCommonService,
      private alertServ: FfTodoAlertService) {
    this.todoList = [];
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(_ => {
      this.common.changeRouteStatus(false, true);
    });

    this.common.changePageTitle("Index of Todos");

    this.todoSortExec = true;
    this.todoSortField = "id";
    this.todoSortDir = false;

    this.updateTodoList();
  }

  ngOnDestroy(): void {
    this.common.changePageTitle("");
  }

  prepareViewTodoForm(todo: Todo) {
    this.todoSelected = todo;
    this.prepareViewTodoFormTrigger.next();
  }

  prepareRemoveTodoForm(todo: Todo) {
    this.todoSelected = todo;
    this.prepareRemoveTodoFormTrigger.next();
  }

  removeTodo(todo: Todo) {
    let id = todo.id;
    console.log(`Trying to remove Todo with ID (${id})...`);
    this.todoServ.removeTodo(id)
    .subscribe(() => {
      this.alertServ.addAlertMessage({type: 'success', message: `Successfully removed Todo with ID (${id}).`});
      this.updateTodoList();
    }, errorMsg => {
      this.alertServ.addAlertMessage({type: 'danger', message: `Failed to remove Todo with ID (${id}). See browser console for details.`});
    });
  }

  getTodoListSize() {
    return this.todoList.length;
  }

  clearTodoNames()
  {
    this.todoList = [];
  }

  addTodoEntry(todo: Todo)
  {
    this.todoList.push(todo);
  }

  private updateTodoList()
  {
    this.todoQueryFinished = false;
    this.todoQuerySuccess = false;

    this.todoServ.getTodos().subscribe(results => {
      let idx=0;

      this.clearTodoNames();

      for (let todo of results)
      {
        this.addTodoEntry(todo);
        idx++;
      }

      if (idx == results.length)
      {
        this.todoQueryFinished = true;
        this.todoQuerySuccess = true;
      }
    }, errorMsg => {
      this.todoQueryFinished = true;
      this.todoQuerySuccess = false;
      this.dumpErrorMessage = JSON.stringify(errorMsg);
    });
  }
}
