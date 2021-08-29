import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-ff-todo-header',
  templateUrl: './ff-todo-header.component.html',
  styleUrls: ['./ff-todo-header.component.css', '../app.component.css']
})
export class FfTodoHeaderComponent implements OnInit {

  constructor() { }

  @Input() title! : String;

  ngOnInit(): void {
  }

}
