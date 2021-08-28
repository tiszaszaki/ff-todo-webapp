import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

// Imports for mocking data
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { FfTodoMockDatabaseService } from './ff-todo-mock-database.service';

// MDB Angular Free
import { ModalModule, TooltipModule, PopoverModule, ButtonsModule } from 'angular-bootstrap-md';

import { AppComponent } from './app.component';
import { FfTodoListComponent } from './ff-todo-list/ff-todo-list.component';
import { FfTodoCardComponent } from './ff-todo-card/ff-todo-card.component';
import { FfTodoListEmptyComponent } from './ff-todo-list-empty/ff-todo-list-empty.component';
import { FfTodoSortingFormComponent } from './ff-todo-sorting-form/ff-todo-sorting-form.component';
import { FfTodoTaskListEmptyComponent } from './ff-todo-task-list-empty/ff-todo-task-list-empty.component';
import { FfTodoCardInvalidComponent } from './ff-todo-card-invalid/ff-todo-card-invalid.component';
import { FfTodoTaskSortingFormComponent } from './ff-todo-task-sorting-form/ff-todo-task-sorting-form.component';
import { FfTodoTaskListComponent } from './ff-todo-task-list/ff-todo-task-list.component';
import { TiszaSzakiSortPipe } from './tsz-sort.pipe';
import { FfTodoAddTodoFormComponent } from './ff-todo-add-todo-form/ff-todo-add-todo-form.component';
import { FfTodoListPerPhaseComponent } from './ff-todo-list-per-phase/ff-todo-list-per-phase.component';
import { FfTodoHeaderComponent } from './ff-todo-header/ff-todo-header.component';
import { FfTodoFooterComponent } from './ff-todo-footer/ff-todo-footer.component'

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
    FfTodoTaskListComponent,
    TiszaSzakiSortPipe,
    FfTodoAddTodoFormComponent,
    FfTodoListPerPhaseComponent,
    FfTodoHeaderComponent,
    FfTodoFooterComponent
  ],
  imports: [
    ModalModule, TooltipModule, PopoverModule, ButtonsModule,
    BrowserModule, FormsModule, HttpClientModule,
    HttpClientInMemoryWebApiModule.forRoot(FfTodoMockDatabaseService, { dataEncapsulation: false, apiBase: 'ff-todo/' })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
