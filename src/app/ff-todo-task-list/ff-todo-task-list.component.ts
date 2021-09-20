import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { FfTodoCommonService } from '../ff-todo-common.service';
import { Task } from '../task';

@Component({
  selector: 'app-ff-todo-task-list',
  templateUrl: './ff-todo-task-list.component.html',
  styleUrls: ['./ff-todo-task-list.component.css']
})
export class FfTodoTaskListComponent implements OnInit, OnDestroy {

  constructor(
      private highlighter: DomSanitizer,
      private common: FfTodoCommonService) { }

  @Input() todoId!: number;

  @Input('tasks') tasklistString! : String;

  @Input() tasksortfield!: String;
  @Input() tasksortdir!: Boolean;
  @Input() tasksortexec!: Boolean;

  @Input() showTaskCount!: Boolean[];

  @Output() editTaskEvent = new EventEmitter<Task>();
  @Output() checkTaskEvent = new EventEmitter<Task>();
  @Output() removeTaskEvent = new EventEmitter<Task>();

  public taskCount!: Number;

  public readonlyTask!: Boolean;
  public readonlyTaskListener!: Subscription;

  public highlightedNames = new Map<Number,SafeHtml>();

  public tasks! : Task[];

  public tasklist_collapse_status: boolean = true;

  ngOnInit(): void {
    this.readonlyTaskListener = this.common.readonlyTaskChange.subscribe(result => this.readonlyTask = result);

    this.tasks = JSON.parse(this.tasklistString as string);

    this.taskCount = this.tasks.length;

    for (let task of this.tasks)
    {
      this.highlightedNames.set(task.id, this.highlighter.bypassSecurityTrustHtml(task.name as string));
    }

    if (this.showTaskCount.length == 0)
      this.showTaskCount.push(false, false);
    if (this.showTaskCount.length == 1)
      this.showTaskCount.push(false);
  }

  ngOnDestroy(): void {
    this.readonlyTaskListener.unsubscribe();
  }

  editTask(t : Task)
  {
    let taskStr=JSON.stringify(t);
    let markedTask=t;
    markedTask.todoId = this.todoId;
    console.log(`Trying to edit this Task (${taskStr})...`);
    this.editTaskEvent.emit(markedTask);
  }
  removeTask(t : Task)
  {   
    let taskStr=JSON.stringify(t);
    let markedTask=t;
    markedTask.todoId = this.todoId;
    console.log(`Trying to remove this Task (${taskStr})...`);
    this.removeTaskEvent.emit(markedTask);
  }
  checkTask(t : Task)
  {
    let taskStr=JSON.stringify(t);
    let markedTask=t;
    markedTask.todoId = this.todoId;
    console.log(`Trying to check this Task (${taskStr})...`);
    this.checkTaskEvent.emit(markedTask);
  }
}
