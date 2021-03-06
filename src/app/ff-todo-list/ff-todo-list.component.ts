import { Component, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Observable, Subject, Subscription } from 'rxjs';
import { Board } from '../board';
import { BoardOperator } from '../board-operator';
import { CurrentRoutingStatus } from '../current-routing-status';
import { FfTodoAbstractRequestService } from '../ff-todo-abstract-request.service';
import { FfTodoAlertService } from '../ff-todo-alert.service';
import { FfTodoCommonService } from '../ff-todo-common.service';
import { GenericQueryStatus } from '../generic-query-status';
import { Todo } from '../todo';

@Component({
  selector: 'app-ff-todo-list',
  templateUrl: './ff-todo-list.component.html',
  styleUrls: ['./ff-todo-list.component.css']
})
export class FfTodoListComponent implements OnInit, OnDestroy, OnChanges {

  constructor(
      private todoServ: FfTodoAbstractRequestService,
      private route: ActivatedRoute,
      private router: Router,
      private common: FfTodoCommonService,
      private alertServ: FfTodoAlertService,
      private cookies: CookieService) {
    this.displayDateFormat = this.common.displayDateFormat;

    this.todoQueryStatus = this.TODO_QUERY_STANDBY;

    this.prepareSortTodoFormTrigger = [];
    this.prepareSortTaskFormTrigger = [];

    for (let phase of this.common.iterateTodoPhases())
    {
      this.prepareSortTodoFormTrigger.push(new Subject<void>());
      this.prepareSortTaskFormTrigger.push(new Subject<void>());
    }
  }

  public prepareSortTodoFormTrigger!: Array< Subject<void> >;
  public prepareSortTaskFormTrigger!: Array< Subject<void> >;

  public prepareEditBoardFormTrigger = new Subject<void>();
  public prepareViewBoardFormTrigger = new Subject<void>();
  public prepareRemoveBoardFormTrigger = new Subject<void>();

  public updateBoardListener!: Subscription;
  public updateTodoListListener!: Subscription;

  public board_details_collapse_status = false;

  public todoQueryStatus!: GenericQueryStatus;

  public dumpErrorMessage!: String;

  public boardContent!: Board;

  public boardSelected!: Number;
  public boardSelectedListener!: Subscription;

  public phaseMin!: number;
  public phaseMax!: number;
  public todoPhaseValRangeListener!: Subscription;

  public displayDateFormat!: string;
  
  public todoCount!: number;
  public todoCountListener!: Subscription;
  
  public todo_list!: Todo[][];
  public task_count!: number[];

  public readonly EDIT_BOARD = BoardOperator.EDIT;
  public readonly VIEW_BOARD = BoardOperator.VIEW;
  public readonly REMOVE_BOARD = BoardOperator.REMOVE;

  public readonly TODO_QUERY_STANDBY = GenericQueryStatus.QUERY_STANDBY;
  public readonly TODO_QUERY_INPROGRESS = GenericQueryStatus.QUERY_INPROGRESS;
  public readonly TODO_QUERY_SUCCESS = GenericQueryStatus.QUERY_SUCCESS;
  public readonly TODO_QUERY_FAILURE = GenericQueryStatus.QUERY_FAILURE;

  iterateTodoPhases() {
    return this.common.iterateTodoPhases();
  }

  getTodoPhaseLabel(idx: number) {
    return this.common.getTodoPhaseLabel(idx);
  }

  refreshTodoList() {
    this.alertServ.addAlertMessage({type:'warning', message: 'Trying to refresh all Todos...'});
    this.getTodos();
  }

  getTodoSortingButtonStatus(phase: Number) {
    return this.todo_list[phase as number].length && this.common.getIfTodoSortingExecuted(phase);
  }

  getTaskSortingButtonStatus(phase: Number) {
    return this.task_count[phase as number] && this.common.getIfTaskSortingExecuted(phase);
  }

  private updateBoard() {
    this.todoServ.getBoard(this.boardSelected as number).subscribe(board => {
      this.boardContent = board;
      this.getTodos();
    });
  }

