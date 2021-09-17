import { Component, OnDestroy, OnInit } from '@angular/core';
import { FfTodoAlertService } from '../ff-todo-alert.service';

@Component({
  selector: 'app-ff-todo-footer',
  templateUrl: './ff-todo-footer.component.html',
  styleUrls: ['./ff-todo-footer.component.css', '../app.component.css']
})
export class FfTodoFooterComponent implements OnInit, OnDestroy {

  public footer_collapse_status = true;

  constructor(private alertServ: FfTodoAlertService) { }

  isAlertListEmpty() {
    return this.alertServ.isAlertListEmpty();
  }

  clearAlertList() {
    this.alertServ.clearMessages();
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }

}
