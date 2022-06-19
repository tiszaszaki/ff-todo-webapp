import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Subscription } from 'rxjs';
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

  public backendIds!: string[];

  constructor(
      private common: FfTodoCommonService,
      private router: Router,
      private alertServ: FfTodoAlertService,
      private cookies: CookieService) {
    this.backendIds = this.common.getBackendIds();
  }

  public getBackendName(id: string) {
    return this.common.getBackendName(id);
  }

  public switchBackend()
  {
    if (this.common.changeBackend(this.backendSelected))
    {
      this.cookies.set(this.common.cookies.selectedBackend, this.backendSelected);
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

    this.common.triggerBackend();
  }

  ngOnDestroy(): void {
    this.backendSelectedListener.unsubscribe();
  }

}