  private getTodos(phase?: Set<Number>): void {
    var todo_results: Observable<Todo[]>;

    if (!phase)
    {
      phase = new Set<Number>([]);
    }

    todo_results = this.todoServ.getTodosFromBoard(this.boardSelected as number);

    this.todoQueryStatus = this.TODO_QUERY_INPROGRESS;

    if (phase.size == 0) {
      this.todo_list = [];
      this.task_count = [];

      for (let _phase of this.common.iterateTodoPhases()) {
        this.todo_list.push([]);
        this.task_count.push(0);

        this.common.resetTodoSortingSettings(_phase);
        this.common.resetTaskSortingSettings(_phase);
      }
    }

    todo_results.subscribe(records => {
      let todo_records = records;

      this.common.updateTodoCount(todo_records.length);

      if (!todo_records)
        todo_records = [];

      if (phase)
      if (phase.size > 0) {
        for (let _phase of phase) {
          if ((_phase >= this.phaseMin) && (_phase <= this.phaseMax)) {
            delete this.todo_list[_phase as number];

            this.todo_list[_phase as number] = [];
            this.task_count[_phase as number] = 0;

            this.common.resetTodoSortingSettings(_phase);
            this.common.resetTaskSortingSettings(_phase);
          }
        }
      }

      for (let todo of todo_records)
      {
        if (!todo.description)
        {
          todo.description = '';
        }

        if (phase)
        if (phase.size == 0)
        {
          let _phase = todo.phase;
          this.todo_list[_phase].push(todo);
        }
        else
        {
          for (let _phase of phase) {
            if ((_phase >= this.phaseMin) && (_phase <= this.phaseMax) && (todo.phase == _phase)) {
              this.todo_list[_phase as number].push(todo);
            }
          }
        }

        if (!todo.boardId)
          todo.boardId = this.boardSelected as number;

        this.task_count[todo.phase as number] += todo.tasks ? todo.tasks.length : 0;
      }

      this.todoQueryStatus = this.TODO_QUERY_SUCCESS;

      this.alertServ.addAlertMessage({type: 'success', message: `Successfully fetched Todos from Board with ID (${this.boardSelected}).`});
    }, errorMsg => {
      this.todoQueryStatus = this.TODO_QUERY_FAILURE;

      this.dumpErrorMessage = JSON.stringify(errorMsg);

      this.alertServ.addAlertMessage({type: 'danger', message: `Failed to fetch Todos from Board with ID (${this.boardSelected}).`});
    });
  }

  prepareSortTodoForm(phase_idx: number) {
    this.prepareSortTodoFormTrigger[phase_idx].next();
  }

  prepareSortTaskForm(phase_idx: number) {
    this.prepareSortTaskFormTrigger[phase_idx].next();
  }

  prepareEditBoardForm() {
    this.prepareEditBoardFormTrigger.next();
  }

  prepareViewBoardForm() {
    this.prepareViewBoardFormTrigger.next();
  }

  prepareRemoveBoardForm() {
    this.prepareRemoveBoardFormTrigger.next();
  }

  editBoard(board : Board) {
    let id = board.id;
    console.log(`Trying to update Board with ID (${id}) to (${JSON.stringify(board)})...`);
    this.todoServ.editBoard(id, board)
    .subscribe(() => {
      this.alertServ.addAlertMessage({type: 'success', message: `Successfully updated Board with ID (${id}).`});
    }, errorMsg => {
      this.alertServ.addAlertMessage({type: 'danger', message: `Failed to update Board with ID (${id}). See browser console for details.`});
    });
  }

  removeBoard(board : Board) {
    let id = board.id;
    console.log(`Trying to remove Board with ID (${id})...`);
    this.todoServ.removeBoard(id)
    .subscribe(() => {
      this.alertServ.addAlertMessage({type: 'success', message: `Successfully removed Board with ID (${id}).`});
      this.common.deleteBoardName(id);
    }, errorMsg => {
      this.alertServ.addAlertMessage({type: 'danger', message: `Failed to remove Board with ID (${id}). See browser console for details.`});
    });
  }

  ngOnInit(): void {
    this.updateBoardListener = this.common.updateBoardEvent.subscribe(() => this.updateBoard());
    this.updateTodoListListener = this.common.updateTodoListEvent.subscribe(result => this.getTodos(result));

    this.todoCountListener = this.common.todoCountChange.subscribe(result => this.todoCount = result);
    this.boardSelectedListener = this.common.boardSelectedChange.subscribe(result => {
      this.boardSelected = result;
      this.common.changePageTitle(`Todo list for Board with ID (${result})`);
      this.updateBoard();
    });

    this.todoPhaseValRangeListener = this.common.todoPhaseValRangeChange.subscribe(results => {
      this.phaseMin = results[0] as number;
      this.phaseMax = results[1] as number;
    });

    this.route.queryParams.subscribe(params => {
      var id=Number.parseInt(params.id);
      this.common.changeRouteStatus(true, false);

      if (id)
      {
        let currentRoute: CurrentRoutingStatus = { path: "/list-todos", params: [id.toString()]};
        this.cookies.set(this.common.cookies.currentRoute, JSON.stringify(currentRoute));
        this.common.setBoardSelected(id);
        this.alertServ.addAlertMessage({type: 'success', message: `Successfully redirected to Board with ID (${id}).`});
      }
      else
      {
        this.alertServ.addAlertMessage({type: 'danger', message: `Failed to redirect to Board with ID (${id}).`});
        this.common.changeRouteStatus(false, false);
        this.router.navigate([""]);
      }
    });
  }

  ngOnChanges(): void {
  }

  ngOnDestroy(): void {
    this.updateBoardListener.unsubscribe();
    this.updateTodoListListener.unsubscribe();

    this.common.changePageTitle("");

    this.todoCountListener.unsubscribe();
    this.boardSelectedListener.unsubscribe();

    this.todoPhaseValRangeListener.unsubscribe();
  }
}
