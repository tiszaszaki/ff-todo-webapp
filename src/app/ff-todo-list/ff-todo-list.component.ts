import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subscription } from 'rxjs';
import { FfTodoGenericTodoFormComponent } from '../ff-todo-generic-todo-form/ff-todo-generic-todo-form.component';
import { FfTodoRealRequestService } from '../ff-todo-real-request.service';
import { ShiftDirection } from '../shift-direction';
import { Task } from '../task';
import { TaskOperator } from '../task-operator';
import { Todo } from '../todo';
import { TodoOperator } from '../todo-operator';
import { TiszaSzakiAlert } from '../tsz-alert';

@Component({
  selector: 'app-ff-todo-list',
  templateUrl: './ff-todo-list.component.html',
  styleUrls: ['./ff-todo-list.component.css']
})
export class FfTodoListComponent implements OnInit, OnDestroy {

  @Output() updateReadonlyTodo = new EventEmitter<Boolean>();
  @Output() updateTodoCount = new EventEmitter<number>();
  @Output() toggleRestoreTodos = new EventEmitter<Boolean>();

  @Output() addAlertMessage = new EventEmitter<TiszaSzakiAlert>();

  @Input() prepareAddTodoFormEvent!: Observable<void>;
  @Input() prepareRemovingAllTodosEvent!: Observable<void>;
  @Input() initTodoListEvent!: Observable<void>;
  @Input() restoreTodoListEvent!: Observable<void>;

  @ViewChild('FfTodoGenericTodoFormComponent', { static: false }) private genericTodoForm!: TemplateRef<FfTodoGenericTodoFormComponent>;

  private prepareAddTodoFormListener!: Subscription;
  private prepareRemovingAllTodosListener!: Subscription;
  private initTodoListListener!: Subscription;
  private restoreTodoListListener!: Subscription;

  public addTodoFormShown: Boolean = false;
  public editTodoFormShown: Boolean = false;
  public removeTodoFormShown: Boolean = false;
  public removeAllTodosFormShown: Boolean = false;

  public addTaskFormShown: Boolean = false;
  public editTaskFormShown: Boolean = false;
  public removeTaskFormShown: Boolean = false;
  public removeAllTasksFormShown: Boolean = false;

  public todoQuerySuccess!: Boolean;

  public todo_count!: number;
  public todo_list!: Todo[][];
  public task_count!: number[];

  public todoSelected!: Todo;
  public taskSelected!: Task;

  public todoId!: number;

  private oldPhase! : number;

  public todo_sorting_field: String[] = [];
  public todo_sorting_direction: Boolean[] = [];
  public todo_sorting_executed: Boolean[] = [];

  public task_sorting_field: String[] = [];
  public task_sorting_direction: Boolean[] = [];
  public task_sorting_executed: Boolean[] = [];

  public todo_searching_casesense!: Boolean;
  public todo_searching_term!: String;
  public todo_searching_field!: String;

  public searchSubmitted: Boolean = false;

  public displayDateFormat: string = 'yyyy-MM-dd HH:mm:ss.sss';
  public inputDateFormat: string = 'yyyy-MM-dd HH:mm:ss';

  public phase_labels = ['Backlog', 'In progress', 'Done'];

  public phaseNum!: number;
  public descriptionMaxLength! : number;

  public readonlyTodo = false;
  public readonlyTask = false;

  public enabledRestoreTodos = false;

  public showDescriptionLength: Boolean[][] = [];
  public showTaskCount: Boolean[][] = [];
  public showDateCreated: Boolean[][] = [];

  public readonly ADD_TODO = TodoOperator.ADD;
  public readonly EDIT_TODO = TodoOperator.EDIT;
  public readonly REMOVE_TODO = TodoOperator.REMOVE;
  public readonly REMOVE_ALL_TODOS = TodoOperator.REMOVE_ALL;

  public readonly ADD_TASK = TaskOperator.ADD;
  public readonly EDIT_TASK = TaskOperator.EDIT;
  public readonly REMOVE_TASK = TaskOperator.REMOVE;
  public readonly REMOVE_ALL_TASKS = TaskOperator.REMOVE_ALL;

