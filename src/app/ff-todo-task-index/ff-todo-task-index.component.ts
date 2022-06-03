import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FfTodoCommonService } from '../ff-todo-common.service';

@Component({
  selector: 'app-ff-todo-task-index',
  templateUrl: './ff-todo-task-index.component.html',
  styleUrls: ['./ff-todo-task-index.component.css']
})
export class FfTodoTaskIndexComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private common: FfTodoCommonService) { }

    ngOnInit(): void {
      this.route.queryParams.subscribe(_ => {
        this.common.changeRouteStatus(false, true);
      });
    }
  
}
