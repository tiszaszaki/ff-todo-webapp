import { Injectable, EventEmitter, OnChanges, OnInit } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FfTodoCommonService implements OnInit, OnChanges {

  public phase_labels!: String[];

  private phaseRange!: Array<Number>;
  public todoPhaseValRangeChange = new EventEmitter< Array<Number> >();

  public updateBoardEvent = new EventEmitter<void>();
  public updateTodoListEvent = new EventEmitter<void>();
  public updateBoardListEvent = new EventEmitter<void>();

  private isRoutedToTodoList!: Boolean;
  public isRoutedToTodoListChange = new EventEmitter<Boolean>();

  private boardSelected!: Number;
  public boardSelectedChange = new EventEmitter<Number>();

  private boardNameMapping!: Map<Number, String>;
  public boardNameMappingChange = new EventEmitter< Map<Number, String> >();

  public displayDateFormat!: string;
  public inputDateFormat!: string;

  private boardDescriptionMaxLength! : Number;
  public boardDescriptionMaxLengthChange = new EventEmitter<Number>();
  private todoDescriptionMaxLength! : Number;
  public todoDescriptionMaxLengthChange = new EventEmitter<Number>();

  public enableRestoreTodos!: Boolean;

  private readonlyTodo!: Boolean;
  public readonlyTodoChange = new EventEmitter<Boolean>();
  private readonlyTask!: Boolean;
  public readonlyTaskChange = new EventEmitter<Boolean>();

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

    this.inputDateFormat = 'yyyy-MM-dd HH:mm:ss';
    this.displayDateFormat = 'yyyy-MM-dd HH:mm:ss.sss';

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

  updateBoardList() {
    this.updateBoardListEvent.emit();
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

  updateBoardDescriptionMaxLength(val: Number) {
    if (val > 0)
    {
      this.boardDescriptionMaxLength = val;
      this.boardDescriptionMaxLengthChange.emit(this.boardDescriptionMaxLength);
    }
  }

  triggerBoardDescriptionMaxLength() {
    this.boardDescriptionMaxLengthChange.emit(this.boardDescriptionMaxLength);
  }

  updateTodoDescriptionMaxLength(val: Number) {
    if (val > 0)
    {
      this.todoDescriptionMaxLength = val;
      this.todoDescriptionMaxLengthChange.emit(this.todoDescriptionMaxLength);
    }
  }

  triggerTodoDescriptionMaxLength() {
    this.todoDescriptionMaxLengthChange.emit(this.todoDescriptionMaxLength);
  }

  updateTodoPhaseValRange(minVal: Number, maxVal: Number) {
    this.phaseRange = [minVal,maxVal];
    this.todoPhaseValRangeChange.emit(this.phaseRange);
  }

  triggerTodoPhaseValRange() {
    this.todoPhaseValRangeChange.emit(this.phaseRange);
  }

  updateReadonlyTodo(val?: Boolean): Boolean {
    if (val !== undefined)
      this.readonlyTodo = val;
    else
      this.readonlyTodo = !this.readonlyTodo;

    this.readonlyTodoChange.emit(this.readonlyTodo);
    return this.readonlyTodo;
  }

  updateReadonlyTask(val?: Boolean): Boolean {
    if (val !== undefined)
      this.readonlyTask = val;
    else
      this.readonlyTask = !this.readonlyTask;

    this.readonlyTaskChange.emit(this.readonlyTask);
    return this.readonlyTask;
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
