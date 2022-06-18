import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FfTodoAlertService } from '../ff-todo-alert.service';
import { FfTodoCommonService } from '../ff-todo-common.service';

@Component({
  selector: 'app-ff-todo-backend-switch-form',
  templateUrl: './ff-todo-backend-switch-form.component.html',
  styleUrls: ['./ff-todo-backend-switch-form.component.css']
})
export class FfTodoBackendSwitchFormComponent implements OnInit, OnDestroy {

  public backendSelected!: Number;
  private backendSelectedListener!: Subscription;

  public backendIndexRange!: Number[];

  constructor(
      private common: FfTodoCommonService,
      private router: Router,
      private alertServ: FfTodoAlertService) {
    this.backendSelected = 0;

    this.backendIndexRange = this.common.getBackendIndexRange();
  }

  public getBackendName(idx: Number) {
    return this.common.getBackendName(idx);
  }

  public switchBackend()
  {
    if (this.common.changeBackend(this.backendSelected))
    {
      this.alertServ.addAlertMessage({type: 'success', message: `Successfully switched backend: (${this.getBackendName(this.backendSelected)}).`});
      this.router.navigate(["/"]);
    }
    else
    {
      this.alertServ.addAlertMessage({type: 'danger', message: `Failed to switch to backend with index (${this.backendSelected}). See browser console for details.`});
    }
  }

  ngOnInit(): void {
    this.backendSelectedListener = this.common.backendSelectedChange.subscribe(idx => this.backendSelected = idx);

    this.common.changeBackend();
  }

  ngOnDestroy(): void {
    this.backendSelectedListener.unsubscribe();
  }

}
