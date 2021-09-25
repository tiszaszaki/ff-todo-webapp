import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-ff-todo-query-status',
  templateUrl: './ff-todo-query-status.component.html',
  styleUrls: ['./ff-todo-query-status.component.css']
})
export class FfTodoQueryStatusComponent implements OnInit {

  constructor() { }

  @Input() todoQueryFinished!: Boolean;
  @Input() todoQuerySuccess!: Boolean;

  ngOnInit(): void {
  }

}
