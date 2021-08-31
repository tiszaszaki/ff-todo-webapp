import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Task } from '../task';

@Component({
  selector: 'app-ff-todo-task-list',
  templateUrl: './ff-todo-task-list.component.html',
  styleUrls: ['./ff-todo-task-list.component.css']
})
export class FfTodoTaskListComponent implements OnInit {

  @Input() todoId!: number;

  @Input('tasks') tasklistString! : String;
  @Input() taskCount!: Number;

  @Input() tasksortfield!: String;
  @Input() tasksortdir!: Boolean;

  @Input() readonlyTask?: Boolean = false;
  @Input() showTaskCount?: Boolean = true;

  @Output() editTaskEvent = new EventEmitter<Task>();
  @Output() checkTaskEvent = new EventEmitter<Task>();
  @Output() removeTaskEvent = new EventEmitter<Task>();

  public tasks! : Task[];

  public tasklist_expand_status: Boolean = false;

  constructor() { }

  ngOnInit(): void {
    this.tasks = JSON.parse(this.tasklistString as string);
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

  toggleCollapse()
  {
    this.tasklist_expand_status = !this.tasklist_expand_status;
  }
}