  public readonly LEFT = ShiftDirection.LEFT;
  public readonly RIGHT = ShiftDirection.RIGHT;

  constructor(private todoServ: FfTodoRealRequestService, private modalService: NgbModal) {
    this.initTodoList([]);
  }

  initTodoList(phase_list?: number[]) {
    this.phaseNum = this.phase_labels.length;
    this.descriptionMaxLength = 1024;

    this.todo_searching_casesense = false;
    this.todo_searching_term = '';
    this.todo_searching_field = '';

    if (!phase_list)
    {
      phase_list = [];
    }

    this.getTodos(new Set(phase_list));
  }

  refreshTodoList() {
    this.addAlertMessage.emit({type:'warning', message: 'Trying to refresh all Todos...'});
    this.initTodoList();
  }

  restoreTodoList() {
    this.addAlertMessage.emit({type:'warning', message: 'Trying to restore all Todos...'});
  }

  updateSearchSubmit(state: Boolean) {
    this.searchSubmitted = state;
    this.getTodos(new Set());
  }

  updateTodoSearchingCaseSense(casesense: Boolean) {
    this.todo_searching_casesense = casesense;
    console.log(`updateTodoSearchingCaseSense: "${casesense}"`);
  }

  updateTodoSearchingTerm(term: String) {
    this.todo_searching_term = term;
    console.log(`updateTodoSearchingTerm: "${term}"`);
  }

  updateTodoSearchingField(fieldName: String) {
    this.todo_searching_field = fieldName;
    console.log(`updateTodoSearchingTerm: "${fieldName}"`);

    for (let idx in this.phase_labels)
    {
      this.showDescriptionLength[idx][1] = (this.todo_searching_field == 'descriptionLength');
      this.showDateCreated[idx][1] = (this.todo_searching_field == 'dateCreated');
      this.showTaskCount[idx][1] = (this.todo_searching_field == 'taskCount');
  
      console.log(`updateTodoShowingField(${idx}, 'searching'): [${[this.showDescriptionLength[idx][1], this.showDateCreated[idx][1], this.showTaskCount[idx][1]]}]`);
    }
  }

  updateTodoSortingField(idx : number, fieldName: String) {
    if (!this.todo_sorting_executed[idx])
    {
      this.todo_sorting_executed[idx] = true;
      console.log('Todo sorting turned ON');
    }

    this.todo_sorting_field[idx] = fieldName;
    console.log(`updateTodoSortingField(${idx}): "${this.todo_sorting_field[idx]}"`);

    this.showDescriptionLength[idx][0] = (this.todo_sorting_field[idx] == 'descriptionLength');
    this.showDateCreated[idx][0] = (this.todo_sorting_field[idx] == 'dateCreated');
    this.showTaskCount[idx][0] = (this.todo_sorting_field[idx] == 'taskCount');

    console.log(`updateTodoShowingField(${idx}, 'sorting'): [${[this.showDescriptionLength[idx][0], this.showDateCreated[idx][0], this.showTaskCount[idx][0]]}]`);
  }

  updateTodoSortingDirection(idx : number, dir: Boolean) {
    if (!this.todo_sorting_executed[idx])
    {
      this.todo_sorting_executed[idx] = true;
      console.log('Todo sorting turned ON');
    }

    this.todo_sorting_direction[idx] = dir;
    console.log(`updateTodoSortingDirection(${idx}): ${dir}`);
  }

  updateTaskSortingField(idx : number, fieldName: String) {
    if (!this.task_sorting_executed[idx])
    {
      this.task_sorting_executed[idx] = true;
      console.log('Task sorting turned ON');
    }

    this.task_sorting_field[idx] = fieldName;
    console.log(`updateTaskSortingField(${idx}): "${fieldName}"`);
  }

  updateTaskSortingDirection(idx : number, dir: Boolean) {
    if (!this.task_sorting_executed[idx])
    {
      this.task_sorting_executed[idx] = true;
      console.log('Task sorting turned ON');
    }

    this.task_sorting_direction[idx] = dir;
    console.log(`updateTaskSortingDirection(${idx}): ${dir}`);
  }

