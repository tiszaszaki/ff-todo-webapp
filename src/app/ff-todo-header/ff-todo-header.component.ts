import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { Board } from '../board';
import { BoardOperator } from '../board-operator';
import { FfTodoAlertService } from '../ff-todo-alert.service';
import { FfTodoCommonService } from '../ff-todo-common.service';
import { FfTodoRealRequestService } from '../ff-todo-real-request.service';
import { Todo } from '../todo';
import { TodoOperator } from '../todo-operator';

@Component({
  selector: 'app-ff-todo-header',
  templateUrl: './ff-todo-header.component.html',
  styleUrls: ['./ff-todo-header.component.css', '../app.component.css']
})
export class FfTodoHeaderComponent implements OnInit, OnChanges, OnDestroy {

  @Input() title! : String;

  public isRoutedToTodoList!: Boolean;
  public isRoutedToTodoListListener!: Subscription;

  public readonlyTodo!: Boolean;
  public readonlyTodoListener!: Subscription;
  public readonlyTask!: Boolean;
  public readonlyTaskListener!: Subscription;

  public boardSelected!: Number;
  public boardSelectedListener!: Subscription;

  public todoCount!: number;
  public todoCountListener!: Subscription;

  public enableRestoreTodos!: Boolean;
  public enableRestoreTodosListener!: Subscription;

  public prepareAddBoardFormTrigger = new Subject<void>();

  public prepareAddTodoFormTrigger = new Subject<void>();

  public prepareSearchTodoFormTrigger = new Subject<void>();
  public resetSearchTodoFormTrigger = new Subject<void>();

  public prepareRemoveAllTodosFormTrigger = new Subject<void>();

  public toolbar_collapse_status = false;

  public readonly ADD_TODO = TodoOperator.ADD;
  public readonly ADD_BOARD = BoardOperator.ADD;
  public readonly REMOVE_ALL_TODOS = TodoOperator.REMOVE_ALL;

  constructor(
      private todoServ: FfTodoRealRequestService,
      private common: FfTodoCommonService,
      private alertServ: FfTodoAlertService) {

    this.queryDescriptionMaxLengths();
    this.queryTodoPhaseRange();

    this.common.updateEnableRestoreTodos(false);
  }

