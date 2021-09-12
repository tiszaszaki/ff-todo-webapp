import { Component } from '@angular/core';
import { Subject } from 'rxjs';
import { TiszaSzakiAlert } from './tsz-alert';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public title = 'ff-todo-webapp';

  public displayDateFormat: string = 'yyyy-MM-dd HH:mm:ss.sss';

  public maxAlerts: Number = 5;

  public todo_count!: number;

  public todosearchexec!: Boolean;
  public readonlyTodo!: Boolean;
  public readonlyTask!: Boolean;
  public enableRestoreTodos!: Boolean;

  public prepareAddBoardFormTrigger = new Subject<void>();
  public updateSelectedBoardTrigger = new Subject<Number>();

  public prepareAddTodoFormTrigger = new Subject<void>();
  public prepareRemovingAllTodosTrigger = new Subject<void>();
  public initTodoListTrigger = new Subject<void>();
  public restoreTodoListTrigger = new Subject<void>();

  public prepareSearchTodoFormTrigger = new Subject<void>();

  public toggleReadonlyTodoTrigger = new Subject<Boolean>();
  public toggleReadonlyTaskTrigger = new Subject<Boolean>();

  public addAlertMessageTrigger = new Subject<TiszaSzakiAlert>();

  public boardNameMapping = new Map<Number, String>();

  addAlertMessage(msg: TiszaSzakiAlert) {
    this.addAlertMessageTrigger.next(msg);
  }

  updateBoardNames(val: Map<Number, String>) {
    this.boardNameMapping = val;
  }

  toggleReadonlyTodo(val: Boolean) {
    this.toggleReadonlyTodoTrigger.next(val);
  }

  toggleReadonlyTask(val: Boolean) {
    this.toggleReadonlyTaskTrigger.next(val);
  }

  prepareAddBoardForm() {
    this.prepareAddBoardFormTrigger.next();
  }

  updateSelectedBoard(val: Number) {
    this.updateSelectedBoardTrigger.next(val);
  }

  prepareAddTodoForm() {
    this.prepareAddTodoFormTrigger.next();
  }

  prepareRemovingAllTodos() {
    this.prepareRemovingAllTodosTrigger.next();
  }

  initTodoList() {
    this.initTodoListTrigger.next();
  }

  restoreTodoList() {
    this.restoreTodoListTrigger.next();
  }

  prepareSearchTodoForm() {
    this.prepareSearchTodoFormTrigger.next();
  }

  updateTodoSearchExec(val: Boolean) {
    this.todosearchexec = val;
  }

  updateReadonlyTodo(val: Boolean) {
    this.readonlyTodo = val;
  }

  updateReadonlyTask(val: Boolean) {
    this.readonlyTask = val;
  }

  updateTodoCount(val: number) {
    this.todo_count = val;
  }

  toggleRestoreTodos(val: Boolean) {
    this.enableRestoreTodos = val;
  }
}
