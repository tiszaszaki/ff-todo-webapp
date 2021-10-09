import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { NgbDateStruct, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-ff-todo-bootstrap-date-time-picker',
  templateUrl: './ff-todo-bootstrap-date-time-picker.component.html',
  styleUrls: ['./ff-todo-bootstrap-date-time-picker.component.css']
})
export class FfTodoBootstrapDateTimePickerComponent implements OnInit, OnChanges {

  @Input() model?: Date;
  @Output() modelChange = new EventEmitter<Date>();

  @Input() readonlyModel!: Boolean;

  @Input() inputDateFormat!: String;
  @Input() inputDateFormatDisp!: String;

  public dateModel!: NgbDateStruct;
  public timeModel!: NgbTimeStruct;

  public deadlinePicker_collapse_status: boolean = true;

  constructor() { }

  private fetchDeadline() {
    if (this.model)
    {
      let deadline: Date = this.model;
      this.dateModel = {year: deadline.getUTCFullYear(), month: deadline.getUTCMonth() + 1, day: deadline.getUTCDate()};
      this.timeModel = {hour: deadline.getUTCHours(), minute: deadline.getUTCMinutes(), second: deadline.getUTCSeconds()};
    }
  }

  updateDeadlineDate(event: NgbDateStruct) {
    if (!this.timeModel)
    {
      let deadline=new Date();
      this.timeModel = {hour: deadline.getUTCHours(), minute: deadline.getUTCMinutes(), second: deadline.getUTCSeconds()};
    }
    this.model = new Date(
      event.year+'-'+event.month+'-'+event.day+
      ' '+this.timeModel.hour+':'+this.timeModel.minute+':'+this.timeModel.second
    );
    this.modelChange.emit(this.model);
    this.fetchDeadline();
  }

  updateDeadlineTime(event: NgbTimeStruct) {
    if (!this.dateModel)
    {
      let deadline=new Date();
      this.dateModel = {year: deadline.getUTCFullYear(), month: deadline.getUTCMonth() + 1, day: deadline.getUTCDate()};
    }
    this.model = new Date(
      this.dateModel.year+'-'+this.dateModel.month+'-'+this.dateModel.day+
      ' '+event.hour+':'+event.minute+':'+event.second
    );
    this.modelChange.emit(this.model);
    this.fetchDeadline();
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

}
