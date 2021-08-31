import { Component, OnInit } from '@angular/core';
import { FfTodoMockRequestService } from '../ff-todo-mock-request.service';
import { ShiftDirection } from '../shift-direction';
import { Task } from '../task';
import { TaskOperator } from '../task-operator';
import { Todo } from '../todo';
import { TodoOperator } from '../todo-operator';

@Component({
  selector: 'app-ff-todo-list',
  templateUrl: './ff-todo-list.component.html',
  styleUrls: ['./ff-todo-list.component.css']
})
export class FfTodoListComponent implements OnInit {

  initTodoList(phase: number) {
    this.phaseNum = this.phase_labels.length;
    this.descriptionMaxLength = 1024;

    this.getTodos(phase);
  }

  restoreTodoList() {
    console.log('Trying to restore all Todos...');
    // TODO: implement restoring Todos
    /*
    this.todoServ.resetTodos()
    .subscribe(_ => {
      this.initTodoList(-1);
    });
    */
  }

  constructor(private todoServ: FfTodoMockRequestService) {
    this.initTodoList(-1);
  }

  updateTodoSortingField(idx : number, fieldName: String) {
    this.todo_sorting_field[idx] = fieldName;
    console.log(`updateTodoSortingField(${idx}): "${fieldName}"`);
  }

  updateTodoSortingDirection(idx : number, dir: Boolean) {
    this.todo_sorting_direction[idx] = dir;
    console.log(`updateTodoSortingDirection(${idx}): ${dir}`);
  }

  updateTaskSortingField(idx : number, fieldName: String) {
    this.task_sorting_field[idx] = fieldName;
    console.log(`updateTaskSortingField(${idx}): "${fieldName}"`);
  }

  updateTaskSortingDirection(idx : number, dir: Boolean) {
    this.task_sorting_direction[idx] = dir;
    console.log(`updateTaskSortingDirection(${idx}): ${dir}`);
  }

  resetTodoSorting(idx : number) {
    this.todo_sorting_field[idx] = '';
    this.todo_sorting_direction[idx] = false;
  }

  resetTaskSorting(idx : number) {
    this.task_sorting_field[idx] = '';
    this.task_sorting_direction[idx] = false;
  }

  addTodoFormShown: Boolean = false;
  editTodoFormShown: Boolean = false;
  removeTodoFormShown: Boolean = false;
  removeAllTodosFormShown: Boolean = false;

  addTaskFormShown: Boolean = false;
  editTaskFormShown: Boolean = false;
  removeTaskFormShown: Boolean = false;
  removeAllTasksFormShown: Boolean = false;

  checkIfNoFormShown() {
    let result = true;
    result &&= (!this.addTodoFormShown && !this.editTodoFormShown);
    result &&= (!this.removeTodoFormShown && !this.removeAllTodosFormShown);
    result &&= (!this.addTaskFormShown && !this.editTaskFormShown);
    result &&= (!this.removeTaskFormShown && !this.removeAllTasksFormShown);
    return result;
  }

  todo_count!: number;
  todo_records!: Todo[];
  todo_list!: Todo[][];
  task_count!: number[];

  todo_ids!: number[];

  todoSelected!: Todo;
  taskSelected!: Task;
  todoId!: number;

  oldPhase! : number;

  todo_sorting_field: String[] = [];
  todo_sorting_direction: Boolean[] = [];

  task_sorting_field: String[] = [];
  task_sorting_direction: Boolean[] = [];

  customDateFormat: string = 'yyyy-MM-dd hh:mm:ss.sss';

  phase_labels = ['Backlog', 'In progress', 'Done'];

  phaseNum!: number;
  descriptionMaxLength! : number;

  readonlyTodo = false;
  readonlyTask = false;

  showDescriptionLength = true;
  showTaskCount = true;
  showDateCreated = true;

  ADD_TODO = TodoOperator.ADD;
  EDIT_TODO = TodoOperator.EDIT;
  REMOVE_TODO = TodoOperator.REMOVE;
  REMOVE_ALL_TODOS = TodoOperator.REMOVE_ALL;

  ADD_TASK = TaskOperator.ADD;
  EDIT_TASK = TaskOperator.EDIT;
  REMOVE_TASK = TaskOperator.REMOVE;
  REMOVE_ALL_TASKS = TaskOperator.REMOVE_ALL;

  LEFT = ShiftDirection.LEFT;
  RIGHT = ShiftDirection.RIGHT;

  getTodo(id : number) {
    return this.todoServ.getTodo(id);
  }

