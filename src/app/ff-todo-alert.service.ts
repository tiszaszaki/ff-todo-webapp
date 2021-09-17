import { EventEmitter, Injectable, OnDestroy, OnInit } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { FfTodoCommonService } from './ff-todo-common.service';
import { TiszaSzakiAlert } from './tsz-alert';

@Injectable({
  providedIn: 'root'
})
export class FfTodoAlertService implements OnInit, OnDestroy {

  private maxAlerts!: Number;
  private closeAlertDelay!: Number;

  private closeAlertEvent = new Subject<TiszaSzakiAlert>();

  private closeAlertListener!: Subscription;

  private alerts: TiszaSzakiAlert[] = [];
  public alertsChange = new EventEmitter< TiszaSzakiAlert[] >();

  private autoCloseAlerts!: Boolean;

  constructor(private common: FfTodoCommonService) {

  }

  ngOnInit(): void {
    this.maxAlerts = 5;
    this.closeAlertDelay = 5000;
    this.autoCloseAlerts = (this.closeAlertDelay > 0);
    this.closeAlertListener = this.closeAlertEvent.subscribe((msg) => {
      setTimeout(() => this.close(msg), this.closeAlertDelay as number);
    });
  }

  ngOnDestroy(): void {
    this.closeAlertListener.unsubscribe();
  }

  isAlertListEmpty() {
    return !this.alerts.length;
  }

  addAlertMessage(msg: TiszaSzakiAlert) {
    if (!msg.createdAt)
    {
      msg.createdAt = new Date();
    }

    while (this.alerts.length >= this.maxAlerts)
    {
      this.alerts.shift();
    }

    this.alerts.push(msg);

    if (this.autoCloseAlerts)
    {
      this.closeAlertEvent.next(msg);
    }

    this.alertsChange.emit(this.alerts);
  }

  clearMessages() {
    this.alerts = [];
    this.alertsChange.emit(this.alerts);
  }

  close(alert: TiszaSzakiAlert) {
    if (this.alerts.find(elem => elem == alert))
    {
      this.alerts.splice(this.alerts.indexOf(alert), 1);

      this.alertsChange.emit(this.alerts);
    }
  }
}
