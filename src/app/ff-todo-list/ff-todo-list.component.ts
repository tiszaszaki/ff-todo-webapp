import { Component, OnInit } from '@angular/core';
import { FfTodoMockRequestService } from '../ff-todo-mock-request.service';
import { Todo } from '../todo';
import { TodoOperator } from '../todo-operator';

@Component({
  selector: 'app-ff-todo-list',
  templateUrl: './ff-todo-list.component.html',
  styleUrls: ['./ff-todo-list.component.css']
})
export class FfTodoListComponent implements OnInit {

  constructor(private todoServ: FfTodoMockRequestService) {
    for (let phase of this.phase_labels)
    {
      this.todo_list.push([]);
      this.task_count.push(0);

      this.todo_sorting_field.push('');
      this.todo_sorting_direction.push(false);

      this.task_sorting_field.push('');
      this.task_sorting_direction.push(false);
    }
    this.phaseNum = this.phase_labels.length;
    this.descriptionMaxLength = 1024;
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
  removeAllTodosFormShown: Boolean = false;

  todo_count: number = 0;
  todo_records: Todo[] = [];
  todo_list: Todo[][] = [];
  task_count: number[] = [];

  todoSelected!: Todo;

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
  REMOVE_ALL_TODOS = TodoOperator.REMOVE_ALL;

  getTodo(id : number) {
    return this.todoServ.getTodo(id);
  }

  getTodos(): void {
    this.todoServ.getTodos()
    .subscribe(records => {
      this.todo_records = records;
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
    this.addTodoFormShown = !this.addTodoFormShown;
  }

  addTodo(todo : Todo) {
    if (!todo.description)
    {
      todo.description = '';
    }
    console.log(`Trying to add new Todo (${JSON.stringify(todo)})...`);
  }

  updateTodo(todo : Todo) {
    let id = todo.id;
    if (!todo.description)
    {
      todo.description = '';
    }
    console.log(`Trying to update Todo with ID (${id}) to (${JSON.stringify(todo)})...`);
  }

  prepareEditTodoForm(id : number) {
    this.getTodo(id).subscribe(todo => {
      this.todoSelected = todo;
      this.editTodoFormShown = !this.editTodoFormShown;
    });
  }

  prepareRemovingAllTodos() {
    this.removeAllTodosFormShown = !this.removeAllTodosFormShown;
  }

  removeAllTodos() {
    console.log(`Trying to remove all Todos from the board...`);
  }

  ngOnInit(): void {
    this.getTodos();
  }

}
