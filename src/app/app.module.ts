import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';

import { FfTodoMockDatabaseService } from './ff-todo-mock-database.service';

import { AppComponent } from './app.component';
import { FfTodoListComponent } from './ff-todo-list/ff-todo-list.component';
import { FfTodoCardComponent } from './ff-todo-card/ff-todo-card.component';
import { FfTodoListEmptyComponent } from './ff-todo-list-empty/ff-todo-list-empty.component';
import { FfTodoSortingFormComponent } from './ff-todo-sorting-form/ff-todo-sorting-form.component';
import { FfTodoTaskListEmptyComponent } from './ff-todo-task-list-empty/ff-todo-task-list-empty.component';
import { FfTodoCardInvalidComponent } from './ff-todo-card-invalid/ff-todo-card-invalid.component';
import { FfTodoTaskSortingFormComponent } from './ff-todo-task-sorting-form/ff-todo-task-sorting-form.component';
import { FfTodoTaskListComponent } from './ff-todo-task-list/ff-todo-task-list.component';

@NgModule({
  declarations: [
    AppComponent,
    FfTodoListComponent,
    FfTodoCardComponent,
    FfTodoListEmptyComponent,
    FfTodoSortingFormComponent,
    FfTodoTaskListEmptyComponent,
    FfTodoCardInvalidComponent,
    FfTodoTaskSortingFormComponent,
    FfTodoTaskListComponent
  ],
  imports: [
    BrowserModule, FormsModule, HttpClientModule,
    HttpClientInMemoryWebApiModule.forRoot(FfTodoMockDatabaseService, { dataEncapsulation: false, apiBase: 'ff-todo/' })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
