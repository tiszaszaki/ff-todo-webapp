import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ShiftDirection } from '../shift-direction';
import { Task } from '../task';
import { Todo } from '../todo';

@Component({
  selector: 'app-ff-todo-card',
  templateUrl: './ff-todo-card.component.html',
  styleUrls: ['./ff-todo-card.component.css']
})
export class FfTodoCardComponent implements OnInit {

  constructor(private highlighter: DomSanitizer) { }

  @Input() content!: Todo;
  @Input() phaseNum!: number;

  @Input() tasksortfield!: String;
  @Input() tasksortdir!: Boolean;
  @Input() tasksortexec!: Boolean;

  @Input() displayDateFormat!: string;

  @Input('readonlyTodo') _readonlyTodo?: Boolean = false;
  @Input('readonlyTask') _readonlyTask?: Boolean = false;

  @Input() showDescriptionLength!: Boolean[];
  @Input() showTaskCount!: Boolean[];
  @Input() showDateCreated!: Boolean[];

  @Output() editTodoEvent = new EventEmitter<number>();
  @Output() removeTodoEvent = new EventEmitter<number>();

  @Output() shiftLeftTodoEvent = new EventEmitter<Todo>();
  @Output() shiftRightTodoEvent = new EventEmitter<Todo>();

  @Output() addTaskEvent = new EventEmitter<number>();
  @Output() removeAllTasksEvent = new EventEmitter<number>();

  @Output() editTaskEvent = new EventEmitter<Task>();
  @Output() checkTaskEvent = new EventEmitter<Task>();
  @Output() removeTaskEvent = new EventEmitter<Task>();

  public highlightedName!: SafeHtml;
  public highlightedDescription!: SafeHtml;

  public readonlyTodo!: Boolean;
  public readonlyTask!: Boolean;

  public contentStr!: String;

  public isCardValid: Boolean = true;

  public phaseLeftExists!: Boolean;
  public phaseRightExists!: Boolean;

  public descriptionLength!: Number;

  public tasklistStr! : String;
  public taskCount!: Number;

  public readonly LEFT = ShiftDirection.LEFT;
  public readonly RIGHT = ShiftDirection.RIGHT;

  ngOnInit(): void {
    this.contentStr = JSON.stringify(this.content);

    this.highlightedName = this.highlighter.bypassSecurityTrustHtml(this.content.name as string);
    this.highlightedDescription = this.highlighter.bypassSecurityTrustHtml(this.content.description as string);

    if (this.isCardValid)
    {
      this.isCardValid &&= (this.content.name != '');
      this.isCardValid &&= ((this.content.phase >= 0) && (this.content.phase < this.phaseNum));
    }

    this.phaseLeftExists = ((this.content.phase - 1) >= 0);
    this.phaseRightExists = ((this.content.phase + 1) < this.phaseNum);

    this.descriptionLength = this.content.description.length;

    if (this.content.tasks)
    {
      this.taskCount = this.content.tasks.length;
    }
    else
    {
      this.content.tasks = [];
      this.taskCount = 0;
    }

    this.tasklistStr = JSON.stringify(this.content.tasks);

    this.readonlyTodo = (this._readonlyTodo ? this._readonlyTodo : false);
    this.readonlyTask = (this._readonlyTask ? this._readonlyTask : false);

    this.readonlyTask ||= this.readonlyTodo;

    if (this.showDescriptionLength.length == 0)
      this.showDescriptionLength.push(false, false);
    if (this.showDescriptionLength.length == 1)
      this.showDescriptionLength.push(false);

    if (this.showDateCreated.length == 0)
      this.showDateCreated.push(false, false);
    if (this.showDateCreated.length == 1)
      this.showDateCreated.push(false);
  }

  addTask() {
    console.log(`Trying to add a new Task for this Todo (${this.contentStr})...`);
    this.addTaskEvent.emit(this.content.id);
  }
  editTodo() {
    console.log(`Trying to edit this Todo (${this.contentStr})...`);
    this.editTodoEvent.emit(this.content.id);
  }

  removeTodo() {
    this.removeTodoEvent.emit(this.content.id);
  }
  removeAllTasks() {
    console.log(`Trying to clear Task list for this Todo (${this.contentStr})...`);
    this.removeAllTasksEvent.emit(this.content.id);
  }

  shiftTodo(dir : ShiftDirection) {
    let shiftDirStr = new Map([[-1,'left'],[1,'right']]);
    console.log(`Trying to shift ${shiftDirStr.get(dir)} this Todo (${this.contentStr})...`);
    switch (dir)
    {
      case this.LEFT: this.shiftLeftTodoEvent.emit(this.content); break;
      case this.RIGHT: this.shiftRightTodoEvent.emit(this.content); break;
      default: break;
    }
  }

  editTask(task : Task) {
    let taskStr = JSON.stringify(task);
    console.log(`Trying to edit this Task (${taskStr})...`);
  }
  checkTask(task : Task) {
    let taskStr = JSON.stringify(task);
    console.log(`Trying to check this Task (${taskStr})...`);
    this.checkTaskEvent.emit(task);
  }
  removeTask(task : Task) {
    let taskStr = JSON.stringify(task);
    console.log(`Trying to check this Task (${taskStr})...`);
    this.removeTaskEvent.emit(task);
  }
}
