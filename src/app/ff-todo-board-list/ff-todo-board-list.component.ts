import { Component, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Subscription } from 'rxjs';
import { CurrentRoutingStatus } from '../current-routing-status';
import { FfTodoAbstractRequestService } from '../ff-todo-abstract-request.service';
import { FfTodoAlertService } from '../ff-todo-alert.service';
import { FfTodoCommonService } from '../ff-todo-common.service';
import { GenericQueryStatus } from '../generic-query-status';

@Component({
  selector: 'app-ff-todo-board-list',
  templateUrl: './ff-todo-board-list.component.html',
  styleUrls: ['./ff-todo-board-list.component.css']
})
export class FfTodoBoardListComponent implements OnInit, OnChanges, OnDestroy {

  public isRoutedToTodoList!: Boolean;
  public isRoutedToTodoListListener!: Subscription;
  public isRoutedToIndex!: Boolean;
  public isRoutedToIndexListener!: Subscription;

  private backendSelected!: string;
  private backendSelectedListener!: Subscription;

  public backendRefreshStatus!: Number;
  public backendRefreshStatusListener!: Subscription;

  public updateBoardListTrigger!: Subscription;

  public dumpErrorMessage!: String;

  public readonly BACKEND_QUERY_STANDBY = GenericQueryStatus.QUERY_STANDBY;
  public readonly BACKEND_QUERY_INPROGRESS = GenericQueryStatus.QUERY_INPROGRESS;
  public readonly BACKEND_QUERY_SUCCESS = GenericQueryStatus.QUERY_SUCCESS;
  public readonly BACKEND_QUERY_FAILURE = GenericQueryStatus.QUERY_FAILURE;

  constructor(
      private route: ActivatedRoute,
      private alertServ: FfTodoAlertService,
      private todoServ: FfTodoAbstractRequestService,
      private common: FfTodoCommonService,
      private cookies: CookieService) {
  }

  ngOnInit(): void {
    this.isRoutedToTodoListListener = this.common.isRoutedToTodoListChange.subscribe(result => this.isRoutedToTodoList = result);
    this.isRoutedToIndexListener = this.common.isRoutedToIndexChange.subscribe(result => this.isRoutedToIndex = result);

    this.updateBoardListTrigger = this.common.updateBoardListEvent.subscribe(backendIdx => this.updateBoardList(backendIdx));

    this.backendSelectedListener = this.common.backendSelectedChange.subscribe(idx => this.backendSelected = idx);
    this.backendRefreshStatusListener = this.common.backendRefreshStatusChange.subscribe(val => this.backendRefreshStatus = val);

    this.route.queryParams.subscribe(() => {
      let currentRoute: CurrentRoutingStatus = { path: '/list-boards', params: []};
      this.cookies.set(this.common.cookies.currentRoute, JSON.stringify(currentRoute));
    });

    this.common.changePageTitle("Board list");

    this.common.triggerBackend();

    this.updateBoardList();
  }

  ngOnChanges(): void {
  }

  ngOnDestroy(): void {
    this.common.changePageTitle("");

    this.isRoutedToTodoListListener.unsubscribe();
    this.isRoutedToIndexListener.unsubscribe();

    this.updateBoardListTrigger.unsubscribe();

    this.backendSelectedListener.unsubscribe();
    this.backendRefreshStatusListener.unsubscribe();
  }

  getBoardListSize() {
    return this.common.getBoardListSize();
  }

  iterateBoardList() {
    return this.common.iterateBoardList();
  }

  getBoardName(idx: number) {
    return this.common.getBoardName(idx);
  }

  private updateBoardList(backendIdx?: string)
  {
    let timeoutDuration = 100;
    this.common.changeRouteStatus(false, false);

    if (backendIdx !== undefined)
    {
      this.common.changeBackend(backendIdx);
      timeoutDuration = 250;
    }

    setTimeout(() => {
      this.common.changeBackendRefreshStatus(this.BACKEND_QUERY_INPROGRESS);

      this.common.clearBoardNames();

      this.todoServ.getBoardIds().subscribe(results => {
        let idx=0;

        for (let id of results)
        {
          this.todoServ.getBoard(id as number).subscribe(result => {
            this.common.addBoardName(id, result.name);
          });
          idx++;
        }

        if (idx == results.length)
        {
          this.cookies.set(this.common.cookies.selectedBackend, this.backendSelected);

          this.common.changeBackendRefreshStatus(this.BACKEND_QUERY_SUCCESS);

          setTimeout(() => this.common.changeBackendRefreshStatus(this.BACKEND_QUERY_STANDBY), 5000);

          this.alertServ.addAlertMessage({type: 'success', message: `Successfully switched to backend with ID (${this.backendSelected}): (${this.common.getBackendName(this.backendSelected)}).`});
        }
      }, errorMsg => {
        this.common.changeBackendRefreshStatus(this.BACKEND_QUERY_FAILURE);

        this.dumpErrorMessage = JSON.stringify(errorMsg);

        setTimeout(() => {
          this.common.changeBackendRefreshStatus(this.BACKEND_QUERY_STANDBY);
          this.common.changeBackend('');
        }, 5000);

        this.alertServ.addAlertMessage({type: 'danger', message: `Failed to switch to backend with ID (${this.backendSelected}). See browser console for details.`});
      });
    }, timeoutDuration);
  }

}