  resetTodoSorting(idx : number) {
    this.todo_sorting_field[idx] = '';
    this.todo_sorting_direction[idx] = false;

    if (this.todo_sorting_executed[idx])
    {
      this.todo_sorting_executed[idx] = false;
      console.log('Todo sorting turned OFF');
    }
  }

  resetTaskSorting(idx : number) {
    this.task_sorting_field[idx] = '';
    this.task_sorting_direction[idx] = false;

    if (this.task_sorting_executed[idx])
    {
      this.task_sorting_executed[idx] = false;
      console.log('Task sorting turned OFF');
    }
  }

  private checkIfNoFormShown() {
    let result = true;
    result &&= (!this.addTodoFormShown && !this.editTodoFormShown);
    result &&= (!this.removeTodoFormShown && !this.removeAllTodosFormShown);
    result &&= (!this.addTaskFormShown && !this.editTaskFormShown);
    result &&= (!this.removeTaskFormShown && !this.removeAllTasksFormShown);
    return result;
  }

  private getTodo(id : number) {
    return this.todoServ.getTodo(id);
  }

  private getTodos(phase: Set<number>): void {
    var todo_results: Observable<Todo[]>;

    todo_results = this.todoServ.getTodos();

    this.todo_count = 0;

    this.todoQuerySuccess = false;

    if (phase.size == 0) {
      this.todo_list = [];
      this.task_count = [];

      this.todo_sorting_field = [];
      this.todo_sorting_direction = [];
      this.todo_sorting_executed = [];

      this.task_sorting_field = [];
      this.task_sorting_direction = [];
      this.task_sorting_executed = [];

      for (let todo_phase of this.phase_labels) {
        this.todo_list.push([]);
        this.task_count.push(0);

        this.todo_sorting_field.push('');
        this.todo_sorting_direction.push(false);
        this.todo_sorting_executed.push(false);

        this.task_sorting_field.push('');
        this.task_sorting_direction.push(false);
        this.task_sorting_executed.push(false);

        this.showDescriptionLength.push([false,false]);
        this.showDateCreated.push([false,false]);
        this.showTaskCount.push([false,false]);
      }
    }

    todo_results.subscribe(records => {
      let todo_records = records;

      this.todoQuerySuccess = true;

      if (phase.size > 0) {
        for (let _phase of phase) {
          if ((_phase >= 0) && (_phase < this.phaseNum)) {
            delete this.todo_list[_phase];

            this.todo_list[_phase] = [];
            this.task_count[_phase] = 0;

            this.todo_sorting_field[_phase] = '';
            this.todo_sorting_direction[_phase] = false;
            this.todo_sorting_executed[_phase] = false;

            this.task_sorting_field[_phase] = '';
            this.task_sorting_direction[_phase] = false;
            this.task_sorting_executed[_phase] = false;
          }
        }
      }

      for (let todo_idx in todo_records)
      {
        let todo=todo_records[todo_idx];
        let taskCountPerPhase=0;

        if (todo.tasks)
        {
          taskCountPerPhase = todo.tasks.length;
        }

        todo.descriptionLength = todo.description.length;
        todo.taskCount = taskCountPerPhase;

        if (phase.size == 0)
        {
          let _phase = todo.phase;
          this.todo_list[_phase].push(todo);
          this.task_count[_phase] += taskCountPerPhase;
        }
        else
        {
          for (let _phase of phase) {
            if ((_phase >= 0) && (_phase < this.phaseNum) && (todo.phase == _phase)) {
              this.todo_list[_phase].push(todo);
              this.task_count[_phase] += taskCountPerPhase;
            }
          }
        }

        for (let todo_phase of this.todo_list)
        {
          this.todo_count += todo_phase.length;
        }
  
        this.updateTodoCount.emit(this.todo_count);

        if (phase.size == 0)
        {
          console.log('Filled Todo list in all phases.');
        }
        if (phase.size > 0)
        {
          let phase_arr = [];
          for (let _phase of phase) { phase_arr.push(_phase); }
          phase_arr.sort();
          console.log(`Tried to fill Todo list only in phases (${phase_arr}).`);
        }
      }
    });
  }

  prepareAddTodoForm() {
    if (this.checkIfNoFormShown())
    {
      console.log(`Preparing form for adding new Todo...`);
      this.addTodoFormShown = !this.addTodoFormShown;
    }
  }

