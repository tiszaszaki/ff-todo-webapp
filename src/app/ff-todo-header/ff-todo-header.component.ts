import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-ff-todo-header',
  templateUrl: './ff-todo-header.component.html',
  styleUrls: ['./ff-todo-header.component.css', '../app.component.css']
})
export class FfTodoHeaderComponent implements OnInit, OnChanges {

  constructor() { }

  @Input() title! : String;

  @Input() todosearchexec!: Boolean;
  @Input() readonlyTodo!: Boolean;
  @Input() readonlyTask!: Boolean;

  @Input() todo_count!: number;
  @Input() enableRestoreTodos!: Boolean;

  @Input() boardNameMapping!: Map<Number, String>;

  @Output() prepareAddBoardForm = new EventEmitter<void>();
  @Output() updateSelectedBoard = new EventEmitter<Number>();

  @Output() prepareAddTodoForm = new EventEmitter<void>();
  @Output() prepareRemovingAllTodos = new EventEmitter<void>();
  @Output() initTodoList = new EventEmitter<void>();
  @Output() restoreTodoList = new EventEmitter<void>();

  @Output() prepareSearchTodoForm = new EventEmitter<void>();

  @Output() toggleReadonlyTodo = new EventEmitter<Boolean>();
  @Output() toggleReadonlyTask = new EventEmitter<Boolean>();

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
