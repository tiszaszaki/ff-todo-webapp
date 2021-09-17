import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FfTodoAlertService } from '../ff-todo-alert.service';
import { FfTodoCommonService } from '../ff-todo-common.service';
import { TiszaSzakiAlert } from '../tsz-alert';

@Component({
  selector: 'app-ff-todo-alert-list',
  templateUrl: './ff-todo-alert-list.component.html',
  styleUrls: ['./ff-todo-alert-list.component.css']
})
export class FfTodoAlertListComponent implements OnInit, OnDestroy {

  public displayDateFormat!: string;

  public alerts!: TiszaSzakiAlert[];
  public alertsListener!: Subscription;

  constructor(
      private common: FfTodoCommonService,
      private alertServ: FfTodoAlertService) {
    this.displayDateFormat = this.common.displayDateFormat;
  }

  isAlertListEmpty()
  {
    return this.alertServ.isAlertListEmpty();
  }

  close(msg: TiszaSzakiAlert)
  {
    this.alertServ.close(msg);
  }

  ngOnInit() {
    this.alertsListener = this.alertServ.alertsChange.subscribe(results => this.alerts = results);
  }

  ngOnDestroy() {
    this.alertsListener.unsubscribe();
  }
}
