import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-ff-todo-header',
  templateUrl: './ff-todo-header.component.html',
  styleUrls: ['./ff-todo-header.component.css', '../app.component.css']
})
export class FfTodoHeaderComponent implements OnInit {

  constructor() { }

  @Input() title! : String;

  @Input() readonlyTodo!: Boolean;
  @Input() todo_count!: number;
  @Input() enableRestoreTodos!: Boolean;

  @Output() prepareAddTodoForm = new EventEmitter<void>();
  @Output() prepareRemovingAllTodos = new EventEmitter<void>();
  @Output() initTodoList = new EventEmitter<void>();
  @Output() restoreTodoList = new EventEmitter<void>();

  ngOnInit(): void {
  }

}