  ngOnInit(): void {
    this.boardSelectedListener = this.common.boardSelectedChange.subscribe(result => {
      this.boardSelected = result;

      this.queryReadonlyTodo();
      this.queryReadonlyTask();
    });
    this.todoCountListener = this.common.todoCountChange.subscribe(result => this.todoCount = result);

    this.enableRestoreTodosListener = this.common.enableRestoreTodosChange.subscribe(result => this.enableRestoreTodos = result);
    this.readonlyTodoListener = this.common.readonlyTodoChange.subscribe(result => this.readonlyTodo = result);
    this.readonlyTaskListener = this.common.readonlyTaskChange.subscribe(result => this.readonlyTask = result);

    this.isRoutedToTodoListListener = this.common.isRoutedToTodoListChange.subscribe(result => this.isRoutedToTodoList = result);
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  ngOnDestroy(): void {
    this.boardSelectedListener.unsubscribe();
    this.todoCountListener.unsubscribe();

    this.enableRestoreTodosListener.unsubscribe();
    this.readonlyTodoListener.unsubscribe();
    this.readonlyTaskListener.unsubscribe();

    this.isRoutedToTodoListListener.unsubscribe();
  }

  refreshTodoList() {
    this.common.updateTodoList();
  }

  prepareAddBoardForm() {
    this.prepareAddBoardFormTrigger.next();
  }

  prepareAddTodoForm() {
    this.prepareAddTodoFormTrigger.next();
  }

  prepareSearchTodoForm() {
    this.prepareSearchTodoFormTrigger.next();
  }

  resetSearchTodoForm() {
    this.resetSearchTodoFormTrigger.next();

    this.common.clearSearchRules();
  }

  prepareRemovingAllTodos() {
    this.prepareRemoveAllTodosFormTrigger.next();
  }

  isTodoSearchExec() {
    return this.common.hasSearchRules();
  }

  updateBoardList() {
    this.common.updateBoardList();
  }

  updateSelectedBoard() {
    this.common.updateBoard();
  }

  queryDescriptionMaxLengths() {
    this.todoServ.getBoardDescriptionMaxLength().subscribe(result => this.common.updateBoardDescriptionMaxLength(result));
    this.todoServ.getTodoDescriptionMaxLength().subscribe(result => this.common.updateTodoDescriptionMaxLength(result));
  }

  queryTodoPhaseRange() {
    this.todoServ.getTodoPhaseRange().subscribe(results => {
      if (results.length == 2)
        this.common.updateTodoPhaseValRange(results[0], results[1]);
    });
  }

  queryReadonlyTodo() {
    this.todoServ.getBoardReadonlyTodosSetting(this.boardSelected as number).subscribe(result => this.common.updateReadonlyTodo(result));
  }

  queryReadonlyTask() {
    this.todoServ.getBoardReadonlyTasksSetting(this.boardSelected as number).subscribe(result => this.common.updateReadonlyTask(result));
  }

  updateReadonlyTodo() {
    this.todoServ.setBoardReadonlyTodosSetting(this.boardSelected as number, this.common.updateReadonlyTodo()).subscribe(() => {
      this.alertServ.addAlertMessage({type: 'success', message: `Successfully set Read-only Todos setting for Board with ID (${this.boardSelected}).`});
    }, () => {
      this.alertServ.addAlertMessage({type: 'danger', message: `Failed to set Read-only Todos setting for Board with ID (${this.boardSelected}).`});
    });
  }

  updateReadonlyTask() {
    this.todoServ.setBoardReadonlyTasksSetting(this.boardSelected as number, this.common.updateReadonlyTask()).subscribe(() => {
      this.alertServ.addAlertMessage({type: 'success', message: `Successfully set Read-only Tasks setting for Board with ID (${this.boardSelected}).`});
    }, () => {
      this.alertServ.addAlertMessage({type: 'danger', message: `Failed to set Read-only Tasks setting for Board with ID (${this.boardSelected}).`});
    });
  }

  restoreTodoList() {
    this.alertServ.addAlertMessage({type:'warning', message: 'Trying to restore all Todos...'});
  }

  addBoard(board : Board) {
    console.log(`Trying to add new Board (${JSON.stringify(board)})...`);
    this.todoServ.addBoard(board)
    .subscribe(board => {
      this.alertServ.addAlertMessage({type: 'success', message: `Successfully added new Board (${JSON.stringify(board)}).`});
      this.updateBoardList();
    }, errorMsg => {
      this.alertServ.addAlertMessage({type: 'danger', message: `Failed to add new Board. See browser console for details.`});
    });
  }

  addTodo(todo : Todo) {
    console.log(`Trying to add new Todo (${JSON.stringify(todo)}) to Board with ID (${this.boardSelected})...`);
    this.todoServ.addTodo(this.boardSelected as number, todo)
    .subscribe(todo => {
      this.alertServ.addAlertMessage({type: 'success', message: `Successfully added new Todo (${JSON.stringify(todo)}) to Board with ID (${this.boardSelected}).`});
      this.common.updateTodoList();
    }, errorMsg => {
      this.alertServ.addAlertMessage({type: 'danger', message: `Failed to add new Todo. See browser console for details.`});
    });
  }

  removeAllTodos() {
    console.log(`Trying to remove all Todos from Board with ID (${this.boardSelected})...`);
    this.todoServ.removeAllTodos(this.boardSelected as number)
    .subscribe(_ => {
      this.alertServ.addAlertMessage({type: 'success', message: `Successfully removed all Todos from the Board with ID (${this.boardSelected}).`});
      this.common.updateTodoList();
    }, errorMsg => {
      this.alertServ.addAlertMessage({type: 'danger', message: `Failed to remove all Todos. See browser console for details.`});
    });
  }

}