  getTodos(phase: number): void {
    this.todoServ.getTodos()
    .subscribe(records => {
      this.todo_records = records;
      this.todo_count = 0;

      if (phase < 0) {
        this.todo_list = [];
        this.task_count = [];
        this.todo_ids = [];
      }

      if (phase < 0) {
        for (let todo_phase of this.phase_labels) {
          this.todo_list.push([]);
          this.task_count.push(0);
    
          this.todo_sorting_field.push('');
          this.todo_sorting_direction.push(false);
    
          this.task_sorting_field.push('');
          this.task_sorting_direction.push(false);
        }
      }
      if ((phase >= 0) && (phase < this.phaseNum)) {
        delete this.todo_list[phase];
        
        this.todo_list[phase] = [];
        this.task_count[phase] = 0;

        this.todo_sorting_field[phase] = '';
        this.todo_sorting_direction[phase] = false;
  
        this.task_sorting_field[phase] = '';
        this.task_sorting_direction[phase] = false;
    }
  
      for (let todo of this.todo_records)
      {
        let taskCountPerPhase=0;
        let _phase=todo.phase;

        if (todo.tasks)
        {
          taskCountPerPhase = todo.tasks.length;
        }

        todo.descriptionLength = todo.description.length;
        todo.taskCount = taskCountPerPhase;

        if ((phase < 0) || ((phase >= 0) && (phase < this.phaseNum) && (_phase == phase)))
        {
          this.todo_list[_phase].push(todo);
          this.task_count[_phase] += taskCountPerPhase;
          this.todo_ids.push(todo.id);
        }
      }

      for (let todo_phase of this.todo_list)
      {
        this.todo_count += todo_phase.length;
      }

      if (phase < 0)
      {
        console.log('Filled Todo list in all phases.');
      }
      if ((phase >= 0) && (phase < this.phaseNum))
      {
        console.log(`Filled Todo list only in phase (${phase}).`);
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
      this.initTodoList(todo.phase);
    });
  }

  updateTodo(todo : Todo) {
    let id = todo.id;
    console.log(`Trying to update Todo with ID (${id}) to (${JSON.stringify(todo)})...`);
    this.todoServ.editTodo(id, todo)
    .subscribe(_ => {
      this.initTodoList(this.oldPhase);
      this.initTodoList(todo.phase);
    });
  }

  removeTodo(todo : Todo) {
    let id = todo.id;
    console.log(`Trying to remove Todo with ID (${id})...`);
    this.todoServ.removeTodo(id)
    .subscribe(_ => {
      this.initTodoList(todo.phase);
    });
  }

  shiftTodo(todo : Todo, dir : ShiftDirection) {
    let id = todo.id;
    let new_phase = todo.phase += dir;
    this.oldPhase = todo.phase;
    todo.phase = new_phase;
    console.log(`Trying to shift Todo with ID (${id})...`);
    if ((new_phase >= 0) && (new_phase < this.phaseNum))
    {
      this.todoServ.editTodo(id, todo)
      .subscribe(_ => {
        console.log(`Successfully shifted Todo with ID (${id}) to phase (${new_phase})...`);
        this.initTodoList(this.oldPhase);
        this.initTodoList(new_phase);
      });
    }
  }

  removeAllTodos() {
    while (this.todo_ids.length > 0)
    {
      let id=this.todo_ids.pop();
      if (id === undefined)
      {
        id = -1;
      }
      this.todoServ.removeTodo(id)
      .subscribe(_ => {
        if (this.todo_ids.length == 0)
          console.log(`Successfully removed all Todos from the board...`);
          this.initTodoList(-1);
      });
    }
  }

  addTask(task : Task) {
    console.log(`Trying to add new Task (${JSON.stringify(task)}) for Todo with ID (${this.todoId})...`);
    this.getTodo(this.todoId).subscribe(todo => {
      this.initTodoList(todo.phase);
    });
  }

  updateTask(patchedTask : Task) {
    let id = patchedTask.id;
    let tempTodoId = ((patchedTask.todoId !== undefined) ? patchedTask.todoId : -1);
    delete patchedTask.todoId;
    console.log(`Trying to update Task with ID (${id}) to (${JSON.stringify(patchedTask)}) for Todo with ID (${tempTodoId})...`);
    this.initTodoList(tempTodoId);
  }

  checkTask(task : Task) {
    let id = task.id;
    let tempTodoId = ((task.todoId !== undefined) ? task.todoId : -1);
    delete task.todoId;
    console.log(`Trying to check Task with ID (${id}) for Todo with ID (${tempTodoId})...`);
    this.initTodoList(tempTodoId);
  }

  removeTask(task : Task) {
    let id = task.id;
    let tempTodoId = ((task.todoId !== undefined) ? task.todoId : -1);
    delete task.todoId;
    console.log(`Trying to remove Task with ID (${id}) for Todo with ID (${tempTodoId})...`);
    this.initTodoList(tempTodoId);
  }

  removeAllTasks(id : number) {
    console.log(`Trying to remove all Task for Todo with ID (${id})...`);
    this.initTodoList(-1);
  }

  ngOnInit(): void {
  }

}
