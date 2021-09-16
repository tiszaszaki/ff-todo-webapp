import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FfTodoBoardListComponent } from './ff-todo-board-list/ff-todo-board-list.component';
import { FfTodoListComponent } from './ff-todo-list/ff-todo-list.component';
import { FfTodoPageDoesNotExistComponent } from './ff-todo-page-does-not-exist/ff-todo-page-does-not-exist.component';

const routes: Routes = [
  { path: '', component: FfTodoBoardListComponent },
  { path: 'list-todos', component: FfTodoListComponent },
  { path: '**', component: FfTodoPageDoesNotExistComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
