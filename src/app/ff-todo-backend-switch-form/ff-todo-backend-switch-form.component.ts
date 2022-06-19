import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Subscription } from 'rxjs';
import { FfTodoAbstractRequestService } from '../ff-todo-abstract-request.service';
import { FfTodoAlertService } from '../ff-todo-alert.service';
import { FfTodoCommonService } from '../ff-todo-common.service';

@Component({
  selector: 'app-ff-todo-backend-switch-form',
  templateUrl: './ff-todo-backend-switch-form.component.html',
  styleUrls: ['./ff-todo-backend-switch-form.component.css']
})
export class FfTodoBackendSwitchFormComponent implements OnInit, OnDestroy {

  public backendSelected!: string;
  private backendSelectedListener!: Subscription;

  public backendRefreshStatus!: Number;

  public backendIds!: string[];

  constructor(
      private common: FfTodoCommonService,
      private router: Router,
      private alertServ: FfTodoAlertService,
      private todoServ: FfTodoAbstractRequestService,
      private cookies: CookieService) {
    this.backendRefreshStatus = 2;

    this.backendIds = this.common.getBackendIds();
  }

  public getBackendName(id: string) {
    return this.common.getBackendName(id);
  }

  public switchBackend()
  {
    this.backendRefreshStatus = 0;
    if (this.common.changeBackend(this.backendSelected))
    {
      setTimeout(() =>
      this.todoServ.getBoardIds().subscribe(() => {
        this.cookies.set(this.common.cookies.selectedBackend, this.backendSelected);
        this.alertServ.addAlertMessage({type: 'success', message: `Successfully switched to backend with ID (${this.backendSelected}): (${this.getBackendName(this.backendSelected)}).`});
        this.router.navigate(["/"]);
        this.common.updateBoardList();
        this.backendRefreshStatus = 2;
      }, error => {
        this.alertServ.addAlertMessage({type: 'danger', message: `Failed to switch to backend with ID (${this.backendSelected}). See browser console for details.`});
        this.backendRefreshStatus = 3;
      }), 250);
    }
    else
    {
      this.alertServ.addAlertMessage({type: 'warning', message: `Backend with ID (${this.backendSelected}) does not exist.`});
      this.backendRefreshStatus = 1;
    }
  }

  ngOnInit(): void {
    this.backendSelectedListener = this.common.backendSelectedChange.subscribe(idx => this.backendSelected = idx);

    this.common.triggerBackend();
  }

  ngOnDestroy(): void {
    this.backendSelectedListener.unsubscribe();
  }

}