  prepareEditTodoForm(id : number) {
    if (this.checkIfNoFormShown())
    {
      console.log(`Preparing form for editing Todo...`);
      this.getTodo(id).subscribe(todo => {
        this.oldPhase = todo.phase;
        this.todoSelected = todo;
        this.editTodoFormShown = !this.editTodoFormShown;
      });
    }
  }

  prepareRemoveTodoForm(id : number) {
    if (this.checkIfNoFormShown())
    {
      console.log(`Preparing form for removing Todo...`);
      this.getTodo(id).subscribe(todo => {
        this.todoSelected = todo;
        this.removeTodoFormShown = !this.removeTodoFormShown;
      });
    }
  }

  prepareRemovingAllTodos() {
    if (this.checkIfNoFormShown())
    {
      console.log(`Preparing form for removing all Todos...`);
      this.removeAllTodosFormShown = !this.removeAllTodosFormShown;
    }
  }

  prepareAddTaskForm(id : number) {
    if (this.checkIfNoFormShown())
    {
      console.log(`Preparing form for editing Task...`);
      this.todoId = id;
      this.addTaskFormShown = !this.addTaskFormShown;
    }
  }

  prepareEditTaskForm(markedTask : Task) {
    if (this.checkIfNoFormShown())
    {
      console.log(`Preparing form for editing Task...`);
      this.todoId = (markedTask.todoId ? markedTask.todoId : -1);
      this.taskSelected = markedTask;
      this.editTaskFormShown = !this.editTaskFormShown;
    }
  }

  prepareRemoveTaskForm(markedTask : Task) {
    if (this.checkIfNoFormShown())
    {
      let tempTodoId = (markedTask.todoId ? markedTask.todoId : -1);
      console.log(`Preparing form for removing Task...`);
      this.todoId = tempTodoId;
      this.taskSelected = markedTask;
      this.removeTaskFormShown = !this.removeTaskFormShown;
    }
  }

  prepareRemoveAllTasksForm(id : number) {
    if (this.checkIfNoFormShown())
    {
      console.log(`Preparing form for removing all Tasks for Todo with ID (${id})...`);
      this.todoId = id;
      this.removeAllTasksFormShown = !this.removeAllTasksFormShown;
    }
  }

  addTodo(todo : Todo) {
    console.log(`Trying to add new Todo (${JSON.stringify(todo)})...`);
    this.todoServ.addTodo(todo)
    .subscribe(response => {
      this.addAlertMessage.emit({type: 'success', message: `Successfully added new Todo (${JSON.stringify(todo)}).`});
      this.getTodos(new Set([todo.phase]));
    });
  }

  updateTodo(todo : Todo) {
    let id = todo.id;
    console.log(`Trying to update Todo with ID (${id}) to (${JSON.stringify(todo)})...`);
    this.todoServ.editTodo(id, todo)
    .subscribe(_ => {
      this.addAlertMessage.emit({type: 'success', message: `Successfully updated Todo with ID (${id}) to (${JSON.stringify(todo)}).`});
      this.getTodos(new Set([this.oldPhase, todo.phase]));
    });
  }

  removeTodo(todo : Todo) {
    let id = todo.id;
    console.log(`Trying to remove Todo with ID (${id})...`);
    this.todoServ.removeTodo(id)
    .subscribe(_ => {
      this.addAlertMessage.emit({type: 'success', message: `Successfully removed Todo with ID (${id}).`});
      this.getTodos(new Set([todo.phase]));
    });
  }

  shiftTodo(todo : Todo, dir : ShiftDirection) {
    let id = todo.id;
    this.oldPhase = todo.phase;
    let new_phase = todo.phase += dir;
    todo.phase = new_phase;
    console.log(`Trying to shift Todo with ID (${id})...`);
    if ((new_phase >= 0) && (new_phase < this.phaseNum))
    {
      this.todoServ.editTodo(id, todo)
      .subscribe(_ => {
        this.addAlertMessage.emit({type: 'success', message: `Successfully shifted Todo with ID (${id}) to phase (${new_phase})...`});
        this.getTodos(new Set([this.oldPhase, new_phase]));
      });
    }
  }

