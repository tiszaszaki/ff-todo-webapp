import { Component, Input, OnInit } from '@angular/core';
import { TiszaSzakiAlert } from '../tsz-alert';

@Component({
  selector: 'app-ff-todo-footer',
  templateUrl: './ff-todo-footer.component.html',
  styleUrls: ['./ff-todo-footer.component.css', '../app.component.css']
})
export class FfTodoFooterComponent implements OnInit {

  @Input() alerts!: TiszaSzakiAlert[];

  constructor() { }

  ngOnInit(): void {
  }

}
