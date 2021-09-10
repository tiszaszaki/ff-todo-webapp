import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Task } from '../task';

@Component({
  selector: 'app-ff-todo-task-list',
  templateUrl: './ff-todo-task-list.component.html',
  styleUrls: ['./ff-todo-task-list.component.css']
})
export class FfTodoTaskListComponent implements OnInit {

  constructor(private highlighter: DomSanitizer) { }

  @Input() todoId!: number;

  @Input('tasks') tasklistString! : String;
  @Input() taskCount!: Number;

  @Input() tasksortfield!: String;
  @Input() tasksortdir!: Boolean;
  @Input() tasksortexec!: Boolean;

  @Input() readonlyTask?: Boolean = false;
  @Input() showTaskCount!: Boolean[];

  @Output() editTaskEvent = new EventEmitter<Task>();
  @Output() checkTaskEvent = new EventEmitter<Task>();
  @Output() removeTaskEvent = new EventEmitter<Task>();

  public highlightedNames = new Map<Number,SafeHtml>();

  public tasks! : Task[];

  public tasklist_collapse_status: boolean = true;

  ngOnInit(): void {
    this.tasks = JSON.parse(this.tasklistString as string);

    for (let task of this.tasks)
    {
      this.highlightedNames.set(task.id, this.highlighter.bypassSecurityTrustHtml(task.name as string));
    }

    if (this.showTaskCount.length == 0)
      this.showTaskCount.push(false, false);
    if (this.showTaskCount.length == 1)
      this.showTaskCount.push(false);
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
