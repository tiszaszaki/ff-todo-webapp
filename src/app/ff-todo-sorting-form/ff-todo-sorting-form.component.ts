import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subscription } from 'rxjs';
import { FfTodoCommonService } from '../ff-todo-common.service';

@Component({
  selector: 'app-ff-todo-sorting-form',
  templateUrl: './ff-todo-sorting-form.component.html',
  styleUrls: ['./ff-todo-sorting-form.component.css']
})
export class FfTodoSortingFormComponent implements OnInit, OnChanges, OnDestroy {

  @Input() preparingFormEvent!: Observable<void>;

  @Input() todo_list_count!: number;

  @Input() phase_idx!: number;

  @ViewChild('sortTodoForm') formElement!: TemplateRef<FfTodoSortingFormComponent>;

  public todosortfield!: String;
  public todosortdir!: Boolean;
  public todoSortingSettingsListener!: Subscription;

  private preparingFormListener!: Subscription;

  public readonly todoSortingFields = [
    {name: '', display: '(unsorted)'},
    {name: 'id', display: 'Todo ID'},
    {name: 'name', display: 'Todo name'},
    {name: 'description', display: 'Todo description'},
    {name: 'descriptionLength', display: 'Todo description length'},
    {name: 'taskCount', display: 'Task count in Todo'},
    {name: 'dateCreated', display: 'Date of Todo created'},
    {name: 'dateModified', display: 'Date of Todo updated'}
  ];

  constructor(
      private modalService: NgbModal,
      private common: FfTodoCommonService) {
    this.todosortfield = '';
    this.todosortdir = false;
  }

  getTodoPhaseLabel() {
    return this.common.getTodoPhaseLabel(this.phase_idx);
  }

  resetTodoSorting() {
    this.common.resetTodoSortingSettings(this.phase_idx);
  }

  showModal()
  {
    console.log(`Trying to open a modal with ID (sortTodoForm)...`);

    const tempModal = this.modalService.open(this.formElement);

    tempModal.result.then((result) => {
      console.log(`sortTodoForm: ${result}`);
    }, (reason) => {
      console.log(`sortTodoForm: ${this.getDismissReason(reason)}`);
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

    this.todoSortingSettingsListener = this.common.todoSortingSettingsChange.subscribe(result => {
      this.todosortfield = result.field;
      this.todosortdir = result.dir;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.common.updateTodoSortingSettings(this.phase_idx, this.todosortfield, this.todosortdir);
  }

  ngOnDestroy(): void {
    this.preparingFormListener.unsubscribe();

    this.todoSortingSettingsListener.unsubscribe();
  }

}
