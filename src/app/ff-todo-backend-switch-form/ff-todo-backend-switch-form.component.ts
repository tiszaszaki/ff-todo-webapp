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

  public readonly BACKEND_QUERY_STANDBY = GenericQueryStatus.QUERY_STANDBY;
  public readonly BACKEND_QUERY_INPROGRESS = GenericQueryStatus.QUERY_INPROGRESS;
  public readonly BACKEND_QUERY_SUCCESS = GenericQueryStatus.QUERY_SUCCESS;
  public readonly BACKEND_QUERY_WARNING = GenericQueryStatus.QUERY_WARNING;
  public readonly BACKEND_QUERY_FAILURE = GenericQueryStatus.QUERY_FAILURE;

  constructor(
      private common: FfTodoCommonService,
      private router: Router,
      private alertServ: FfTodoAlertService,
      private todoServ: FfTodoAbstractRequestService,
      private cookies: CookieService) {
    this.backendRefreshStatus = this.BACKEND_QUERY_STANDBY;

    this.backendIds = this.common.getBackendIds();
  }

  public getBackendName(id: string) {
    return this.common.getBackendName(id);
  }

  public switchBackend()
  {
    this.backendRefreshStatus = this.BACKEND_QUERY_INPROGRESS;
    if (this.common.changeBackend(this.backendSelected))
    {
      setTimeout(() =>
      this.todoServ.getBoardIds().subscribe(() => {
        this.cookies.set(this.common.cookies.selectedBackend, this.backendSelected);
        this.alertServ.addAlertMessage({type: 'success', message: `Successfully switched to backend with ID (${this.backendSelected}): (${this.getBackendName(this.backendSelected)}).`});
        this.router.navigate(["/"]);
        this.common.updateBoardList();
        this.backendRefreshStatus = this.BACKEND_QUERY_SUCCESS;
      }, error => {
        this.alertServ.addAlertMessage({type: 'danger', message: `Failed to switch to backend with ID (${this.backendSelected}). See browser console for details.`});
        this.backendRefreshStatus = this.BACKEND_QUERY_FAILURE;
      }), 250);
    }
    else
    {
      this.alertServ.addAlertMessage({type: 'warning', message: `Backend with ID (${this.backendSelected}) does not exist.`});
      this.backendRefreshStatus = this.BACKEND_QUERY_WARNING;
    }
  }

  ngOnInit(): void {
    this.backendSelectedListener = this.common.backendSelectedChange.subscribe(idx => this.backendSelected = idx);
    this.backendRefreshStatusListener = this.common.backendRefreshStatusChange.subscribe(val => this.backendRefreshStatus = val);

    this.common.triggerBackend();
  }

  ngOnDestroy(): void {
    this.backendSelectedListener.unsubscribe();
    this.backendRefreshStatusListener.unsubscribe();
  }

}
