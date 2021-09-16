import { Component, OnInit } from '@angular/core';
import { FfTodoAlertService } from '../ff-todo-alert.service';
import { FfTodoCommonService } from '../ff-todo-common.service';
import { TiszaSzakiAlert } from '../tsz-alert';

@Component({
  selector: 'app-ff-todo-alert-list',
  templateUrl: './ff-todo-alert-list.component.html',
  styleUrls: ['./ff-todo-alert-list.component.css']
})
export class FfTodoAlertListComponent implements OnInit {

  public displayDateFormat!: string;

  constructor(
      private common: FfTodoCommonService,
      private alertServ: FfTodoAlertService) {
    this.displayDateFormat = this.common.displayDateFormat;
  }

  isAlertListEmpty()
  {
    return this.alertServ.isAlertListEmpty();
  }

  getAlerts() : TiszaSzakiAlert[] {
    return this.alertServ.getAlerts();
  }

  close(msg: TiszaSzakiAlert)
  {
    this.alertServ.close(msg);
  }

  ngOnInit() {
  }
}
