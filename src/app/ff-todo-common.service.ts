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

  public readonlyTodo!: Boolean;
  public readonlyTask!: Boolean;

  private todoCount!: number;
  public todoCountChange = new EventEmitter<number>();

  private todoSearchingCaseSense!: Boolean;
  public todoSearchingCaseSenseChange = new EventEmitter<Boolean>();
  private todoSearchingHighlight!: Boolean;
  public todoSearchingHighlightChange = new EventEmitter<Boolean>();
  private todoSearchingRules!: Map<String,String>;
  public todoSearchingRulesChange = new EventEmitter< Map<String,String> >();

  constructor() {
    this.phase_labels = ['Backlog', 'In progress', 'Done'];
    this.phaseNum = this.phase_labels.length;

    this.inputDateFormat = 'yyyy-MM-dd HH:mm:ss';
    this.displayDateFormat = 'yyyy-MM-dd HH:mm:ss.sss';

    this.todoDescriptionMaxLength = 1024;
    this.boardDescriptionMaxLength = 1024;

    this.boardNameMapping = new Map<Number,String>();
    this.todoSearchingRules = new Map<String,String>();

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

  updateTodoSearchCase(val: Boolean) {
    this.todoSearchingCaseSense = val;
    this.todoSearchingCaseSenseChange.emit(this.todoSearchingCaseSense);
  }

  updateTodoSearchHighlight(val: Boolean) {
    this.todoSearchingHighlight = val;
    this.todoSearchingHighlightChange.emit(this.todoSearchingHighlight);
  }

  private updateSearchRules() {
    this.todoSearchingRulesChange.emit(this.todoSearchingRules);
  }

  hasSearchRules() {
    return (this.todoSearchingRules.size > 0);
  }

  addSearchRule(field: String, term: String) {
    this.todoSearchingRules.set(field, term);
    this.updateSearchRules();
  }

  deleteSearchRule(field: String)
  {
    this.todoSearchingRules.delete(field);
    this.updateSearchRules();
  }

  clearSearchRules()
  {
    this.todoSearchingRules.clear();
    this.updateSearchRules();
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
