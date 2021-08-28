import { Component, Input, OnInit } from '@angular/core';
import { Task } from '../task';

@Component({
  selector: 'app-ff-todo-task-list',
  templateUrl: './ff-todo-task-list.component.html',
  styleUrls: ['./ff-todo-task-list.component.css']
})
export class FfTodoTaskListComponent implements OnInit {

  constructor() { }

  @Input('tasks') tasklistString! : string;
  @Input() taskCount!: Number;

  @Input() tasksortfield!: string;
  @Input() tasksortdir!: Boolean;

  @Input() readonlyTask?: Boolean = false;
  @Input() showTaskCount?: Boolean = true;

  tasks! : Task[];

  tasklist_expand_status: Boolean = false;

  ngOnInit(): void {
    this.tasks = JSON.parse(this.tasklistString);
  }

  editTask(t : Task)
  {
    let taskStr=JSON.stringify(t);
    console.log(`Trying to edit this Task (${taskStr})...`);
  }
  removeTask(t : Task)
  {   
    let taskStr=JSON.stringify(t);
    console.log(`Trying to remove this Task (${taskStr})...`);
  }
  checkTask(t : Task)
  {
    let taskStr=JSON.stringify(t);
    console.log(`Trying to check this Task (${taskStr})...`);
  }

  toggleCollapse()
  {
    this.tasklist_expand_status = !this.tasklist_expand_status;
  }
}
