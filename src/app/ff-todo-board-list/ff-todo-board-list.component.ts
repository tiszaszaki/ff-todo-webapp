import { Component, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FfTodoCommonService } from '../ff-todo-common.service';
import { FfTodoRealRequestService } from '../ff-todo-real-request.service';

@Component({
  selector: 'app-ff-todo-board-list',
  templateUrl: './ff-todo-board-list.component.html',
  styleUrls: ['./ff-todo-board-list.component.css']
})
export class FfTodoBoardListComponent implements OnInit, OnChanges, OnDestroy {

  public isRoutedToTodoList!: Boolean;
  public isRoutedToTodoListListener!: Subscription;

  public updateBoardListTrigger!: Subscription;

  public boardQueryFinished!: Boolean;
  public boardQuerySuccess!: Boolean;

  constructor(
      private todoServ: FfTodoRealRequestService,
      private common: FfTodoCommonService) {
  }

  ngOnInit(): void {
    this.isRoutedToTodoListListener = this.common.isRoutedToTodoListChange.subscribe(result => this.isRoutedToTodoList = result);

    this.updateBoardListTrigger = this.common.updateBoardListEvent.subscribe(id => this.updateBoardList(id));

    this.updateBoardList();
  }

  ngOnChanges(): void {
  }

  ngOnDestroy(): void {
    this.isRoutedToTodoListListener.unsubscribe();

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

  private updateBoardList(board_id?: Number)
  {
    this.boardQueryFinished = false;
    this.boardQuerySuccess = false;

    this.common.changeRouteStatus(false);

    this.todoServ.getBoards().subscribe(results => {
      let idx=0;

      this.common.clearBoardNames();

      this.boardQueryFinished = true;
      this.boardQuerySuccess = true;

      for (let id of results)
      {
        this.todoServ.getBoard(id as number).subscribe(result => {
          this.common.addBoardName(id, result.name);
        });

        idx++;
        if (idx == results.length)
        {
          if (board_id)
            this.common.navigateToBoard(board_id);
        }
      }
    }, errorMsg => {
      this.boardQueryFinished = true;
      this.boardQuerySuccess = false;
    });
  }

}
