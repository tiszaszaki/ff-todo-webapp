import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CookieService } from 'ngx-cookie-service';

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
import { FfTodoAlertListComponent } from './ff-todo-alert-list/ff-todo-alert-list.component';
import { FfTodoSearchNoResultsComponent } from './ff-todo-search-no-results/ff-todo-search-no-results.component';
import { FfTodoGenericBoardFormComponent } from './ff-todo-generic-board-form/ff-todo-generic-board-form.component';
import { FfTodoBoardListComponent } from './ff-todo-board-list/ff-todo-board-list.component';
import { FfTodoPageDoesNotExistComponent } from './ff-todo-page-does-not-exist/ff-todo-page-does-not-exist.component';
import { FfTodoQueryStatusComponent } from './ff-todo-query-status/ff-todo-query-status.component';
import { FfTodoCardRefreshingComponent } from './ff-todo-card-refreshing/ff-todo-card-refreshing.component';
import { FfTodoBootstrapDateTimePickerComponent } from './ff-todo-bootstrap-date-time-picker/ff-todo-bootstrap-date-time-picker.component'
import { FfTodoIndexComponent } from './ff-todo-index/ff-todo-index.component';
import { FfTodoTaskIndexComponent } from './ff-todo-task-index/ff-todo-task-index.component';
import { FfTodoBackendSwitchFormComponent } from './ff-todo-backend-switch-form/ff-todo-backend-switch-form.component';
import { FfTodoGenericPivotFormComponent } from './ff-todo-generic-pivot-form/ff-todo-generic-pivot-form.component';

import { FfTodoAbstractRequestService } from './ff-todo-abstract-request.service';
import { FfTodoRealRequestService } from './ff-todo-real-request.service';

import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { FfTodoMockDatabaseService } from './ff-todo-mock-database.service';
import { FfTodoMockRequestService } from './ff-todo-mock-request.service';

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
    FfTodoSearchNoResultsComponent,
    FfTodoGenericBoardFormComponent,
    FfTodoBoardListComponent,
    FfTodoPageDoesNotExistComponent,
    FfTodoQueryStatusComponent,
    FfTodoCardRefreshingComponent,
    FfTodoBootstrapDateTimePickerComponent,
    FfTodoIndexComponent,
    FfTodoTaskIndexComponent,
    FfTodoBackendSwitchFormComponent,
    FfTodoGenericPivotFormComponent
  ],
  imports: [
    BrowserModule, FormsModule, HttpClientModule, NgbModule, AppRoutingModule
    //, HttpClientInMemoryWebApiModule.forRoot(FfTodoMockDatabaseService, { dataEncapsulation: false, apiBase: "ff-todo/" })
  ],
  providers: [{provide: FfTodoAbstractRequestService, useClass: FfTodoRealRequestService}, CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
