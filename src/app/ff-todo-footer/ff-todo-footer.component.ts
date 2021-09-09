import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
import { TiszaSzakiAlert } from '../tsz-alert';

@Component({
  selector: 'app-ff-todo-footer',
  templateUrl: './ff-todo-footer.component.html',
  styleUrls: ['./ff-todo-footer.component.css', '../app.component.css']
})
export class FfTodoFooterComponent implements OnInit, OnDestroy {

  @Input() maxAlerts!: Number;

  @Input() addAlertMessageEvent!: Observable<TiszaSzakiAlert>;

  @Input() displayDateFormat!: string;

  public footer_collapse_status = true;

  public addAlertMessageTrigger = new Subject<TiszaSzakiAlert>();

  private addAlertMessageListener!: Subscription;

  constructor() { }

  ngOnInit(): void {
    this.addAlertMessageListener = this.addAlertMessageEvent.subscribe((msg) => this.addAlertMessageTrigger.next(msg));
  }

  ngOnDestroy(): void {
    this.addAlertMessageListener.unsubscribe();
  }

}
