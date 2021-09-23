import { EventEmitter, Injectable, OnDestroy } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { TiszaSzakiAlert } from './tsz-alert';

@Injectable({
  providedIn: 'root'
})
export class FfTodoAlertService implements OnDestroy {

  private maxAlerts = 5;
  private closeAlertDelay = 5000;
  private closeAlertDelayGap = 500;

  private closeAlertEvent = new Subject<TiszaSzakiAlert>();

  private closeAlertListener!: Subscription;

  private alerts: TiszaSzakiAlert[] = [];
  public alertsChange = new EventEmitter< TiszaSzakiAlert[] >();

  private autoCloseAlerts = true;

  constructor() {
    this.autoCloseAlerts &&= ((this.closeAlertDelay !== undefined) && (this.closeAlertDelayGap !== undefined));
    this.autoCloseAlerts &&= ((this.closeAlertDelay > 0) && (this.closeAlertDelayGap > 0));

    this.closeAlertListener = this.closeAlertEvent.subscribe((msg) => {
      let delayAmount = this.closeAlertDelay + this.closeAlertDelayGap * this.alerts.length;
      setTimeout(() => this.close(msg), delayAmount);
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
