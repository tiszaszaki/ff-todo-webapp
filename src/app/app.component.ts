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

  public readonlyTodo!: Boolean;
  public todo_count!: number;
  public enableRestoreTodos!: Boolean;

  public prepareAddTodoFormTrigger = new Subject<void>();
  public prepareRemovingAllTodosTrigger = new Subject<void>();
  public initTodoListTrigger = new Subject<void>();
  public restoreTodoListTrigger = new Subject<void>();

  public toggleReadonlyTodoTrigger = new Subject<Boolean>();
  public toggleReadonlyTaskTrigger = new Subject<Boolean>();

  public addAlertMessageTrigger = new Subject<TiszaSzakiAlert>();

  addAlertMessage(msg: TiszaSzakiAlert) {
    this.addAlertMessageTrigger.next(msg);
  }

  toggleReadonlyTodo(val: Boolean) {
    this.toggleReadonlyTodoTrigger.next(val);
  }

  toggleReadonlyTask(val: Boolean) {
    this.toggleReadonlyTaskTrigger.next(val);
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

  updateReadonlyTodo(val: Boolean) {
    this.readonlyTodo = val;
  }

  updateTodoCount(val: number) {
    this.todo_count = val;
  }

  toggleRestoreTodos(val: Boolean) {
    this.enableRestoreTodos = val;
  }
}
