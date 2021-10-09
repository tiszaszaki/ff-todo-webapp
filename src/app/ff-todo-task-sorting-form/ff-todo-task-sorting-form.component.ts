import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subscription } from 'rxjs';
import { FfTodoCommonService } from '../ff-todo-common.service';

@Component({
  selector: 'app-ff-todo-task-sorting-form',
  templateUrl: './ff-todo-task-sorting-form.component.html',
  styleUrls: ['./ff-todo-task-sorting-form.component.css']
})
export class FfTodoTaskSortingFormComponent implements OnInit, OnChanges, OnDestroy {

  @Input() preparingFormEvent!: Observable<void>;

  @Input() task_list_count!: number;

  @Input() phase_idx!: number;

  @ViewChild('sortTaskForm') formElement!: TemplateRef<FfTodoTaskSortingFormComponent>;

  public tasksortfield!: String;
  public tasksortdir!: Boolean;
  public taskSortingSettingsListener!: Subscription;

  private preparingFormListener!: Subscription;

  public readonly taskSortingFields = [
    {name: '', display: '(unsorted)'},
    {name: 'id', display: 'Task ID'},
    {name: 'name', display: 'Task name'},
    {name: 'done', display: 'Task checked'},
    {name: 'deadline', display: 'Deadline of Task'}
  ];

  constructor(
      private modalService: NgbModal,
      private common: FfTodoCommonService) {
    this.tasksortfield = '';
    this.tasksortdir = false;
  }

  getTodoPhaseLabel() {
    return this.common.getTodoPhaseLabel(this.phase_idx);
  }

  updateTaskSorting() {
    this.common.updateTaskSortingSettings(this.phase_idx, this.tasksortfield, this.tasksortdir);
  }

  resetTaskSorting() {
    this.common.resetTaskSortingSettings(this.phase_idx);
  }

  showModal()
  {
    //console.log(`Trying to open a modal with ID (sortTaskForm)...`);

    const tempModal = this.modalService.open(this.formElement);

    tempModal.result.then((result) => {
      //console.log(`sortTaskForm: ${result}`);
      this.updateTaskSorting();
    }, (reason) => {
      //console.log(`sortTaskForm: ${this.getDismissReason(reason)}`);
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

    this.taskSortingSettingsListener = this.common.taskSortingSettingsChange.subscribe(result => {
      if (this.phase_idx == result.phase)
      {
        this.tasksortfield = result.field;
        this.tasksortdir = result.dir;
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  ngOnDestroy(): void {
    this.preparingFormListener.unsubscribe();

    this.taskSortingSettingsListener.unsubscribe();
  }

}
