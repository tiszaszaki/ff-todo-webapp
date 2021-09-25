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

  public showDescriptionLength: Boolean[] = [];
  public showTaskCount: Boolean[] = [];
  public showDateCreated: Boolean[] = [];

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

  public searchresCount: number = 0;

  notifyTodoSearchResults() {
    this.alertServ.addAlertMessage({type: 'info',
        message: `Searching resulted ${this.searchresCount} Todo(s) in phase '${this.common.getTodoPhaseLabel(this.phase_idx)}'.`});
  }

  ngOnInit(): void {
    this.todoSortExec = false;
    this.todoSortField = '';
    this.todoSortDir = false;

    this.showDescriptionLength.push(false, false);
    this.showDateCreated.push(false, false);
    this.showTaskCount.push(false, false);

    this.todoSearchingCaseSenseListener = this.common.todoSearchingCaseSenseChange.subscribe(result => this.todoSearchingCaseSense = result);
    this.todoSearchingHighlightListener = this.common.todoSearchingHighlightChange.subscribe(result => this.todoSearchingHighlight = result);

    this.todoSortingSettingsListener = this.common.todoSortingSettingsChange.subscribe(result => {
      this.todoSortExec = result.exec;
      this.todoSortField = result.field;
      this.todoSortDir = result.dir;

      this.showDescriptionLength[0] = (this.todoSortField == 'descriptionLength');
      this.showDateCreated[0] = (this.todoSortField == 'dateCreated');
      this.showTaskCount[0] = (this.todoSortField == 'taskCount');

      //console.log(`updateTodoShowingField(${this.phase_idx}, 'sorting'): [${[this.showDescriptionLength[0], this.showDateCreated[0], this.showTaskCount[0]]}]`);
    });

    this.todoSearchingRulesListener = this.common.todoSearchingRulesChange.subscribe(results => {
      this.todoSearchRules = results;

      this.showDescriptionLength[1] = false;
      this.showDateCreated[1] = false;
      this.showTaskCount[1] = false;

      for (let fieldName of results.keys())
      {
        this.showDescriptionLength[1] ||= (fieldName == 'descriptionLength');
        this.showDateCreated[1] ||= (fieldName == 'dateCreated');
        this.showTaskCount[1] ||= (fieldName == 'taskCount');
      }

      //console.log(`updateTodoShowingField(${this.phase_idx}, 'searching'): [${[this.showDescriptionLength[1], this.showDateCreated[1], this.showTaskCount[1]]}]`);

      this.notifyTodoSearchResults();
    });
  }

  ngOnDestroy(): void {
    this.todoSearchingCaseSenseListener.unsubscribe();
    this.todoSearchingHighlightListener.unsubscribe();

    this.todoSortingSettingsListener.unsubscribe();

    this.todoSearchingRulesListener.unsubscribe();
  }
}
