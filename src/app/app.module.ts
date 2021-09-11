import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

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
import { FfTodoGenericTodoFormComponent } from './ff-todo-generic-todo-form/ff-todo-generic-todo-form.component';
import { FfTodoListPerPhaseComponent } from './ff-todo-list-per-phase/ff-todo-list-per-phase.component';
import { FfTodoHeaderComponent } from './ff-todo-header/ff-todo-header.component';
import { FfTodoFooterComponent } from './ff-todo-footer/ff-todo-footer.component';
import { FfTodoFormInvalidComponent } from './ff-todo-form-invalid/ff-todo-form-invalid.component';
import { FfTodoGenericTaskFormComponent } from './ff-todo-generic-task-form/ff-todo-generic-task-form.component';
import { FfTodoSearchingFormComponent } from './ff-todo-searching-form/ff-todo-searching-form.component';
import { TiszaSzakiSearchPipe } from './tsz-search.pipe';
import { TiszaSzakiFocusDirective } from './tszfocus.directive';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FfTodoAlertListComponent } from './ff-todo-alert-list/ff-todo-alert-list.component';
import { ModalBasicComponent } from './modal-basic/modal-basic.component';
import { FfTodoSearchNoResultsComponent } from './ff-todo-search-no-results/ff-todo-search-no-results.component'

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
    FfTodoGenericTodoFormComponent,
    FfTodoListPerPhaseComponent,
    FfTodoHeaderComponent,
    FfTodoFooterComponent,
    FfTodoFormInvalidComponent,
    FfTodoGenericTaskFormComponent,
    FfTodoSearchingFormComponent,
    TiszaSzakiSearchPipe,
    TiszaSzakiFocusDirective,
    FfTodoAlertListComponent,
    ModalBasicComponent,
    FfTodoSearchNoResultsComponent
  ],
  imports: [
    BrowserModule, FormsModule, HttpClientModule, NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
