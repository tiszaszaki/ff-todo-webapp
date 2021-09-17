import { Injectable, EventEmitter, OnChanges, OnInit } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FfTodoCommonService implements OnInit, OnChanges {

  public phase_labels!: String[];
  public phaseNum!: number;

  public updateBoardEvent = new EventEmitter<void>();
  public updateTodoListEvent = new EventEmitter<void>();

  private isRoutedToTodoList!: Boolean;
  public isRoutedToTodoListChange = new EventEmitter<Boolean>();

  private boardSelected!: Number;
  public boardSelectedChange = new EventEmitter<Number>();

  private boardNameMapping!: Map<Number, String>;
  public boardNameMappingChange = new EventEmitter< Map<Number, String> >();

  public displayDateFormat!: string;
  public inputDateFormat!: string;

  public boardDescriptionMaxLength! : number;
  public todoDescriptionMaxLength! : number;

  public enableRestoreTodos!: Boolean;

  public todosearchexec!: Boolean;
  public readonlyTodo!: Boolean;
  public readonlyTask!: Boolean;

  private todoCount!: number;
  public todoCountChange = new EventEmitter<number>();

  public todo_searching_casesense!: Boolean;
  public todo_searching_highlight!: Boolean;
  public todo_searching_rules!: Map<String,String>;

  constructor() {
    this.phase_labels = ['Backlog', 'In progress', 'Done'];
    this.phaseNum = this.phase_labels.length;

    this.inputDateFormat = 'yyyy-MM-dd HH:mm:ss';
    this.displayDateFormat = 'yyyy-MM-dd HH:mm:ss.sss';

    this.todoDescriptionMaxLength = 1024;
    this.boardDescriptionMaxLength = 1024;

    this.todo_searching_casesense = false;
    this.todo_searching_highlight = false;

    this.boardNameMapping = new Map<Number,String>();
    this.todo_searching_rules = new Map<String,String>();

    this.todoCount = 0;
  }

  ngOnInit(): void {
  }

  ngOnChanges(): void {
  }

  updateBoard() {
    this.updateBoardEvent.emit();
  }

  updateTodoList() {
    this.updateTodoListEvent.emit();
  }

  updateTodoCount(val: number) {
    this.todoCount = val;
    this.todoCountChange.emit(this.todoCount);
  }

  changeRouteStatus(val: Boolean) {
    this.isRoutedToTodoList = val;
    this.isRoutedToTodoListChange.emit(this.isRoutedToTodoList);
  }

  setBoardSelected(id: Number) {
    this.boardSelected = id;
    this.boardSelectedChange.emit(this.boardSelected);
  }

  pickBoardSelected() {
    this.boardSelected = NaN;

    for (let id of this.boardNameMapping.keys())
    {
      this.boardSelected = id;
      break;
    }

    this.boardSelectedChange.emit(this.boardSelected);
  }

  addBoardName(id: Number, name: String) {
    this.boardNameMapping.set(id, name);
    this.boardNameMappingChange.emit(this.boardNameMapping);
  }

  deleteBoardName(id: Number)
  {
    this.boardNameMapping.delete(id);
    this.boardNameMappingChange.emit(this.boardNameMapping);
  }

  clearBoardNames()
  {
    this.boardNameMapping.clear();
    this.boardNameMappingChange.emit(this.boardNameMapping);
  }
}
