import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FfTodoAbstractRequestService } from '../ff-todo-abstract-request.service';
import { FfTodoCommonService } from '../ff-todo-common.service';

@Component({
  selector: 'app-ff-todo-task-index',
  templateUrl: './ff-todo-task-index.component.html',
  styleUrls: ['./ff-todo-task-index.component.css']
})
export class FfTodoTaskIndexComponent implements OnInit {

  private taskNameMapping!: Map<Number, String>;
  private taskParentMapping!: Map<Number, Number>;

  private todoParentMapping!: Map<Number, Number>;

  public taskQueryFinished!: Boolean;
  public taskQuerySuccess!: Boolean;

  public dumpErrorMessage!: String;

  constructor(
      private todoServ: FfTodoAbstractRequestService,
      private route: ActivatedRoute,
      private common: FfTodoCommonService) {
    this.taskNameMapping = new Map<Number,String>();
    this.taskParentMapping = new Map<Number,Number>();

    this.todoParentMapping = new Map<Number,Number>();
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(_ => {
      this.common.changeRouteStatus(false, true);
    });

    this.updateTaskList();
  }

  getTaskListSize() {
    return this.taskNameMapping.size;
  }

  iterateTaskList(): Array<number> {
    let result: Array<number> = [];

    for (let id of this.taskNameMapping.keys())
    {
      result.push(id as number);
    }

    return result.sort();
  }

  getTaskName(id: Number): String {
    let result: String = "<unknown task>";

    if (this.taskNameMapping.has(id))
    {
      result = this.taskNameMapping.get(id)!;
    }

    return result;
  }

  hasTaskGrandparent(id: Number): Boolean {
    var result=this.hasTaskParent(id);

    if (result)
    {
      result &&= (this.todoParentMapping.has(this.getTaskParent(id)));
    }

    return result;
  }

  hasTaskParent(id: Number): Boolean {
    return this.taskParentMapping.has(id);
  }

  getTaskGrandparent(id: Number): Number {
    let result: Number = -1;

    result = this.todoParentMapping.get(this.getTaskParent(id))!;

    return result;
  }

  getTaskParent(id: Number): Number {
    let result: Number = -1;

    if (this.taskNameMapping.has(id))
    {
      result = this.taskParentMapping.get(id)!;
    }

    return result;
  }

  clearTaskNames()
  {
    this.taskNameMapping.clear();
  }

  addTodoParent(todoId: Number)
  {
    this.todoServ.getTodo(Number(todoId)).subscribe(todo => {
      let _boardId=(todo.boardId ? todo.boardId : -1);
      this.todoParentMapping.set(todoId, _boardId);
    });
  }

  addTaskEntry(id: Number, name: String, todoId?: Number)
  {
    this.taskNameMapping.set(id, name);
    if (todoId)
    {
      this.taskParentMapping.set(id, todoId);
      this.addTodoParent(todoId);
    }
  }

  private updateTaskList()
  {
    this.taskQueryFinished = false;
    this.taskQuerySuccess = false;

    this.todoServ.getTasks().subscribe(results => {
      let idx=0;

      this.clearTaskNames();

      for (let task of results)
      {
        this.addTaskEntry(task.id, task.name, task.todoId);
        idx++;
      }

      if (idx == results.length)
      {
        this.taskQueryFinished = true;
        this.taskQuerySuccess = true;
      }
    }, errorMsg => {
      this.taskQueryFinished = true;
      this.taskQuerySuccess = false;
      this.dumpErrorMessage = JSON.stringify(errorMsg);
    });
  }
}
