import { Component, ElementRef, Input, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subscription } from 'rxjs';
import { FfTodoAbstractRequestService } from '../ff-todo-abstract-request.service';
import { FfTodoCommonService } from '../ff-todo-common.service';

@Component({
  selector: 'app-ff-todo-generic-pivot-form',
  templateUrl: './ff-todo-generic-pivot-form.component.html',
  styleUrls: ['./ff-todo-generic-pivot-form.component.css']
})
export class FfTodoGenericPivotFormComponent implements OnInit, OnDestroy {

  @Input() preparingFormEvent!: Observable<String>;

  @ViewChild('genericPivotForm') formElement!: ElementRef;

  private pivotId: String = "";

  private queryStatus: Boolean = false;

  public formId: String = "";

  public formTitle!: String;

  public pivotMessage!: String;

  public model: object[] = [];

  private preparingFormListener!: Subscription;

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

  private updateDisplay() {
    this.formTitle = '<Form title to be filled>';
    this.pivotMessage = '<Confirm message to be filled>';

    this.pivotId = this.pivotId.trim();

    if (this.pivotId != "")
    {
      this.formId = this.pivotId;
      this.formTitle = `Pivot with ID '${this.pivotId}'`;
      this.pivotMessage = `This pivot is showing records queried from backend using ID '${this.pivotId}.'`;
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
    this.preparingFormListener = this.preparingFormEvent.subscribe(pivotId => 
    {
      this.pivotId = pivotId;
      this.showModal();
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.queryStatus)
      this.updateDisplay();
  }

  ngOnDestroy() {
    this.preparingFormListener.unsubscribe();
  }
}
