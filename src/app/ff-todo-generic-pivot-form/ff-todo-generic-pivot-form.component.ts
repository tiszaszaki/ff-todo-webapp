import { Component, ElementRef, Input, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subscription } from 'rxjs';
import { FfTodoAbstractRequestService } from '../ff-todo-abstract-request.service';
import { FfTodoCommonService } from '../ff-todo-common.service';
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

  private queryStatus: Boolean = false;

  public formId: String = "";

  public formTitle!: String;

  public pivotMessage!: String;

  public model!: PivotResponse;

  private preparingFormListener!: Subscription;

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
    this.todoServ.pivotQuery(this.pivotId).subscribe(results => {
      this.model = results;
      this.queryStatus = true;
    });
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
    return JSON.stringify(obj);
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
