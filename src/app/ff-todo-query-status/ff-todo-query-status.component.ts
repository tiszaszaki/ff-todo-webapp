import { Component, Input, OnInit } from '@angular/core';
import { GenericQueryStatus } from '../generic-query-status';

@Component({
  selector: 'app-ff-todo-query-status',
  templateUrl: './ff-todo-query-status.component.html',
  styleUrls: ['./ff-todo-query-status.component.css']
})
export class FfTodoQueryStatusComponent implements OnInit {

  constructor() { }

  public readonly TODO_QUERY_STANDBY = GenericQueryStatus.QUERY_STANDBY;
  public readonly TODO_QUERY_INPROGRESS = GenericQueryStatus.QUERY_INPROGRESS;
  public readonly TODO_QUERY_SUCCESS = GenericQueryStatus.QUERY_SUCCESS;
  public readonly TODO_QUERY_FAILURE = GenericQueryStatus.QUERY_FAILURE;

  @Input() todoQueryStatus!: GenericQueryStatus;

  @Input() message!: String;

  ngOnInit(): void {
  }

}
