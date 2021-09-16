import { Component } from '@angular/core';
import { Subject } from 'rxjs';
import { TiszaSzakiAlert } from './tsz-alert';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor() {
  }

  public title = 'ff-todo-webapp';
}
