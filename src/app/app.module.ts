import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { FfTodoListComponent } from './ff-todo-list/ff-todo-list.component';

@NgModule({
  declarations: [
    AppComponent,
    FfTodoListComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
