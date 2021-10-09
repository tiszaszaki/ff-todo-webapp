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

  public modelStr!: String;

  public deadlinePicker_collapse_status: boolean = true;

  constructor() { }

  private fetchDeadline() {
    if (this.model)
    {
      this.model = new Date(Date.parse(this.model.toString()));
  
      this.dateModel = {year: this.model.getFullYear(), month: this.model.getMonth() + 1, day: this.model.getDate()};
      this.timeModel = {hour: this.model.getHours(), minute: this.model.getMinutes(), second: this.model.getSeconds()};
  
      this.modelStr = this.formatDeadlineStr(this.dateModel.year,this.dateModel.month,this.dateModel.day,
        this.timeModel.hour,this.timeModel.minute,this.timeModel.second);
    }
  }

  private leadingZero(n: Number): String {
    return ((n < 10) ? "0" + n : n.toString());
  }

  private formatDeadlineStr(year: Number, month: Number, day: Number, hour: Number, minute: Number, second: Number) {
    let result =
      year + '-' + this.leadingZero(month) + '-' + this.leadingZero(day) +
      ' ' + this.leadingZero(hour) + ':' + this.leadingZero(minute) + ':' + this.leadingZero(second);

    return result;
  }

  updateDeadlineDate(event?: NgbDateStruct) {
    if (!this.timeModel)
    {
      let deadline=new Date();
      this.timeModel = {hour: deadline.getHours(), minute: deadline.getMinutes(), second: deadline.getSeconds()};
    }

    if (event)
    {
      this.modelStr = this.formatDeadlineStr(event.year,event.month,event.day,
        this.timeModel.hour,this.timeModel.minute,this.timeModel.second);
    }
    else
    {
      this.modelStr = this.formatDeadlineStr(this.dateModel.year,this.dateModel.month,this.dateModel.day,
        this.timeModel.hour,this.timeModel.minute,this.timeModel.second);
    }

    this.model = new Date(this.modelStr as string);
    this.modelChange.emit(this.model);
  }

  updateDeadlineTime(event?: NgbTimeStruct) {
    if (!this.dateModel)
    {
      let deadline=new Date();
      this.dateModel = {year: deadline.getFullYear(), month: deadline.getMonth() + 1, day: deadline.getDate()};
    }

    if (event)
    {
      this.modelStr = this.formatDeadlineStr(this.dateModel.year,this.dateModel.month,this.dateModel.day,
        event.hour,event.minute,event.second);
    }
    else
    {
      this.modelStr = this.formatDeadlineStr(this.dateModel.year,this.dateModel.month,this.dateModel.day,
        this.timeModel.hour,this.timeModel.minute,this.timeModel.second);
    }

    this.model = new Date(this.modelStr as string);
    this.modelChange.emit(this.model);
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.model)
    {
      this.fetchDeadline();
    }
  }

}
