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

    this.getTodos();
  }

  constructor(private todoServ: FfTodoMockRequestService) {
    this.initTodoList(-1);
  }

  updateSortingRelatedOptions(idx : number) {
    
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

  todo_count!: number;
  todo_records!: Todo[];
  todo_list!: Todo[][];
  task_count!: number[];

  todoSelected!: Todo;
  taskSelected!: Task;
  todoId!: number;

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

  getTodos(): void {
    this.todoServ.getTodos()
    .subscribe(records => {
      this.todo_count = 0;
      this.todo_records = records;
      this.todo_list = [];
      this.task_count = [];

      for (let phase_str of this.phase_labels)
      {
        this.todo_list.push([]);
        this.task_count.push(0);
  
        this.todo_sorting_field.push('');
        this.todo_sorting_direction.push(false);
  
        this.task_sorting_field.push('');
        this.task_sorting_direction.push(false);
      }
  
      for (let todo of this.todo_records)
      {
        let taskCount=0;
        if (todo.tasks)
        {
          taskCount = todo.tasks.length;
        }
        this.todo_list[todo.phase].push(todo);
        this.task_count[todo.phase] += taskCount;
      }
      for (let todo_phase of this.todo_list)
      {
        this.todo_count += todo_phase.length;
      }
    });
  }

  prepareAddTodoForm() {
    if (!this.addTodoFormShown)
    {
      console.log(`Preparing form for adding new Todo...`);
      this.addTodoFormShown = !this.addTodoFormShown;
    }
  }

  prepareEditTodoForm(id : number) {
    if (!this.editTodoFormShown)
    {
      console.log(`Preparing form for editing Todo...`);
      this.getTodo(id).subscribe(todo => {
        this.todoSelected = todo;
        this.editTodoFormShown = !this.editTodoFormShown;
      });
    }
  }

  prepareRemoveTodoForm(id : number) {
    if (!this.removeTodoFormShown)
    {
      console.log(`Preparing form for removing Todo...`);
      this.getTodo(id).subscribe(todo => {
        this.todoSelected = todo;
        this.removeTodoFormShown = !this.removeTodoFormShown;
      });
    }
  }

  prepareRemovingAllTodos() {
    if (!this.removeAllTodosFormShown)
    {
      console.log(`Preparing form for removing all Todos...`);
      this.removeAllTodosFormShown = !this.removeAllTodosFormShown;
    }
  }

  prepareAddTaskForm(id : number) {
    if (!this.addTaskFormShown)
    {
      console.log(`Preparing form for editing Task...`);
      this.todoId = id;
      this.addTaskFormShown = !this.addTaskFormShown;
    }
  }

  prepareEditTaskForm(markedTask : Task) {
    if (!this.editTaskFormShown)
    {
      console.log(`Preparing form for editing Task...`);
      this.todoId = (markedTask.todoId ? markedTask.todoId : -1);
      this.taskSelected = markedTask;
      this.editTaskFormShown = !this.editTaskFormShown;
    }
  }

  prepareRemoveTaskForm(markedTask : Task) {
    if (!this.removeTaskFormShown)
    {
      let tempTodoId = (markedTask.todoId ? markedTask.todoId : -1);
      console.log(`Preparing form for removing Task...`);
      this.todoId = tempTodoId;
      this.taskSelected = markedTask;
      this.removeTaskFormShown = !this.removeTaskFormShown;
    }
  }

  prepareRemoveAllTasksForm(id : number) {
    if (!this.removeAllTasksFormShown)
    {
      console.log(`Preparing form for removing all Tasks for Todo with ID (${id})...`);
      this.todoId = id;
      this.removeAllTasksFormShown = !this.removeAllTasksFormShown;
    }
  }

  addTodo(todo : Todo) {
    console.log(`Trying to add new Todo (${JSON.stringify(todo)})...`);
    this.initTodoList(todo.phase);
  }

  updateTodo(todo : Todo) {
    let id = todo.id;
    console.log(`Trying to update Todo with ID (${id}) to (${JSON.stringify(todo)})...`);
    this.initTodoList(todo.phase);
  }

  removeTodo(todo : Todo) {
    let id = todo.id;
    console.log(`Trying to remove Todo with ID (${id})...`);
    this.initTodoList(todo.phase);
  }

  shiftTodo(todo : Todo, dir : ShiftDirection) {
    let id = todo.id;
    console.log(`Trying to shift Todo with ID (${id})...`);
    this.initTodoList(todo.phase);
  }

  removeAllTodos() {
    console.log(`Trying to remove all Todos from the board...`);
    this.initTodoList(-1);
  }

  addTask(task : Task) {
    console.log(`Trying to add new Task (${JSON.stringify(task)}) for Todo with ID (${this.todoId})...`);
    this.getTodo(this.todoId).subscribe(todo => {
      this.initTodoList(todo.phase);
    });
  }

  updateTask(task : Task) {
    let id = task.id;
    let tempTodoId = ((task.todoId !== undefined) ? task.todoId : -1);
    console.log(`Trying to update Task with ID (${id}) to (${JSON.stringify(task)}) for Todo with ID (${this.todoId})...`);
    this.initTodoList(tempTodoId);
  }

  checkTask(task : Task) {
    let id = task.id;
    let tempTodoId = ((task.todoId !== undefined) ? task.todoId : -1);
    console.log(`Trying to check Task with ID (${id}) for Todo with ID (${this.todoId})...`);
    this.initTodoList(tempTodoId);
  }

  removeTask(task : Task) {
    let id = task.id;
    let tempTodoId = ((task.todoId !== undefined) ? task.todoId : -1);
    console.log(`Trying to remove Task with ID (${id}) for Todo with ID (${this.todoId})...`);
    this.initTodoList(tempTodoId);
  }

  removeAllTasks(id : number) {
    console.log(`Trying to remove all Task for Todo with ID (${id})...`);
    this.initTodoList(-1);
  }

  ngOnInit(): void {
  }

}
