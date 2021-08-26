import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ff-todo-list',
  templateUrl: './ff-todo-list.component.html',
  styleUrls: ['./ff-todo-list.component.css']
})
export class FfTodoListComponent implements OnInit {

  constructor() { }

  phase = 0;

  ngOnInit(): void {
  }

}
