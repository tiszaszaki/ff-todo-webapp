import { Component, Input, OnInit } from '@angular/core';
import { Todo } from '../todo';

@Component({
  selector: 'app-ff-todo-card',
  templateUrl: './ff-todo-card.component.html',
  styleUrls: ['./ff-todo-card.component.css']
})
export class FfTodoCardComponent implements OnInit {

  constructor() {
  }

  @Input() content!: Todo;
  @Input() phaseNum!: number;

  @Input() tasksortfield?: string;
  @Input() tasksortdir?: Boolean;

  @Input() customDateFormat?: string = 'yyyy-MM-dd hh:mm:ss.sss';

  @Input() readonlyTodo?: Boolean = false;
  @Input() readonlyTask?: Boolean = false;

  @Input() showDescriptionLength?: Boolean = true;
  @Input() showTaskCount?: Boolean = true;
  @Input() showDateCreated?: Boolean = true;
  
  contentStr!: string;

  isCardValid: boolean = true;

  phaseLeftExists!: Boolean;
  phaseRightExists!: Boolean;

  todo_expand_status: Boolean = true;

  descriptionLength!: Number;
  tasks!: Task[];
  taskCount!: Number;

  ngOnInit(): void {
    this.contentStr = JSON.stringify(this.content);

    if (this.isCardValid)
    {
      this.isCardValid &&= (this.content.name != '');
      this.isCardValid &&= ((this.content.phase >= 0) && (this.content.phase < this.phaseNum));
    }

    this.phaseLeftExists = ((this.content.phase - 1) >= 0);
    this.phaseRightExists = ((this.content.phase + 1) < this.phaseNum);

    this.descriptionLength = this.content.description.length;

    if (this.content.tasks)
    if (this.content.tasks.length)
    {
      this.tasks = Object.assign(this.tasks, this.content.tasks);
    }
    else
    {
      this.tasks = [];
    }

    this.taskCount = this.tasks.length;
  }

  addTask() {
    console.log(`Trying to add a new Task for this Todo (${this.contentStr})...`);
  }
  editTodo() {
    console.log(`Trying to edit this Todo (${this.contentStr})...`);
  }

  removeTodo() {
    console.log(`Trying to remove this Todo (${this.contentStr})...`);
  }
  removeAllTasks() {
    console.log(`Trying to clear Task list for this Todo (${this.contentStr})...`);
  }

  shiftTodoLeft() {
    console.log(`Trying to shift left this Todo (${this.contentStr})...`);
  }
  shiftTodoRight() {
    console.log(`Trying to shift right this Todo (${this.contentStr})...`);
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
    this.todo_expand_status = !this.todo_expand_status;
  }
}
