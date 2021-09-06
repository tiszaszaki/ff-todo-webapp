import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-ff-todo-list-empty',
  templateUrl: './ff-todo-list-empty.component.html',
  styleUrls: ['./ff-todo-list-empty.component.css']
})
export class FfTodoListEmptyComponent implements OnInit {

  @Input() todoQuerySuccess!: Boolean;

  constructor() { }

  ngOnInit(): void {
  }

}
