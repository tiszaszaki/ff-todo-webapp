import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FfTodoAbstractRequestService } from '../ff-todo-abstract-request.service';
import { FfTodoCommonService } from '../ff-todo-common.service';

@Component({
  selector: 'app-ff-todo-index',
  templateUrl: './ff-todo-index.component.html',
  styleUrls: ['./ff-todo-index.component.css']
})
export class FfTodoIndexComponent implements OnInit {

  private todoNameMapping!: Map<Number, String>;
  private todoParentMapping!: Map<Number, Number>;

  public todoQueryFinished!: Boolean;
  public todoQuerySuccess!: Boolean;

  public dumpErrorMessage!: String;

  constructor(
      private todoServ: FfTodoAbstractRequestService,
      private route: ActivatedRoute,
      private common: FfTodoCommonService) {
    this.todoNameMapping = new Map<Number,String>();
    this.todoParentMapping = new Map<Number,Number>();
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(_ => {
      this.common.changeRouteStatus(false, true);
    });

    this.updateTodoList();
  }

  getTodoListSize() {
    return this.todoNameMapping.size;
  }

  iterateTodoList(): Array<number> {
    let result: Array<number> = [];

    for (let id of this.todoNameMapping.keys())
    {
      result.push(id as number);
    }

    return result.sort();
  }

  getTodoName(id: Number): String {
    let result: String = "<unknown todo>";

    if (this.todoNameMapping.has(id))
    {
      result = this.todoNameMapping.get(id)!;
    }

    return result;
  }

  getTodoParent(id: Number): Number {
    let result: Number = -1;

    if (this.todoNameMapping.has(id))
    {
      result = this.todoParentMapping.get(id)!;
    }

    return result;
  }

  clearTodoNames()
  {
    this.todoNameMapping.clear();
  }

  addTodoEntry(id: Number, name: String, boardId?: Number)
  {
    let _boardId=(boardId ? boardId : -1);
    this.todoNameMapping.set(id, name);
    this.todoParentMapping.set(id, _boardId);
  }

  private updateTodoList()
  {
    this.todoQueryFinished = false;
    this.todoQuerySuccess = false;

    this.todoServ.getTodos().subscribe(results => {
      let idx=0;

      this.clearTodoNames();

      for (let todo of results)
      {
        this.addTodoEntry(todo.id, todo.name, todo.boardId);
        idx++;
      }

      if (idx == results.length)
      {
        this.todoQueryFinished = true;
        this.todoQuerySuccess = true;
      }
    }, errorMsg => {
      this.todoQueryFinished = true;
      this.todoQuerySuccess = false;
      this.dumpErrorMessage = JSON.stringify(errorMsg);
    });
  }
}
