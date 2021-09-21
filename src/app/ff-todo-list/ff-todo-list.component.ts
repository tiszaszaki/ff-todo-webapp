import { Component, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject, Subscription } from 'rxjs';
import { Board } from '../board';
import { BoardOperator } from '../board-operator';
import { FfTodoAlertService } from '../ff-todo-alert.service';
import { FfTodoCommonService } from '../ff-todo-common.service';
import { FfTodoRealRequestService } from '../ff-todo-real-request.service';
import { Todo } from '../todo';

@Component({
  selector: 'app-ff-todo-list',
  templateUrl: './ff-todo-list.component.html',
  styleUrls: ['./ff-todo-list.component.css']
})
export class FfTodoListComponent implements OnInit, OnDestroy, OnChanges {

  constructor(
      private todoServ: FfTodoRealRequestService,
      private route: ActivatedRoute,
      private common: FfTodoCommonService,
      private alertServ: FfTodoAlertService) {
    this.prepareSortTodoFormTrigger = [];
    this.prepareSortTaskFormTrigger = [];

    for (let phase of this.common.iterateTodoPhases())
    {
      this.prepareSortTodoFormTrigger.push(new Subject<void>());
      this.prepareSortTaskFormTrigger.push(new Subject<void>());
    }
  }

  public resetSearchTodoFormTrigger = new Subject<void>();

  public prepareSortTodoFormTrigger!: Array< Subject<void> >;
  public prepareSortTaskFormTrigger!: Array< Subject<void> >;

  public prepareEditBoardFormTrigger = new Subject<void>();
  public prepareRemoveBoardFormTrigger = new Subject<void>();

  public updateBoardListener!: Subscription;
  public updateTodoListListener!: Subscription;

  public board_details_collapse_status = false;

  public todoQuerySuccess!: Boolean;

  public boardContent!: Board;

  public boardSelected!: Number;
  public boardSelectedListener!: Subscription;

  public phaseMin!: number;
  public phaseMax!: number;
  public todoPhaseValRangeListener!: Subscription;

  public boardDescriptionMaxLength! : number;
  public boardDescriptionMaxLengthListener!: Subscription;

  public todoCount!: number;
  public todoCountListener!: Subscription;
  
  public todo_list!: Todo[][];
  public task_count!: number[];

  public todo_sorting_field: String[] = [];
  public todo_sorting_direction: Boolean[] = [];
  public todo_sorting_executed: Boolean[] = [];

  public task_sorting_field: String[] = [];
  public task_sorting_direction: Boolean[] = [];
  public task_sorting_executed: Boolean[] = [];

  public showDescriptionLength: Boolean[][] = [];
  public showTaskCount: Boolean[][] = [];
  public showDateCreated: Boolean[][] = [];

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

  updateTodoSortingField(idx : number, fieldName: String) {
    if (!this.todo_sorting_executed[idx])
    {
      this.todo_sorting_executed[idx] = true;
      console.log('Todo sorting turned ON');
    }

    this.todo_sorting_field[idx] = fieldName;
    console.log(`updateTodoSortingField(${idx}): "${this.todo_sorting_field[idx]}"`);

    this.showDescriptionLength[idx][0] = (this.todo_sorting_field[idx] == 'descriptionLength');
    this.showDateCreated[idx][0] = (this.todo_sorting_field[idx] == 'dateCreated');
    this.showTaskCount[idx][0] = (this.todo_sorting_field[idx] == 'taskCount');

    console.log(`updateTodoShowingField(${idx}, 'sorting'): [${[this.showDescriptionLength[idx][0], this.showDateCreated[idx][0], this.showTaskCount[idx][0]]}]`);
  }

  updateTodoSortingDirection(idx : number, dir: Boolean) {
    if (!this.todo_sorting_executed[idx])
    {
      this.todo_sorting_executed[idx] = true;
      console.log('Todo sorting turned ON');
    }

    this.todo_sorting_direction[idx] = dir;
    console.log(`updateTodoSortingDirection(${idx}): ${dir}`);
  }

  updateTaskSortingField(idx : number, fieldName: String) {
    if (!this.task_sorting_executed[idx])
    {
      this.task_sorting_executed[idx] = true;
      console.log('Task sorting turned ON');
    }

    this.task_sorting_field[idx] = fieldName;
    console.log(`updateTaskSortingField(${idx}): "${fieldName}"`);
  }

  updateTaskSortingDirection(idx : number, dir: Boolean) {
    if (!this.task_sorting_executed[idx])
    {
      this.task_sorting_executed[idx] = true;
      console.log('Task sorting turned ON');
    }

    this.task_sorting_direction[idx] = dir;
    console.log(`updateTaskSortingDirection(${idx}): ${dir}`);
  }

  resetTodoSorting(idx : number) {
    this.todo_sorting_field[idx] = '';
    this.todo_sorting_direction[idx] = false;

    if (this.todo_sorting_executed[idx])
    {
      this.todo_sorting_executed[idx] = false;
      console.log('Todo sorting turned OFF');
    }
  }

  resetTaskSorting(idx : number) {
    this.task_sorting_field[idx] = '';
    this.task_sorting_direction[idx] = false;

    if (this.task_sorting_executed[idx])
    {
      this.task_sorting_executed[idx] = false;
      console.log('Task sorting turned OFF');
    }
  }

