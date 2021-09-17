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

  public todosearchexec!: Boolean;
  public readonlyTodo!: Boolean;
  public readonlyTask!: Boolean;

  public boardSelected!: Number;
  public boardSelectedListener!: Subscription;

  public phase_labels!: String[];
  public phaseNum!: number;

  public todoCount!: number;
  public todoCountListener!: Subscription;

  public enableRestoreTodos!: Boolean;

  public boardDescriptionMaxLength! : number;
  public todoDescriptionMaxLength! : number;

  public inputDateFormat!: string;

  public prepareAddBoardFormTrigger = new Subject<void>();

  public prepareAddTodoFormTrigger = new Subject<void>();
  public prepareSearchTodoFormTrigger = new Subject<void>();
  public prepareRemoveAllTodosFormTrigger = new Subject<void>();

  public todo_searching_casesense!: Boolean;

  public toolbar_collapse_status = false;

  public readonly ADD_TODO = TodoOperator.ADD;
  public readonly ADD_BOARD = BoardOperator.ADD;
  public readonly REMOVE_ALL_TODOS = TodoOperator.REMOVE_ALL;

  constructor(
      private todoServ: FfTodoRealRequestService,
      private common: FfTodoCommonService,
      private alertServ: FfTodoAlertService) {

    this.boardDescriptionMaxLength = this.common.boardDescriptionMaxLength;
    this.todoDescriptionMaxLength = this.common.todoDescriptionMaxLength;

    this.todosearchexec = this.common.todosearchexec;
    this.readonlyTodo = this.common.readonlyTodo;
    this.readonlyTask = this.common.readonlyTask;

    this.enableRestoreTodos = this.common.enableRestoreTodos;

    this.phase_labels = this.common.phase_labels;
    this.phaseNum = this.common.phaseNum;

    this.inputDateFormat = this.common.inputDateFormat;

    this.isRoutedToTodoList = false;
  }

  ngOnInit(): void {
    this.boardSelectedListener = this.common.boardSelectedChange.subscribe(result => this.boardSelected = result);
    this.isRoutedToTodoListListener = this.common.isRoutedToTodoListChange.subscribe(result => this.isRoutedToTodoList = result);
    this.todoCountListener = this.common.todoCountChange.subscribe(result => this.todoCount = result);
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  ngOnDestroy(): void {
    this.boardSelectedListener.unsubscribe();
    this.isRoutedToTodoListListener.unsubscribe();
    this.todoCountListener.unsubscribe();
  }

  refreshTodoList() {
    this.common.updateTodoList();
  }

  prepareAddBoardForm() {
    console.log(`Preparing form for adding new Board...`);
    this.prepareAddBoardFormTrigger.next();
  }

  prepareAddTodoForm() {
    console.log(`Preparing form for adding new Todo...`);
    this.prepareAddTodoFormTrigger.next();
  }

  prepareSearchTodoForm() {
    console.log(`Preparing form for searching Todos...`);
    this.prepareSearchTodoFormTrigger.next();
  }

  prepareRemovingAllTodos() {
    console.log(`Preparing form for removing all Todos...`);
    this.prepareRemoveAllTodosFormTrigger.next();
  }

  resetSearchForm() {
  }

  returnToBoardList() {
    this.common.changeRouteStatus(false);
  }

  updateSelectedBoard() {
    this.common.updateBoard();
  }

  updateReadonlyTodo() {
    this.todoServ.setBoardReadonlyTodosSetting(this.boardSelected as number, !this.readonlyTodo).subscribe(_ => {});
  }

  updateReadonlyTask() {
    this.todoServ.setBoardReadonlyTasksSetting(this.boardSelected as number, !this.readonlyTask).subscribe(_ => {});
  }

  restoreTodoList() {
    this.alertServ.addAlertMessage({type:'warning', message: 'Trying to restore all Todos...'});
  }

  addBoard(board : Board) {
    console.log(`Trying to add new Board (${JSON.stringify(board)})...`);
    this.todoServ.addBoard(board)
    .subscribe(board => {
      this.alertServ.addAlertMessage({type: 'success', message: `Successfully added new Board (${JSON.stringify(board)}).`});
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
    this.todoServ.removeAllTodos(this.boardSelected as number)
    .subscribe(_ => {
      this.alertServ.addAlertMessage({type: 'success', message: `Successfully removed all Todos from the Board with ID (${this.boardSelected}).`});
      this.common.updateTodoList();
    }, errorMsg => {
      this.alertServ.addAlertMessage({type: 'danger', message: `Failed to remove all Todos. See browser console for details.`});
    });
  }

}
