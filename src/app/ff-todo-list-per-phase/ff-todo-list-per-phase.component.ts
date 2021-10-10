import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FfTodoAlertService } from '../ff-todo-alert.service';
import { FfTodoCommonService } from '../ff-todo-common.service';
import { Todo } from '../todo';

@Component({
  selector: 'app-ff-todo-list-per-phase',
  templateUrl: './ff-todo-list-per-phase.component.html',
  styleUrls: ['./ff-todo-list-per-phase.component.css']
})
export class FfTodoListPerPhaseComponent implements OnInit, OnDestroy {

  constructor(     
      private common: FfTodoCommonService,
      private alertServ: FfTodoAlertService) { }

  @Input() content! : Todo[];
  @Input() phase_idx!: number;

  public todoSortExec!: Boolean;
  public todoSortField!: String;
  public todoSortDir!: Boolean;
  public todoSortingSettingsListener!: Subscription;

  public todoSearchingCaseSense!: Boolean;
  public todoSearchingCaseSenseListener!: Subscription;
  public todoSearchingHighlight!: Boolean;
  public todoSearchingHighlightListener!: Subscription;

  public todoSearchRules!: Map<String,String>;
  public todoSearchingRulesListener!: Subscription;

  public searchresCount!: number;

  notifyTodoSearchResults() {
    if (this.common.hasSearchRules())
    {
      this.alertServ.addAlertMessage({type: 'info',
          message: `Searching resulted ${this.searchresCount} Todo(s) in phase '${this.common.getTodoPhaseLabel(this.phase_idx)}'.`});
    }
  }

  ngOnInit(): void {
    this.searchresCount = this.content.length;

    this.todoSortExec = false;
    this.todoSortField = '';
    this.todoSortDir = false;

    this.todoSearchingCaseSenseListener = this.common.todoSearchingCaseSenseChange.subscribe(result => this.todoSearchingCaseSense = result);
    this.todoSearchingHighlightListener = this.common.todoSearchingHighlightChange.subscribe(result => this.todoSearchingHighlight = result);

    this.todoSortingSettingsListener = this.common.todoSortingSettingsChange.subscribe(result => {
      if (this.phase_idx == result.phase)
      {
        this.todoSortExec = result.exec;
        this.todoSortField = result.field;
        this.todoSortDir = result.dir;
      }
    });

    this.todoSearchingRulesListener = this.common.todoSearchingRulesChange.subscribe(results => {
      this.todoSearchRules = results;
    });
  }

  ngOnDestroy(): void {
    this.todoSearchingCaseSenseListener.unsubscribe();
    this.todoSearchingHighlightListener.unsubscribe();

    this.todoSortingSettingsListener.unsubscribe();
    this.todoSearchingRulesListener.unsubscribe();
  }
}
