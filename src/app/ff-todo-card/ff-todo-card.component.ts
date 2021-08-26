import { Component, Input, OnInit } from '@angular/core';
import { Todo } from '../ff-todo-list/ff-todo-list.component';

@Component({
  selector: 'app-ff-todo-card',
  templateUrl: './ff-todo-card.component.html',
  styleUrls: ['./ff-todo-card.component.css']
})
export class FfTodoCardComponent implements OnInit {

  constructor() {
    this.content = JSON.parse(this.contentStr);

    this.isCardValid = true;

    this.todo_expand_status = false;

    this.descriptionLength = this.content.description.length;
  }

  @Input() contentStr: string = '';
  @Input() tasksortfield: string = '';
  @Input() tasksortdir: Boolean = false;

  @Input() customDateFormat: string = '';

  isCardValid: Boolean;

  todo_expand_status: Boolean;

  descriptionLength: Number;

  content: Todo = new Todo();

  ngOnInit(): void {
  }

}
