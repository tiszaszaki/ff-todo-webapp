import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FfTodoBoardListComponent } from './ff-todo-board-list/ff-todo-board-list.component';
import { FfTodoIndexComponent } from './ff-todo-index/ff-todo-index.component';
import { FfTodoListComponent } from './ff-todo-list/ff-todo-list.component';
import { FfTodoPageDoesNotExistComponent } from './ff-todo-page-does-not-exist/ff-todo-page-does-not-exist.component';
import { FfTodoTaskIndexComponent } from './ff-todo-task-index/ff-todo-task-index.component';

const routes: Routes = [
  { path: '', component: FfTodoBoardListComponent },
  { path: 'list-boards', component: FfTodoBoardListComponent },
  { path: 'list-todos', component: FfTodoListComponent },
  { path: 'todo-index', component: FfTodoIndexComponent },
  { path: 'task-index', component: FfTodoTaskIndexComponent },
  { path: '**', component: FfTodoPageDoesNotExistComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    useHash: true,
    anchorScrolling: 'enabled',
    enableTracing: false,
    scrollOffset: [0, 0]
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
