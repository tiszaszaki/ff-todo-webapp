import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { FfTodoListComponent } from './ff-todo-list/ff-todo-list.component';
import { FfTodoCardComponent } from './ff-todo-card/ff-todo-card.component';
import { FfTodoListEmptyComponent } from './ff-todo-list-empty/ff-todo-list-empty.component';

@NgModule({
  declarations: [
    AppComponent,
    FfTodoListComponent,
    FfTodoCardComponent,
    FfTodoListEmptyComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