  removeAllTodos() {
    this.todoServ.removeAllTodos()
    .subscribe(_ => {
      this.addAlertMessage.emit({type: 'success', message: `Successfully removed all Todos from the board...`});
      this.initTodoList([]);
    });
  }

  addTask(task : Task) {
    console.log(`Trying to add new Task (${JSON.stringify(task)}) for Todo with ID (${this.todoId})...`);
    this.todoServ.addTask(task, this.todoId)
    .subscribe(task => {
      this.todoServ.getTodo(this.todoId)
      .subscribe(todo => { 
        this.addAlertMessage.emit({type: 'success', message: `Successfully added new Task (${JSON.stringify(task)}) for Todo with ID (${todo.id}).`});
        this.getTodos(new Set([todo.phase]));
      })
    });
  }

  updateTask(patchedTask : Task) {
    let id = patchedTask.id;
    let tempTodoId = ((patchedTask.todoId !== undefined) ? patchedTask.todoId : -1);
    delete patchedTask.todoId;
    console.log(`Trying to update Task with ID (${id}) to (${JSON.stringify(patchedTask)}) for Todo with ID (${tempTodoId})...`);
    this.todoServ.editTask(patchedTask)
    .subscribe(_=> {
      this.addAlertMessage.emit({type: 'success', message: `Successfully updated Task with ID (${id}) to (${JSON.stringify(patchedTask)}) for Todo with ID (${tempTodoId}).`});
      this.getTodos(new Set([tempTodoId]));
    });
  }

  checkTask(task : Task) {
    let id = task.id;
    let tempTodoId = ((task.todoId !== undefined) ? task.todoId : -1);
    delete task.todoId;
    console.log(`Trying to check Task with ID (${id}) for Todo with ID (${tempTodoId})...`);
    this.todoServ.checkTask(id)
    .subscribe(_=> {
      this.addAlertMessage.emit({type: 'success', message: `Successfully checked Task with ID (${id}) for Todo with ID (${tempTodoId}).`});
      this.getTodos(new Set([tempTodoId]));
    });
  }

  removeTask(task : Task) {
    let id = task.id;
    let tempTodoId = ((task.todoId !== undefined) ? task.todoId : -1);
    delete task.todoId;
    console.log(`Trying to remove Task with ID (${id}) for Todo with ID (${tempTodoId})...`);
    this.todoServ.removeTask(id)
    .subscribe(_ => {
      this.todoServ.getTodo(tempTodoId)
      .subscribe(todo => { 
        this.addAlertMessage.emit({type: 'success', message: `Successfully removed Task with ID (${id}) for Todo with ID (${todo.id}).`});
        this.getTodos(new Set([todo.phase]));
      });
    });
  }

  removeAllTasks(todoId: number) {
    this.todoServ.removeAllTasks(todoId)
    .subscribe(_ => {
        console.log(`Successfully removed all Tasks from Todo with ID (${(todoId)})...`);
        this.todoServ.getTodo(todoId)
        .subscribe(todo => {
          this.addAlertMessage.emit({type: 'success', message: `Successfully removed all Tasks from Todo with ID (${todo.id}).`});
          this.getTodos(new Set([todo.phase]));
        });
    });
  }

  ngOnInit(): void {
    this.updateReadonlyTodo.emit(this.readonlyTodo);
    this.toggleRestoreTodos.emit(this.enabledRestoreTodos);

    this.prepareAddTodoFormListener = this.prepareAddTodoFormEvent.subscribe(() => this.prepareAddTodoForm());
    this.prepareRemovingAllTodosListener = this.prepareRemovingAllTodosEvent.subscribe(() => this.prepareRemovingAllTodos());
    this.initTodoListListener = this.initTodoListEvent.subscribe(() => this.refreshTodoList());
    this.restoreTodoListListener = this.restoreTodoListEvent.subscribe(() => this.restoreTodoList());
  }

  ngOnDestroy(): void {
    this.prepareAddTodoFormListener.unsubscribe();
    this.prepareRemovingAllTodosListener.unsubscribe();
    this.initTodoListListener.unsubscribe();
    this.restoreTodoListListener.unsubscribe();
  }

}
