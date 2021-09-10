import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-ff-todo-sorting-form',
  templateUrl: './ff-todo-sorting-form.component.html',
  styleUrls: ['./ff-todo-sorting-form.component.css']
})
export class FfTodoSortingFormComponent implements OnInit, OnDestroy {

  @Output() todosortfieldChange = new EventEmitter<String>();
  @Output() todosortdirChange = new EventEmitter<Boolean>();
  @Output() todosortResetTrigger = new EventEmitter<void>();

  @Input() preparingFormEvent!: Observable<void>;

  @Input() todo_list_count!: number;

  @Input() todosortfield!: String;
  @Input() todosortdir!: Boolean;

  @Input() phase_label!: String;

  @ViewChild('sortTodoForm') formElement!: TemplateRef<FfTodoSortingFormComponent>;

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

  constructor(private modalService: NgbModal) {
    this.todosortfield = '';
    this.todosortdir = false;
  }

  resetTodoSorting() {
    this.todosortResetTrigger.emit();
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
  }

  ngOnDestroy(): void {
    this.preparingFormListener.unsubscribe();
  }

}
