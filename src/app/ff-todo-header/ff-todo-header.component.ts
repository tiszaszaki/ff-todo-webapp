import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { Board } from '../board';
import { BoardOperator } from '../board-operator';
import { FfTodoAbstractRequestService } from '../ff-todo-abstract-request.service';
import { FfTodoAlertService } from '../ff-todo-alert.service';
import { FfTodoCommonService } from '../ff-todo-common.service';
import { Todo } from '../todo';
import { TodoOperator } from '../todo-operator';

@Component({
  selector: 'app-ff-todo-header',
  templateUrl: './ff-todo-header.component.html',
  styleUrls: ['./ff-todo-header.component.css', '../app.component.css']
})
export class FfTodoHeaderComponent implements OnInit, OnChanges, OnDestroy {

  @Input() title! : String;

  public pageTitle!: String;
  public pageTitleListener!: Subscription;

  public isRoutedToTodoList!: Boolean;
  public isRoutedToTodoListListener!: Subscription;
  public isRoutedToIndex!: Boolean;
  public isRoutedToIndexListener!: Subscription;

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
      private todoServ: FfTodoAbstractRequestService,
      private common: FfTodoCommonService,
      private router: Router,
      private alertServ: FfTodoAlertService) {

    this.queryFieldMaxLengths();
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
    this.isRoutedToIndexListener = this.common.isRoutedToIndexChange.subscribe(result => this.isRoutedToIndex = result);

    this.pageTitleListener = this.common.pageTitleChange.subscribe(result => this.pageTitle = result);

    this.router.navigate(["/"]);
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
    this.isRoutedToIndexListener.unsubscribe();
  }

  public defRealService() {
    return (this.common.getRealServiceStatus() !== undefined);
  }

  public isRealService() {
    return this.common.getRealServiceStatus();
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

  navigateToBoard(id: Number) {
    this.common.setBoardSelected(id);
    this.router.navigate(['/list-todos'], { queryParams: {id:this.boardSelected}});
  }

  updateSelectedBoard() {
    this.common.updateBoard();
  }

  resetTodoSearching() {
    this.common.resetTodoSearching();
  }

  queryFieldMaxLengths() {
    this.todoServ.getBoardNameMaxLength().subscribe(result => this.common.updateBoardNameMaxLength(result));
    this.todoServ.getBoardDescriptionMaxLength().subscribe(result => this.common.updateBoardDescriptionMaxLength(result));
    this.todoServ.getBoardAuthorMaxLength().subscribe(result => this.common.updateBoardAuthorMaxLength(result));

    this.todoServ.getTodoNameMaxLength().subscribe(result => this.common.updateTodoNameMaxLength(result));
    this.todoServ.getTodoDescriptionMaxLength().subscribe(result => this.common.updateTodoDescriptionMaxLength(result));

    this.todoServ.getTaskNameMaxLength().subscribe(result => this.common.updateTaskNameMaxLength(result));
  }

  queryTodoPhaseNames() {
    for (let idx of this.common.iterateTodoPhases()) {
      this.todoServ.getTodoPhaseName(idx).subscribe(result => {
        this.common.updateTodoPhaseName(idx, result);
        this.alertServ.addAlertMessage({type: 'success', message: `Successfully fetched phase name with index (${idx}).`});
      }, errorMsg => {
        this.alertServ.addAlertMessage({type: 'danger', message: `Failed to fetch phase name with index (${idx}). See browser console for details.`});
      });
    }
  }

  queryTodoPhaseRange() {
    this.todoServ.getTodoPhaseRange().subscribe(results => {
      if (results.length == 2) {
        this.common.updateTodoPhaseValRange(results[0], results[1]);
        this.common.initTodoPhaseNames();
        this.queryTodoPhaseNames();
      }
    });
  }

  queryReadonlyTodo() {
    if (this.common.getRealServiceStatus())
    {
      this.todoServ.getBoardReadonlyTodosSetting(this.boardSelected as number).subscribe(result => this.common.updateReadonlyTodo(result));
    }
    else
    {
      this.todoServ.getBoard(this.boardSelected as number).subscribe(result => {
        this.common.updateReadonlyTodo(result.readonlyTodos);
      });
    }
  }

  queryReadonlyTask() {
    if (this.common.getRealServiceStatus())
    {
      this.todoServ.getBoardReadonlyTasksSetting(this.boardSelected as number).subscribe(result => this.common.updateReadonlyTask(result));
    }
    else
    {
      this.todoServ.getBoard(this.boardSelected as number).subscribe(result => {
        this.common.updateReadonlyTask(result.readonlyTasks);
      });
    }
  }

  updateReadonlyTodo() {
    if (this.common.getRealServiceStatus())
    {
      this.todoServ.setBoardReadonlyTodosSetting(this.boardSelected as number, this.common.updateReadonlyTodo()).subscribe(() => {
        this.alertServ.addAlertMessage({type: 'success', message: `Successfully set Read-only Todos setting for Board with ID (${this.boardSelected}).`});
      }, () => {
        this.alertServ.addAlertMessage({type: 'danger', message: `Failed to set Read-only Todos setting for Board with ID (${this.boardSelected}).`});
      });
    }
    else
    {
      this.todoServ.getBoard(this.boardSelected as number).subscribe(result => {
        result.readonlyTodos = this.common.updateReadonlyTodo();
        this.todoServ.editBoard(this.boardSelected as number, result).subscribe(() => {
          this.alertServ.addAlertMessage({type: 'success', message: `Successfully set Read-only Todos setting for Board with ID (${this.boardSelected}).`});
        }, () => {
          this.alertServ.addAlertMessage({type: 'danger', message: `Failed to set Read-only Todos setting for Board with ID (${this.boardSelected}).`});
        });
      });
    }
  }

  updateReadonlyTask() {
    if (this.common.getRealServiceStatus())
    {
      this.todoServ.setBoardReadonlyTasksSetting(this.boardSelected as number, this.common.updateReadonlyTask()).subscribe(() => {
        this.alertServ.addAlertMessage({type: 'success', message: `Successfully set Read-only Tasks setting for Board with ID (${this.boardSelected}).`});
      }, () => {
        this.alertServ.addAlertMessage({type: 'danger', message: `Failed to set Read-only Tasks setting for Board with ID (${this.boardSelected}).`});
      });
    }
    else
    {
      this.todoServ.getBoard(this.boardSelected as number).subscribe(result => {
        result.readonlyTasks = this.common.updateReadonlyTask();
        this.todoServ.editBoard(this.boardSelected as number, result).subscribe(() => {
          this.alertServ.addAlertMessage({type: 'success', message: `Successfully set Read-only Tasks setting for Board with ID (${this.boardSelected}).`});
        }, () => {
          this.alertServ.addAlertMessage({type: 'danger', message: `Failed to set Read-only Tasks setting for Board with ID (${this.boardSelected}).`});
        });
      });
    }
  }

  restoreTodoList() {
    this.alertServ.addAlertMessage({type:'warning', message: 'Trying to restore all Todos...'});
  }

  addBoard(board : Board) {
    console.log(`Trying to add new Board (${JSON.stringify(board)})...`);
    this.todoServ.addBoard(board)
    .subscribe(board => {
      this.alertServ.addAlertMessage({type: 'success', message: `Successfully added new Board (${JSON.stringify(board)}).`});
      this.navigateToBoard(board.id);
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
    .subscribe(() => {
      this.alertServ.addAlertMessage({type: 'success', message: `Successfully removed all Todos from the Board with ID (${this.boardSelected}).`});
      this.common.updateTodoList();
    }, errorMsg => {
      this.alertServ.addAlertMessage({type: 'danger', message: `Failed to remove all Todos. See browser console for details.`});
    });
  }

}
