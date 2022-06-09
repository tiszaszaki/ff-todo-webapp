import { Injectable, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class FfTodoCommonService {

  private phase_labels!: String[];

  private phaseRange!: Array<Number>;
  public todoPhaseValRangeChange = new EventEmitter< Array<Number> >();

  public updateTodoEvent = new EventEmitter<Number>();
  public updateBoardEvent = new EventEmitter<void>();
  public updateTodoListEvent = new EventEmitter< Set<Number> >();
  public updateBoardListEvent = new EventEmitter<void>();

  private pageTitle!: String;
  public pageTitleChange = new EventEmitter<String>();

  private isRoutedToTodoList!: Boolean;
  public isRoutedToTodoListChange = new EventEmitter<Boolean>();
  private isRoutedToIndex!: Boolean;
  public isRoutedToIndexChange = new EventEmitter<Boolean>();

  private isRealService!: Boolean;

  private boardSelected!: Number;
  public boardSelectedChange = new EventEmitter<Number>();

  private boardNameMapping!: Map<Number, String>;
  public boardNameMappingChange = new EventEmitter< Map<Number, String> >();

  public displayDateFormat!: string;
  public inputDateFormat!: string;

  private boardNameMaxLength! : Number;
  public boardNameMaxLengthChange = new EventEmitter<Number>();
  private boardDescriptionMaxLength! : Number;
  public boardDescriptionMaxLengthChange = new EventEmitter<Number>();
  private boardAuthorMaxLength! : Number;
  public boardAuthorMaxLengthChange = new EventEmitter<Number>();

  private todoNameMaxLength! : Number;
  public todoNameMaxLengthChange = new EventEmitter<Number>();
  private todoDescriptionMaxLength! : Number;
  public todoDescriptionMaxLengthChange = new EventEmitter<Number>();

  private taskNameMaxLength! : Number;
  public taskNameMaxLengthChange = new EventEmitter<Number>();

  private enableRestoreTodos!: Boolean;
  public enableRestoreTodosChange = new EventEmitter<Boolean>();

  private readonlyTodo!: Boolean;
  public readonlyTodoChange = new EventEmitter<Boolean>();
  private readonlyTask!: Boolean;
  public readonlyTaskChange = new EventEmitter<Boolean>();

  private todoCount!: number;
  public todoCountChange = new EventEmitter<number>();

  private todoSortExec: Boolean[] = [];
  private todoSortField: String[] = [];
  private todoSortDir: Boolean[] = [];
  public todoSortingSettingsChange = new EventEmitter<{phase: Number, exec:Boolean, field:String, dir:Boolean}>();

  private taskSortExec: Boolean[] = [];
  private taskSortField: String[] = [];
  private taskSortDir: Boolean[] = [];
  public taskSortingSettingsChange = new EventEmitter<{phase: Number, exec:Boolean, field:String, dir:Boolean}>();

  private todoSearchingCaseSense!: Boolean;
  public todoSearchingCaseSenseChange = new EventEmitter<Boolean>();
  private todoSearchingHighlight!: Boolean;
  public todoSearchingHighlightChange = new EventEmitter<Boolean>();
  private todoSearchingRules!: Map<String,String>;
  public todoSearchingRulesChange = new EventEmitter< Map<String,String> >();

  constructor(private router: Router) {
    this.phase_labels = ['Backlog', 'In progress', 'Done'];

    this.inputDateFormat = 'yyyy-MM-dd HH:mm:ss';
    this.displayDateFormat = 'yyyy-MM-dd HH:mm:ss.sss';

    this.boardNameMapping = new Map<Number,String>();
    this.todoSearchingRules = new Map<String,String>();
  }

  getCommonModalSettings(ariaTitleLabel?: String) {
    let result = {
      ariaLabelledBy: "",
      size: "lg",
      backdropClass: "tsz-modal-backdrop"
    };

    if (ariaTitleLabel)
    {
      result.ariaLabelledBy = ariaTitleLabel as string;
    }

    return result;
  }

  updateTodo(id: Number)
  {
    this.updateTodoEvent.emit(id);
  }

  updateBoard() {
    this.updateBoardEvent.emit();
  }

  updateTodoList(phase?: Set<Number>) {
    this.updateTodoListEvent.emit(phase);
  }

  updateBoardList() {
    this.updateBoardListEvent.emit();
  }

  getBoardListSize() {
    return this.boardNameMapping.size;
  }

  iterateBoardList(): Array<number> {
    let result: Array<number> = [];

    for (let id of this.boardNameMapping.keys())
    {
      result.push(id as number);
    }

    return result.sort();
  }

  getBoardName(id: Number): String {
    let result: String = "<unknown board>";

    if (this.boardNameMapping.has(id))
    {
      result = this.boardNameMapping.get(id)!;
    }

    return result;
  }

  iterateTodoPhases(): Array<number> {
    let result: Array<number> = [];

    if (this.phaseRange.length == 2)
    {
      let phaseMin = this.phaseRange[0] as number;
      let phaseMax = this.phaseRange[1] as number;

      if (phaseMax >= phaseMin)
      {
        for (let phase=phaseMin;phase<=phaseMax;phase++)
          result.push(phase);
      }
    }

    return result;
  }

  getTodoPhaseSpread(): number {
    let result: number = -1;

    if (this.phaseRange.length == 2)
    {
      let phaseMin = this.phaseRange[0] as number;
      let phaseMax = this.phaseRange[1] as number;

      result = phaseMax - phaseMin;
    }

    return result;
  }

  getTodoPhaseLabel(idx: number) {
    let result: String = "<unknown phase>";

    if (this.phaseRange.length == 2)
    {
      let phaseMin = this.phaseRange[0] as number;
      let phaseMax = this.phaseRange[1] as number;

      if (phaseMin <= phaseMax)
      if ((idx >= phaseMin) && (idx <= phaseMax))
      {
        let idx_temp = idx - phaseMin;

        if (idx_temp < this.phase_labels.length)
          result = this.phase_labels[idx_temp];
        else
          result = `Phase #${idx_temp+1}`;
      }
    }

    return result;
  }

  getIfTodoSortingExecuted(phase: Number) {
    return this.todoSortExec[phase as number];
  }

  updateTodoSortingSettings(phase: Number, field: String, dir: Boolean)
  {
    this.todoSortExec[phase as number] = (field != '');

    if (this.todoSortExec[phase as number])
    {
      this.todoSortField[phase as number] = field;
      this.todoSortDir[phase as number] = dir;
    }
    else
    {
      this.todoSortField[phase as number] = '';
      this.todoSortDir[phase as number] = false;
    }

    this.todoSortingSettingsChange.emit({
      phase: phase,
      exec: this.todoSortExec[phase as number],
      field: this.todoSortField[phase as number],
      dir: this.todoSortDir[phase as number]
    });
  }

  getIfTaskSortingExecuted(phase: Number) {
    return this.taskSortExec[phase as number];
  }

  updateTaskSortingSettings(phase: Number, field: String, dir: Boolean)
  {
    this.taskSortExec[phase as number] = (field != '');

    if (this.taskSortExec[phase as number])
    {
      this.taskSortField[phase as number] = field;
      this.taskSortDir[phase as number] = dir;
    }
    else
    {
      this.taskSortField[phase as number] = '';
      this.taskSortDir[phase as number] = false;
    }

    this.taskSortingSettingsChange.emit({
      phase: phase,
      exec: this.taskSortExec[phase as number],
      field: this.taskSortField[phase as number],
      dir: this.taskSortDir[phase as number]}
    );
  }

  resetTodoSortingSettings(phase: Number) {
    this.updateTodoSortingSettings(phase, '', false);
  }

  resetTaskSortingSettings(phase: Number) {
    this.updateTaskSortingSettings(phase, '', false);
  }

  triggerTodoSortingSettings(phase: Number) {
    this.todoSortingSettingsChange.emit({
      phase: phase,
      exec: this.todoSortExec[phase as number],
      field: this.todoSortField[phase as number],
      dir: this.todoSortDir[phase as number]
    });
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

  triggerTodoSearchingSettings() {
    this.todoSearchingCaseSenseChange.emit(this.todoSearchingCaseSense);
    this.todoSearchingHighlightChange.emit(this.todoSearchingHighlight);
  }

  getTodoSearchingSettings() {
    return {casesense: this.todoSearchingCaseSense, highlight: this.todoSearchingHighlight};
  }

  triggerTodoSearchingRules() {
    this.todoSearchingRulesChange.emit(this.todoSearchingRules);
  }

  getTodoSearchingRules() {
    return this.todoSearchingRules;
  }

  hasSearchRules() {
    return (this.todoSearchingRules.size > 0);
  }

  addSearchRule(field: String, term: String) {
    if (field.trim() != "")
    {
      this.todoSearchingRules.set(field, term);
      this.updateSearchRules();
    }
  }

  deleteSearchRule(field: String)
  {
    if (field.trim() != "")
    {
      this.todoSearchingRules.delete(field);
      this.updateSearchRules();
    }
  }

  clearSearchRules()
  {
    this.todoSearchingRules.clear();
    this.updateSearchRules();
  }

  resetTodoSearching()
  {
    this.updateTodoSearchCase(false);
    this.updateTodoSearchHighlight(false);
    this.clearSearchRules();
    this.updateTodoList();
  }

  updateBoardNameMaxLength(val: Number = 0) {
    if (val > 0)
      this.boardNameMaxLength = val;
    this.boardNameMaxLengthChange.emit(this.boardNameMaxLength);
  }

  updateBoardDescriptionMaxLength(val: Number = 0) {
    if (val > 0)
      this.boardDescriptionMaxLength = val;
    this.boardDescriptionMaxLengthChange.emit(this.boardDescriptionMaxLength);
  }

  updateBoardAuthorMaxLength(val: Number = 0) {
    if (val > 0)
      this.boardAuthorMaxLength = val;
    this.boardAuthorMaxLengthChange.emit(this.boardAuthorMaxLength);
  }

  updateTodoNameMaxLength(val: Number = 0) {
    if (val > 0)
      this.todoNameMaxLength = val;
    this.todoNameMaxLengthChange.emit(this.todoNameMaxLength);
  }

  updateTodoDescriptionMaxLength(val: Number = 0) {
    if (val > 0)
      this.todoDescriptionMaxLength = val;
    this.todoDescriptionMaxLengthChange.emit(this.todoDescriptionMaxLength);
  }

  updateTaskNameMaxLength(val: Number = 0) {
    if (val > 0)
      this.taskNameMaxLength = val;
    this.taskNameMaxLengthChange.emit(this.taskNameMaxLength);
  }

  updateTodoPhaseValRange(minVal: Number, maxVal: Number) {
    this.phaseRange = [minVal,maxVal];

    for (let phase in this.iterateTodoPhases())
    {
      this.todoSortExec.push(false);
      this.todoSortField.push("");
      this.todoSortDir.push(false);

      this.taskSortExec.push(false);
      this.taskSortField.push("");
      this.taskSortDir.push(false);
    }

    this.triggerTodoPhaseValRange();
  }

  triggerTodoPhaseValRange() {
    this.todoPhaseValRangeChange.emit(this.phaseRange);
  }

  updateEnableRestoreTodos(val?: Boolean): Boolean {
    if (val !== undefined)
      this.enableRestoreTodos = val;
    else
      this.enableRestoreTodos = !this.enableRestoreTodos;

    this.readonlyTodoChange.emit(this.enableRestoreTodos);
    return this.enableRestoreTodos;
  }

  updateReadonlyTodo(val?: Boolean): Boolean {
    if (val !== undefined)
      this.readonlyTodo = val;
    else
      this.readonlyTodo = !this.readonlyTodo;

    this.readonlyTodoChange.emit(this.readonlyTodo);
    this.readonlyTaskChange.emit(this.readonlyTask || this.readonlyTodo);

    return this.readonlyTodo;
  }

  updateReadonlyTask(val?: Boolean): Boolean {
    let result;

    if (val !== undefined)
      this.readonlyTask = val;
    else
      this.readonlyTask = !this.readonlyTask;

    result = this.readonlyTask || this.readonlyTodo;

    this.readonlyTaskChange.emit(result);
    return result;
  }

  updateTodoCount(val: number) {
    this.todoCount = val;
    this.todoCountChange.emit(this.todoCount);
  }

  changePageTitle(val: String) {
    this.pageTitle = val;
    this.pageTitleChange.emit(this.pageTitle);
  }

  changeRouteStatus(val1: Boolean, val2: Boolean) {
    this.isRoutedToTodoList = val1;
    this.isRoutedToTodoListChange.emit(this.isRoutedToTodoList);
    this.isRoutedToIndex = val2;
    this.isRoutedToIndexChange.emit(this.isRoutedToIndex);
  }

  setRealServiceStatus(val: Boolean) {
    this.isRealService = val;
  }

  getRealServiceStatus() {
    return this.isRealService;
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

  getBoardSelected() {
    return this.boardSelected;
  }

  addBoardName(id: Number, name: String)
  {
    this.boardNameMapping.set(id, name);
    this.boardNameMappingChange.emit(this.boardNameMapping);
  }

  deleteBoardName(id: Number)
  {
    if (id == this.boardSelected)
    {
      this.router.navigate(['/']);
    }

    this.boardNameMapping.delete(id);
    this.boardNameMappingChange.emit(this.boardNameMapping);
  }

  clearBoardNames()
  {
    this.boardNameMapping.clear();
    this.boardNameMappingChange.emit(this.boardNameMapping);
  }
}
