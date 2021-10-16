import { Component, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject, Subscription } from 'rxjs';
import { Board } from '../board';
import { BoardOperator } from '../board-operator';
import { FfTodoAbstractRequestService } from '../ff-todo-abstract-request.service';
import { FfTodoAlertService } from '../ff-todo-alert.service';
import { FfTodoCommonService } from '../ff-todo-common.service';
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
      private common: FfTodoCommonService,
      private alertServ: FfTodoAlertService) {
    this.displayDateFormat = this.common.displayDateFormat;
    
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
  public prepareRemoveBoardFormTrigger = new Subject<void>();

  public updateBoardListener!: Subscription;
  public updateTodoListListener!: Subscription;

  public board_details_collapse_status = false;

  public todoQueryFinished!: Boolean;
  public todoQuerySuccess!: Boolean;

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
  private todoCountTaskQuerySuccessful!: number;
  
  public todo_list!: Todo[][];
  public task_count!: number[];

  public readonly EDIT_BOARD = BoardOperator.EDIT;
  public readonly REMOVE_BOARD = BoardOperator.REMOVE;

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

    this.todoQuerySuccess = false;
    this.todoQueryFinished = false;

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
      this.todoCountTaskQuerySuccessful = 0;

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

      for (let todo_idx in todo_records)
      {
        let todo=todo_records[todo_idx];

        if (this.common.getRealServiceStatus())
        {
          if (!todo.tasks)
            todo.tasks = [];

          this.task_count[todo.phase as number] += todo.tasks.length;
          this.todoCountTaskQuerySuccessful++;
        }
        else
        {
          this.todoServ.getTasksFromTodo(todo.id).subscribe(tasks => {
            //todo.tasks = tasks;
            this.task_count[todo.phase as number] += tasks.length;
            this.todoCountTaskQuerySuccessful++;
          });
        }

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
      }

      this.todoQueryFinished = true;
      if (this.common.getRealServiceStatus())
      {
        if (this.todoCount > 0)
        this.todoQueryFinished &&= (this.todoCountTaskQuerySuccessful == this.todoCount);
      }

      this.todoQuerySuccess = true;
    }, errorMsg => {
      this.todoQueryFinished = true;
      this.todoQuerySuccess = false;

      this.dumpErrorMessage = JSON.stringify(errorMsg);
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

  prepareRemoveBoardForm() {
    this.prepareRemoveBoardFormTrigger.next();
  }

  editBoard(board : Board) {
    let id = board.id;
    console.log(`Trying to update Board with ID (${id}) to (${JSON.stringify(board)})...`);
    this.todoServ.editBoard(id, board)
    .subscribe(() => {
      this.alertServ.addAlertMessage({type: 'success', message: `Successfully updated Board with ID (${id}) to (${JSON.stringify(board)}).`});
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
      this.updateBoard();
    });

    this.todoPhaseValRangeListener = this.common.todoPhaseValRangeChange.subscribe(results => {
      this.phaseMin = results[0] as number;
      this.phaseMax = results[1] as number;
    });

    this.route.queryParams.subscribe(params => {
      this.common.setBoardSelected(params.id);

      this.common.changeRouteStatus(true);
    });
  }

  ngOnChanges(): void {
  }

  ngOnDestroy(): void {
    this.updateBoardListener.unsubscribe();
    this.updateTodoListListener.unsubscribe();

    this.todoCountListener.unsubscribe();
    this.boardSelectedListener.unsubscribe();

    this.todoPhaseValRangeListener.unsubscribe();
  }
}
