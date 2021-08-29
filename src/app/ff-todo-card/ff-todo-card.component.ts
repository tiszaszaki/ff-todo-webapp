import { Component, Input, OnInit } from '@angular/core';
import { ShiftDirection } from '../shift-direction';
import { Task } from '../task';
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

  @Input() tasksortfield!: String;
  @Input() tasksortdir!: Boolean;

  @Input() customDateFormat!: string;

  @Input('readonlyTodo') _readonlyTodo?: Boolean = false;
  @Input('readonlyTask') _readonlyTask?: Boolean = false;

  @Input() showDescriptionLength?: Boolean = true;
  @Input() showTaskCount?: Boolean = true;
  @Input() showDateCreated?: Boolean = true;

  readonlyTodo!: Boolean;
  readonlyTask!: Boolean;

  contentStr!: String;

  isCardValid: Boolean = true;

  phaseLeftExists!: Boolean;
  phaseRightExists!: Boolean;

  descriptionLength!: Number;

  tasklistStr! : String;
  taskCount!: Number;

  LEFT = ShiftDirection.LEFT;
  RIGHT = ShiftDirection.RIGHT;

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

  shiftTodo(dir : ShiftDirection) {
    let shiftDirStr = new Map([[-1,'left'],[1,'right']]);
    console.log(`Trying to shift ${shiftDirStr.get(dir)} this Todo (${this.contentStr})...`);
  }
}
