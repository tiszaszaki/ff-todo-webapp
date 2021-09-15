import { Component, OnInit } from '@angular/core';
import { FfTodoRealRequestService } from '../ff-todo-real-request.service';

@Component({
  selector: 'app-ff-todo-board-list',
  templateUrl: './ff-todo-board-list.component.html',
  styleUrls: ['./ff-todo-board-list.component.css']
})
export class FfTodoBoardListComponent implements OnInit {

  constructor(private todoServ: FfTodoRealRequestService) { }

  public boardNameMapping!: Map<Number, String>;

  ngOnInit(): void {
  }

  private updateBoardList()
  {
    this.todoServ.getBoards().subscribe(results => {
      let idx=0;

      this.boardNameMapping = new Map<Number, String>();

      for (let id of results)
      {
        this.todoServ.getBoard(id as number).subscribe(result => {
          this.boardNameMapping.set(id, result.name);
          idx++;
          if (idx == results.length)
          {
            
          }
        });
      }
    });
  }

}
