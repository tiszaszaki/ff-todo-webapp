import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-ff-todo-footer',
  templateUrl: './ff-todo-footer.component.html',
  styleUrls: ['./ff-todo-footer.component.css', '../app.component.css']
})
export class FfTodoFooterComponent implements OnInit, OnDestroy {

  public footer_collapse_status = true;

  constructor() { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }

}
