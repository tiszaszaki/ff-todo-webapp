import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { FfTodoListComponent } from './ff-todo-list/ff-todo-list.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public title = 'ff-todo-webapp';

  public readonlyTodo!: Boolean;
  public todo_count!: number;
  public enableRestoreTodos!: Boolean;

  public prepareAddTodoFormTrigger = new Subject<void>();
  public prepareRemovingAllTodosTrigger = new Subject<void>();
  public initTodoListTrigger = new Subject<void>();
  public restoreTodoListTrigger = new Subject<void>();

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
