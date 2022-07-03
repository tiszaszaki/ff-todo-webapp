import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Subscription } from 'rxjs';
import { FfTodoAbstractRequestService } from '../ff-todo-abstract-request.service';
import { FfTodoAlertService } from '../ff-todo-alert.service';
import { FfTodoCommonService } from '../ff-todo-common.service';
import { GenericQueryStatus } from '../generic-query-status';

@Component({
  selector: 'app-ff-todo-backend-switch-form',
  templateUrl: './ff-todo-backend-switch-form.component.html',
  styleUrls: ['./ff-todo-backend-switch-form.component.css']
})
export class FfTodoBackendSwitchFormComponent implements OnInit, OnDestroy {

  public backendSelected!: string;
  private backendSelectedListener!: Subscription;

  public backendRefreshStatus!: Number;
  public backendRefreshStatusListener!: Subscription;

  public backendIds!: string[];

  public readonly QUERY_STANDBY = GenericQueryStatus.QUERY_STANDBY;
  public readonly QUERY_INPROGRESS = GenericQueryStatus.QUERY_INPROGRESS;
  public readonly QUERY_SUCCESS = GenericQueryStatus.QUERY_SUCCESS;
  public readonly QUERY_WARNING = GenericQueryStatus.QUERY_WARNING;
  public readonly QUERY_FAILURE = GenericQueryStatus.QUERY_FAILURE;

  constructor(
      private common: FfTodoCommonService,
      private router: Router,
      private alertServ: FfTodoAlertService) {
    this.backendRefreshStatus = this.QUERY_STANDBY;

    this.backendIds = this.common.getBackendIds();
  }

  public getBackendName(id: string) {
    return this.common.getBackendName(id);
  }

  public switchBackend()
  {
    if (this.backendRefreshStatus == this.QUERY_STANDBY)
    {
      if (this.common.doesBackendExist(this.backendSelected))
      {
        this.router.navigate(["/"]);
        this.common.updateBoardList(this.backendSelected);
      }
      else
      {
        this.alertServ.addAlertMessage({type: 'warning', message: `Backend with ID (${this.backendSelected}) does not exist.`});
        this.backendRefreshStatus = this.QUERY_WARNING;

        setTimeout(() => this.common.changeBackendRefreshStatus(this.QUERY_STANDBY), 5000);
      }
    }
  }

  ngOnInit(): void {
    this.backendSelectedListener = this.common.backendSelectedChange.subscribe(idx => this.backendSelected = idx);
    this.backendRefreshStatusListener = this.common.backendRefreshStatusChange.subscribe(val => this.backendRefreshStatus = val);
  }

  ngOnDestroy(): void {
    this.backendSelectedListener.unsubscribe();
    this.backendRefreshStatusListener.unsubscribe();
  }

}
