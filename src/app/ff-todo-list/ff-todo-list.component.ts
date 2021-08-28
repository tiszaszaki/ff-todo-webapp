import { Component, OnInit } from '@angular/core';
import { FfTodoMockRequestService } from '../ff-todo-mock-request.service';
import { Todo } from '../todo';

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

  todo_count: number = 0;
  todo_records: Todo[] = [];
  todo_list: Todo[][] = [];
  task_count: number[] = [];

  todo_sorting_field: string[] = [];
  todo_sorting_direction: Boolean[] = [];

  task_sorting_field: string[] = [];
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

  addTodo(todo : Todo) {
    console.log('Trying to add a new Todo...');
    this.todoServ.addTodo(todo);
  }

  removeAllTodos() {
    console.log('Trying to remove all Todos from the board...');
  }

  ngOnInit(): void {
    this.getTodos();
  }

}
