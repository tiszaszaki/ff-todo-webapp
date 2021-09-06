import { Component, Input, OnInit } from '@angular/core';
import { TiszaSzakiAlert } from '../tsz-alert';

@Component({
  selector: 'app-ff-todo-alert-list',
  templateUrl: './ff-todo-alert-list.component.html',
  styleUrls: ['./ff-todo-alert-list.component.css']
})
export class FfTodoAlertListComponent implements OnInit {

  @Input() alerts!: TiszaSzakiAlert[];

  constructor() { }

  ngOnInit(): void {
  }

  close(alert: TiszaSzakiAlert) {
    this.alerts.splice(this.alerts.indexOf(alert), 1);
  }
}
