import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { TiszaSzakiAlert } from '../tsz-alert';

@Component({
  selector: 'app-ff-todo-alert-list',
  templateUrl: './ff-todo-alert-list.component.html',
  styleUrls: ['./ff-todo-alert-list.component.css']
})
export class FfTodoAlertListComponent implements OnInit, OnDestroy {

  @Input() maxAlerts!: Number;
  @Input() closeAlertDelay!: Number;

  @Input() addAlertMessageEvent!: Observable<TiszaSzakiAlert>;

  @Input() displayDateFormat!: string;

  private closeAlertEvent = new Subject<TiszaSzakiAlert>();

  private addAlertMessageListener!: Subscription;

  private closeAlertListener!: Subscription;

  public alerts: TiszaSzakiAlert[] = [];

  private autoCloseAlerts!: Boolean;

  constructor() { }

  ngOnInit(): void {
    this.closeAlertDelay = 5000;
    this.autoCloseAlerts = (this.closeAlertDelay > 0);
    this.addAlertMessageListener = this.addAlertMessageEvent.subscribe((msg) => this.addAlertMessage(msg));
    this.closeAlertListener = this.closeAlertEvent.subscribe((msg) => {
      setTimeout(() => this.close(msg), this.closeAlertDelay as number);
    });
  }

  ngOnDestroy(): void {
    this.addAlertMessageListener.unsubscribe();
    this.closeAlertListener.unsubscribe();
  }

  addAlertMessage(msg: TiszaSzakiAlert) {
    if (!msg.createdAt)
    {
      msg.createdAt = new Date();
    }

    if (this.alerts.length == this.maxAlerts)
    {
      this.alerts.shift();
    }

    this.alerts.push(msg);

    if (this.autoCloseAlerts)
    {
      this.closeAlertEvent.next(msg);
    }
  }

  close(alert: TiszaSzakiAlert) {
    if (this.alerts.find(elem => elem == alert))
    {
      this.alerts.splice(this.alerts.indexOf(alert), 1);
    }
  }
}