  private updateBoard() {
    this.todoServ.getBoard(this.boardSelected as number).subscribe(board => {
      this.boardContent = board;
      this.getTodos();
      this.resetSearchTodoFormTrigger.next();
    });
  }

  private getTodos(phase?: Set<Number>): void {
    var todo_results: Observable<Todo[]>;
    let todoCountTemp = 0;

    if (!phase)
    {
      phase = new Set<Number>([]);
    }

    todo_results = this.todoServ.getTodosFromBoard(this.boardSelected as number);

    this.todoQuerySuccess = false;

    if (phase.size == 0) {
      this.todo_list = [];
      this.task_count = [];

      this.todo_sorting_field = [];
      this.todo_sorting_direction = [];
      this.todo_sorting_executed = [];

      this.task_sorting_field = [];
      this.task_sorting_direction = [];
      this.task_sorting_executed = [];

      for (let phase of this.common.iterateTodoPhases()) {
        this.todo_list.push([]);
        this.task_count.push(0);

        this.todo_sorting_field.push('');
        this.todo_sorting_direction.push(false);
        this.todo_sorting_executed.push(false);

        this.task_sorting_field.push('');
        this.task_sorting_direction.push(false);
        this.task_sorting_executed.push(false);

        this.showDescriptionLength.push([false,false]);
        this.showDateCreated.push([false,false]);
        this.showTaskCount.push([false,false]);
      }
    }

    todo_results.subscribe(records => {
      let todo_records = records;

      if (!todo_records)
        todo_records = [];

      this.todoQuerySuccess = true;

      if (phase)
      if (phase.size > 0) {
        for (let _phase of phase) {
          if ((_phase >= this.phaseMin) && (_phase <= this.phaseMax)) {
            delete this.todo_list[_phase as number];

            this.todo_list[_phase as number] = [];
            this.task_count[_phase as number] = 0;

            this.todo_sorting_field[_phase as number] = '';
            this.todo_sorting_direction[_phase as number] = false;
            this.todo_sorting_executed[_phase as number] = false;

            this.task_sorting_field[_phase as number] = '';
            this.task_sorting_direction[_phase as number] = false;
            this.task_sorting_executed[_phase as number] = false;
          }
        }
      }

      for (let todo_idx in todo_records)
      {
        let todo=todo_records[todo_idx];
        let taskCountPerPhase=0;

        if (todo.tasks)
        {
          taskCountPerPhase = todo.tasks.length;
        }
        else
        {
          todo.tasks = [];
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
          this.task_count[_phase] += taskCountPerPhase;
        }
        else
        {
          for (let _phase of phase) {
            if ((_phase >= this.phaseMin) && (_phase <= this.phaseMax) && (todo.phase == _phase)) {
              this.todo_list[_phase as number].push(todo);
              this.task_count[_phase as number] += taskCountPerPhase;
            }
          }
        }

        for (let todo_phase of this.todo_list)
        {
          todoCountTemp += todo_phase.length;
        }

        this.common.updateTodoCount(todoCountTemp);

        if (phase)
        if (phase.size == 0)
        {
          console.log('Filled Todo list in all phases.');
        }
        if (phase)
        if (phase.size > 0)
        {
          let phase_arr = [];
          for (let _phase of phase) { phase_arr.push(_phase); }
          phase_arr.sort();
          console.log(`Tried to fill Todo list only in phases (${phase_arr}).`);
        }
      }
    });
  }

  prepareSortTodoForm(phase_idx: number) {
    console.log(`Preparing form for sorting Todos...`);
    this.prepareSortTodoFormTrigger[phase_idx].next();
  }

  prepareSortTaskForm(phase_idx: number) {
    console.log(`Preparing form for sorting Tasks...`);
    this.prepareSortTaskFormTrigger[phase_idx].next();
  }

  prepareEditBoardForm() {
    console.log(`Preparing form for editing new Board...`);
    this.prepareEditBoardFormTrigger.next();
  }

  prepareRemoveBoardForm() {
    console.log(`Preparing form for removing new Board...`);
    this.prepareRemoveBoardFormTrigger.next();
  }

  editBoard(board : Board) {
    let id = board.id;
    console.log(`Trying to update Board with ID (${id}) to (${JSON.stringify(board)})...`);
    this.todoServ.editBoard(id, board)
    .subscribe(_ => {
      this.alertServ.addAlertMessage({type: 'success', message: `Successfully updated Board with ID (${id}) to (${JSON.stringify(board)}).`});
      this.common.updateBoard();
    }, errorMsg => {
      this.alertServ.addAlertMessage({type: 'danger', message: `Failed to update Board with ID (${id}). See browser console for details.`});
    });
  }

  removeBoard(board : Board) {
    let id = board.id;
    console.log(`Trying to remove Board with ID (${id})...`);
    this.todoServ.removeBoard(id)
    .subscribe(_ => {
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

    this.boardDescriptionMaxLengthListener = this.common.boardDescriptionMaxLengthChange.subscribe(result => {
      result = this.boardDescriptionMaxLength = result as number;
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

    this.boardDescriptionMaxLengthListener.unsubscribe();
  }
}
