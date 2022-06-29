import { Component, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FfTodoAbstractRequestService } from '../ff-todo-abstract-request.service';
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

  public updateBoardListTrigger!: Subscription;

  public boardQueryFinished!: Boolean;
  public boardQuerySuccess!: Boolean;

  public dumpErrorMessage!: String;

  public readonly BACKEND_QUERY_STANDBY = GenericQueryStatus.QUERY_STANDBY;
  public readonly BACKEND_QUERY_INPROGRESS = GenericQueryStatus.QUERY_INPROGRESS;
  public readonly BACKEND_QUERY_SUCCESS = GenericQueryStatus.QUERY_SUCCESS;
  public readonly BACKEND_QUERY_FAILURE = GenericQueryStatus.QUERY_FAILURE;

  constructor(
      private todoServ: FfTodoAbstractRequestService,
      private common: FfTodoCommonService) {
  }

  ngOnInit(): void {
    this.isRoutedToTodoListListener = this.common.isRoutedToTodoListChange.subscribe(result => this.isRoutedToTodoList = result);
    this.isRoutedToIndexListener = this.common.isRoutedToIndexChange.subscribe(result => this.isRoutedToIndex = result);

    this.updateBoardListTrigger = this.common.updateBoardListEvent.subscribe(() => this.updateBoardList());

    this.common.changePageTitle("Board list");

    this.updateBoardList();
  }

  ngOnChanges(): void {
  }

  ngOnDestroy(): void {
    this.common.changePageTitle("");

    this.isRoutedToTodoListListener.unsubscribe();
    this.isRoutedToIndexListener.unsubscribe();

    this.updateBoardListTrigger.unsubscribe();
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

  private updateBoardList()
  {
    this.boardQueryFinished = false;
    this.boardQuerySuccess = false;

    this.common.changeRouteStatus(false, false);

    this.common.changeBackendRefreshStatus(this.BACKEND_QUERY_INPROGRESS);

    this.todoServ.getBoardIds().subscribe(results => {
      let idx=0;

      this.common.clearBoardNames();

      for (let id of results)
      {
        this.todoServ.getBoard(id as number).subscribe(result => {
          this.common.addBoardName(id, result.name);
        });
        idx++;
      }

      if (idx == results.length)
      {
        this.common.changeBackendRefreshStatus(this.BACKEND_QUERY_SUCCESS);

        this.boardQueryFinished = true;
        this.boardQuerySuccess = true;

        setTimeout(() => this.common.changeBackendRefreshStatus(this.BACKEND_QUERY_STANDBY), 5000);
      }
    }, errorMsg => {
      this.common.changeBackendRefreshStatus(this.BACKEND_QUERY_FAILURE);

      this.boardQueryFinished = true;
      this.boardQuerySuccess = false;
      this.dumpErrorMessage = JSON.stringify(errorMsg);

      setTimeout(() => this.common.changeBackendRefreshStatus(this.BACKEND_QUERY_STANDBY), 5000);
    });
  }

}
