import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Subject } from 'rxjs';
import { Board } from '../board';
import { BoardOperator } from '../board-operator';
import { FfTodoCommonService } from '../ff-todo-common.service';
import { FfTodoRealRequestService } from '../ff-todo-real-request.service';
import { TiszaSzakiAlert } from '../tsz-alert';

@Component({
  selector: 'app-ff-todo-header',
  templateUrl: './ff-todo-header.component.html',
  styleUrls: ['./ff-todo-header.component.css', '../app.component.css']
})
export class FfTodoHeaderComponent implements OnInit, OnChanges {

  constructor(
      private todoServ: FfTodoRealRequestService,
      private common: FfTodoCommonService) {
    this.boardDescriptionMaxLength = this.common.boardDescriptionMaxLength;
  }

  @Input() title! : String;

  @Input() todosearchexec!: Boolean;
  @Input() readonlyTodo!: Boolean;
  @Input() readonlyTask!: Boolean;

  @Input() todo_count!: number;
  @Input() enableRestoreTodos!: Boolean;

  @Input() boardNameMapping!: Map<Number, String>;

  @Output() updateSelectedBoard = new EventEmitter<Number>();

  @Output() prepareAddTodoForm = new EventEmitter<void>();
  @Output() prepareRemovingAllTodos = new EventEmitter<void>();
  @Output() initTodoList = new EventEmitter<void>();
  @Output() restoreTodoList = new EventEmitter<void>();

  @Output() prepareSearchTodoForm = new EventEmitter<void>();

  @Output() toggleReadonlyTodo = new EventEmitter<Boolean>();
  @Output() toggleReadonlyTask = new EventEmitter<Boolean>();

  @Output() addAlertMessage = new EventEmitter<TiszaSzakiAlert>();

  public readonly ADD_BOARD = BoardOperator.ADD;

  public boardDescriptionMaxLength! : number;

  public prepareAddBoardFormTrigger = new Subject<void>();

  public boardSelected!: Number;
  public toolbar_collapse_status = false;

  updateReadonlyTodo() {
    this.readonlyTodo = !this.readonlyTodo;
    this.toggleReadonlyTodo.emit(this.readonlyTodo);
  }

  updateReadonlyTask() {
    this.readonlyTask = !this.readonlyTask;
    this.toggleReadonlyTask.emit(this.readonlyTask);
  }

  ngOnInit(): void {
  }

  prepareAddBoardForm() {
    console.log(`Preparing form for adding new Board...`);
    this.prepareAddBoardFormTrigger.next();
  }

  addBoard(board : Board) {
    console.log(`Trying to add new Board (${JSON.stringify(board)})...`);
    this.todoServ.addBoard(board)
    .subscribe(board => {
      this.addAlertMessage.emit({type: 'success', message: `Successfully added new Board (${JSON.stringify(board)}).`});
      //this.updateBoardList();
    }, errorMsg => {
      this.addAlertMessage.emit({type: 'danger', message: `Failed to add new Board. See browser console for details.`});
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.boardNameMapping)
    {
      this.boardSelected = NaN;
      for (let id of this.boardNameMapping.keys())
      {
        this.boardSelected = id;
        this.updateSelectedBoard.emit(this.boardSelected);
        break;
      }
    }
  }

}
