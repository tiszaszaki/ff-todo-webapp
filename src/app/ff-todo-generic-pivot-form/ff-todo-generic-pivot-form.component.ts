import { Component, ElementRef, Input, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subscription } from 'rxjs';
import { FfTodoAbstractRequestService } from '../ff-todo-abstract-request.service';
import { FfTodoCommonService } from '../ff-todo-common.service';
import { GenericQueryStatus } from '../generic-query-status';
import { PivotResponse } from '../pivot-response';

@Component({
  selector: 'app-ff-todo-generic-pivot-form',
  templateUrl: './ff-todo-generic-pivot-form.component.html',
  styleUrls: ['./ff-todo-generic-pivot-form.component.css']
})
export class FfTodoGenericPivotFormComponent implements OnInit, OnDestroy {

  @Input() preparingFormEvent!: Observable<void>;

  @ViewChild('genericPivotForm') formElement!: ElementRef;

  public pivotId: String = "";

  public pivotQueryStatus: GenericQueryStatus = GenericQueryStatus.QUERY_STANDBY;

  public formId: String = "";

  public formTitle!: String;

  public pivotMessage!: String;

  public model!: PivotResponse;

  private preparingFormListener!: Subscription;

  public readonly QUERY_STANDBY = GenericQueryStatus.QUERY_STANDBY;
  public readonly QUERY_INPROGRESS = GenericQueryStatus.QUERY_INPROGRESS;
  public readonly QUERY_SUCCESS = GenericQueryStatus.QUERY_SUCCESS;
  public readonly QUERY_FAILURE = GenericQueryStatus.QUERY_FAILURE;

  public readonly pivotLabels = [
    {name: '', display: '(no pivot query)'},
    {name: 'board-readiness', display: 'Readiness of Boards'},
    {name: 'todo-readiness', display: 'Readiness of Todo cards'}
  ];

  constructor(
      private modalService: NgbModal,
      private common: FfTodoCommonService,
      private todoServ: FfTodoAbstractRequestService) { }

  private updateQuery() {
    if (this.pivotQueryStatus == this.QUERY_STANDBY)
    {
      this.pivotQueryStatus = this.QUERY_INPROGRESS;
      setTimeout(() =>
      this.todoServ.pivotQuery(this.pivotId).subscribe(results => {
        this.model = results;
        this.pivotQueryStatus = GenericQueryStatus.QUERY_SUCCESS;
        setTimeout(() => this.pivotQueryStatus = this.QUERY_STANDBY, 2000);
      }, error => {
        this.pivotQueryStatus = GenericQueryStatus.QUERY_FAILURE;
        setTimeout(() => this.pivotQueryStatus = this.QUERY_STANDBY, 2000);
      }), 250);
    }
  }

  public updateDisplay() {
    this.formTitle = 'No pivot table';
    this.pivotMessage = 'This form needs to be set up properly to show pivot table.';

    this.model = {fields: new Map<string,string>(), records: []};
    this.pivotId = this.pivotId.trim();
    this.formId = "default-pivot";

    if (this.pivotId != "")
    {
      this.formId = this.pivotId;
      this.formTitle = `Pivot with ID '${this.pivotId}'`;
      this.pivotMessage = `This table is showing pivot records queried from backend using ID '${this.pivotId}.'`;
      this.updateQuery();
    }
  }

  private resetDisplay() {
    this.pivotId = "";
  }

  objectToString(obj: object)
  {
    let result = JSON.stringify(obj);
    console.log(result);
    return result;
  }

  showModal()
  {
    const tempModal = this.modalService.open(this.formElement, this.common.getCommonModalSettings());

    tempModal.result.then((result) => {
      this.resetDisplay();
    }, (reason) => {
      this.resetDisplay();
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'Closed by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'Closed by clicking on a backdrop';
    } else {
      return `${reason}`;
    }
  }

  ngOnInit(): void {
    this.preparingFormListener = this.preparingFormEvent.subscribe(() => this.showModal());
    this.updateDisplay();
  }

  ngOnChanges(changes: SimpleChanges) {
  }

  ngOnDestroy() {
    this.preparingFormListener.unsubscribe();
  }
}
