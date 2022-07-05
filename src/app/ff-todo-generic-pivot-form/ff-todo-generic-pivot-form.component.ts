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

  public displayDateFormat!: string;

  public model!: PivotResponse;

  private preparingFormListener!: Subscription;

  public readonly QUERY_STANDBY = GenericQueryStatus.QUERY_STANDBY;
  public readonly QUERY_INPROGRESS = GenericQueryStatus.QUERY_INPROGRESS;
  public readonly QUERY_SUCCESS = GenericQueryStatus.QUERY_SUCCESS;
  public readonly QUERY_FAILURE = GenericQueryStatus.QUERY_FAILURE;

  public readonly pivotLabels = [
    {name: '', display: '(no pivot query)'},
    {name: 'board-readiness', display: 'Readiness of Boards'},
    {name: 'todo-readiness', display: 'Readiness of Todo cards'},
    {name: 'board-latest-update', display: 'Latest update information of Boards'},
    {name: 'todo-latest-update', display: 'Latest update information of Todo cards'}
  ];

  constructor(
      private modalService: NgbModal,
      private common: FfTodoCommonService,
      private todoServ: FfTodoAbstractRequestService) {
    this.displayDateFormat = this.common.displayDateFormat;
  }

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

    this.model = {
      fields: new Set<{key:string,value:string}>(),
      fieldDisplay: new Set<{key:string,value:string}>(),
      fieldOrder: [],
      records: []
    };
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

  isFieldDateTime(fieldType: string) {
    let result = false;
    if (fieldType != "")
    {
      let temp = this.parseFieldTypeRole(fieldType);
      let types = ["date", "datetime"];
      result = ((temp.length == 1) || (temp.length == 2));
      result &&= (types.find(e => e == temp[0]) !== undefined);
    }
    return result;
  }

  isFieldInteger(fieldType: string) {
    let result = false;
    if (fieldType != "")
    {
      let temp = this.parseFieldTypeRole(fieldType);
      let types = ["int32", "int64", "integer", "int", "long"];
      result = ((temp.length == 1) || (temp.length == 2));
      result &&= (types.find(e => e == temp[0]) !== undefined);
    }
    return result;
  }

  isFieldReal(fieldType: string) {
    let result = false;
    if (fieldType != "")
    {
      let temp = this.parseFieldTypeRole(fieldType);
      let types = ["float", "double", "real"];
      result = ((temp.length == 1) || (temp.length == 2));
      result &&= (types.find(e => e == temp[0]) !== undefined);
    }
    return result;
  }

  isFieldString(fieldType: string) {
    let result = false;
    if (fieldType != "")
    {
      let temp = this.parseFieldTypeRole(fieldType);
      let types = ["str", "string"];
      result = ((temp.length == 1) || (temp.length == 2));
      result &&= (types.find(e => e == temp[0]) !== undefined);
    }
    return result;
  }

  isFieldKey(fieldType: string) {
    let result = false;
    if (fieldType != "")
    {
      let temp = this.parseFieldTypeRole(fieldType);
      result = ((temp.length == 1) || (temp.length == 2));
      result &&= temp[1] == "key";
    }
    return result;
  }

  isFieldPercent(fieldType: string) {
    let result = false;
    if (fieldType != "")
    {
      let temp = this.parseFieldTypeRole(fieldType);
      result = ((temp.length == 1) || (temp.length == 2));
      result &&= this.isFieldReal(fieldType);
      result &&= temp[1] == "percent";
    }
    return result;
  }

  parseFieldTypeRole(fieldType: string) {
    let result = ["string"];
    if (fieldType != "")
    {
      let temp = fieldType.toLowerCase().split(",");
      if ((temp.length == 1) || (temp.length == 2))
      {
        result = [];
        for (let e of temp) result.push(e);
      }
    }
    return result;
  }

  getFieldType(fieldName: string) {
    let result = "";
    for (let elem of this.model.fields)
    {
      if (elem.key == fieldName)
      {
        result = elem.value;
        break;
      }
    }
    return result;
  }

  getFieldDisplay(fieldName: string) {
    let result = "";
    for (let elem of this.model.fieldDisplay)
    {
      if (elem.key == fieldName)
      {
        result = elem.value;
        break;
      }
    }
    return result;
  }

  getFieldTooltip(fieldName: string) {
    let fieldType = this.getFieldType(fieldName);
    let parsedType: string[] = [];
    let result = "";
    if (fieldType != "")
      parsedType = this.parseFieldTypeRole(fieldType);
    if ((fieldName != "") && ((parsedType.length == 1) || (parsedType.length == 2)))
    {
      result = `Field '${fieldName}' with type '${parsedType[0]}'`;
      if (this.isFieldKey(fieldType))
        result += ` which is a key`;
      else
      {
        if (parsedType.length == 2)
          result += ` and role '${parsedType[1]}'`;
        result += ` which is an ordinary field`;
      }
    }
    return result;
  }

  private resetDisplay() {
    this.pivotId = "";
  }

  objectToString(obj: object)
  {
    let result = JSON.stringify(obj);
    return result;
  }

  showModal()
  {
    const tempModal = this.modalService.open(this.formElement, this.common.getCommonModalSettings("", "xl"));

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
