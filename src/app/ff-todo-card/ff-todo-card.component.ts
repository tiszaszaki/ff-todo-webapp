import { Component, Input, OnInit } from '@angular/core';
import { NumberValueAccessor } from '@angular/forms';
import { Todo } from '../ff-todo-list/ff-todo-list.component';

@Component({
  selector: 'app-ff-todo-card',
  templateUrl: './ff-todo-card.component.html',
  styleUrls: ['./ff-todo-card.component.css']
})
export class FfTodoCardComponent implements OnInit {

  constructor() {
  }

  @Input() content!: Todo;
  @Input() tasksortfield?: string;
  @Input() tasksortdir?: Boolean;

  @Input() customDateFormat?: string = 'yyyy-MM-dd hh:mm:ss.sss';

  isCardValid: Boolean = true;

  todo_expand_status: Boolean = true;

  descriptionLength!: Number;
  tasks!: Array<Task>;
  taskCount!: Number;

  ngOnInit(): void {
    this.descriptionLength = this.content.description.length;
    if (this.content.tasks !== undefined)
    {
      this.tasks = Object.assign(this.tasks, this.content.tasks);
    }
    else
    {
      this.tasks = new Array<Task>()
    }
    this.taskCount = this.tasks.length;
    console.log(this.taskCount);
  }

}
