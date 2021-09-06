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

  public alerts: TiszaSzakiAlert[] = [];
  public maxAlerts = 5;

  public readonlyTodo!: Boolean;
  public todo_count!: number;
  public enableRestoreTodos!: Boolean;

  public prepareAddTodoFormTrigger = new Subject<void>();
  public prepareRemovingAllTodosTrigger = new Subject<void>();
  public initTodoListTrigger = new Subject<void>();
  public restoreTodoListTrigger = new Subject<void>();

  addAlertMessage(msg: TiszaSzakiAlert) {
    if (this.alerts.length == this.maxAlerts)
    {
      this.alerts.shift();
    }

    this.alerts.push(msg);
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
