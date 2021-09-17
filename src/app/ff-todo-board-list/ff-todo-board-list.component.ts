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

  public boardNameMapping!: Map<Number, String>;
  public boardNameMappingListener!: Subscription;

  constructor(
      private todoServ: FfTodoRealRequestService,
      private common: FfTodoCommonService) {
    this.boardNameMapping = new Map<Number,String>();
  }

  ngOnInit(): void {
    this.boardNameMappingListener = this.common.boardNameMappingChange.subscribe(results => this.boardNameMapping = results);
    this.isRoutedToTodoListListener = this.common.isRoutedToTodoListChange.subscribe(result => this.isRoutedToTodoList = result);
    this.updateBoardList();
  }

  ngOnChanges(): void {
  }

  ngOnDestroy(): void {
    this.boardNameMappingListener.unsubscribe();
    this.isRoutedToTodoListListener.unsubscribe();
  }

  public gotoTodoList() {
    this.common.changeRouteStatus(true);
  }

  private updateBoardList()
  {
    this.todoServ.getBoards().subscribe(results => {
      this.common.clearBoardNames();

      for (let id of results)
      {
        this.todoServ.getBoard(id as number).subscribe(result => {
          this.boardNameMapping.set(id, result.name);
        });
      }
    });
  }

}
