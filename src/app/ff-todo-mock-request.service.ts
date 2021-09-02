import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Todo } from './todo';
import { Task } from './task';
import { ShiftDirection } from './shift-direction';

@Injectable({
  providedIn: 'root'
})
export class FfTodoMockRequestService {

  private baseurl = 'ff-todo/';
  private todoPath! : string;
  private taskPath! : string;

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) {
    this.todoPath = this.baseurl + 'todo/';
    this.taskPath = this.baseurl + 'task/';
  }

  getTodo(id : number) : Observable<Todo> {
    return this.http.get<Todo>(this.todoPath + id).pipe(
        tap((todo : Todo) => console.log(`Fetched Todo: (${JSON.stringify(todo)})`)),
        catchError((error: HttpErrorResponse) => {
          console.error(error);
          return throwError(error);
        })
    );
  }

  getTodos() : Observable<Todo[]> {
    return this.http.get<Todo[]>(this.todoPath).pipe(
        map((todos : Todo[]) => {
          let result: Todo[] = [];
          let tasks: Task[] = [];

          console.log(`Fetched ${todos.length} Todo(s)`);

          this.getAllTasks().subscribe(_tasks => tasks = _tasks);

          for (let todo of todos) {
            todo.tasks = [];

            for (let task of tasks) {
              if (task.todoId == todo.id) {
                todo.tasks.push(JSON.parse(JSON.stringify(task)));
              }
            }

            result.push(todo);
          }

          return result;
        }),
        catchError((error: HttpErrorResponse) => {
          console.error(error);
          return throwError(error);
        })
    );
  }

  searchTodoByField(term: String, field: String): Observable<Todo[]> {
    if (!term.trim() || !field.trim()) {
      return of([]);
    }
    return this.http.get<Todo[]>(this.todoPath + `/?${field}=${term}`).pipe(
      tap(todos => todos.length ?
        console.log(`Found Todos matching "${term} (field: ${field})": ${JSON.stringify(todos)}`) :
        console.log(`No Todos matching "${term} (field: ${field})"`)),
      catchError((error: HttpErrorResponse) => {
        console.error(error);
        return throwError(error);
      })
    );
  }

  addTodo(todo: Todo): Observable<Todo> {
    return this.http.post<Todo>(this.todoPath, todo, this.httpOptions).pipe(
      tap((newTodo: Todo) => console.log(`Added new Todo: ${JSON.stringify(newTodo)}`)),
      catchError((error: HttpErrorResponse) => {
        console.error(error);
        return throwError(error);
      })
    )
  }

  editTodo(id : number, patchedTodo: Todo): Observable<any> {
    delete patchedTodo.datemodified;
    patchedTodo.datemodified = new Date();
    return this.http.put(this.todoPath + patchedTodo.id, patchedTodo).pipe(
      tap(_ => console.log(`Edited Todo with ID (${patchedTodo.id}) to (${JSON.stringify(patchedTodo)})`)),
      catchError((error: HttpErrorResponse) => {
        console.error(error);
        return throwError(error);
      })
    );
  }

  shiftTodo(id : number, dir: ShiftDirection): Observable<any> {
    return of([]);
  }

  removeTodo(id: number): Observable<any> {
    return this.http.delete(this.todoPath + id).pipe(
      tap(_ => console.log(`Removed Todo with ID (${id})`)),
      catchError((error: HttpErrorResponse) => {
        console.error(error);
        return throwError(error);
      })
    );
  }

  removeAllTodos(): Observable<any> {
    return of([]);
  }

  resetTodos(): Observable<any> {
    return this.http.post(this.baseurl + 'commands/resetdb', undefined).pipe(
      tap(_ => console.log('Restored all Todos')),
      catchError((error: HttpErrorResponse) => {
        console.error(error);
        return throwError(error);
      })
    );
  }

  private getAllTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.taskPath).pipe(
      tap((tasks : Task[]) => {
        console.log(`Fetched ${tasks.length} Task(s)`);
      }),
      catchError((error: HttpErrorResponse) => {
        console.error(error);
        return throwError(error);
      })
    );
  }

  private getTasksFromTodo(todoId: number): Observable<Task[]> {
    return this.http.get<Task[]>(this.taskPath).pipe(
      map((tasks : Task[]) => {
        let filtered_tasks = [];
        for (let task of tasks) {
          if (task.todoId == todoId) {
            filtered_tasks.push(task);
          };
        }
        console.log(`Fetched ${filtered_tasks.length} Task(s) from Todo with ID (${todoId})`);
        return filtered_tasks;
      }),
      catchError((error: HttpErrorResponse) => {
        console.error(error);
        return throwError(error);
      })
    );
  }

  addTask(task: Task, todoId: number): Observable<Task> {
    task.todoId = todoId;
    return this.http.post<Task>(this.taskPath, task, this.httpOptions).pipe(
      tap((newTask: Task) => console.log(`Added new Task for Todo with ID (${todoId}): ${JSON.stringify(newTask)}`)),
      catchError((error: HttpErrorResponse) => {
        console.error(error);
        return throwError(error);
      })
    )
  }

  editTask(patchedTask: Task): Observable<any> {
    return this.http.put(this.taskPath + patchedTask.id, patchedTask).pipe(
      tap(_ => console.log(`Edited Task with ID (${patchedTask.id}) to (${JSON.stringify(patchedTask)})`)),
      catchError((error: HttpErrorResponse) => {
        console.error(error);
        return throwError(error);
      })
    );
  }

  checkTask(id: number): Observable<any> {
    return of([]);
  }

  removeTask(id: number): Observable<any> {
    return this.http.delete(this.taskPath + id).pipe(
      tap(_ => console.log(`Removed Task with ID (${id})`)),
      catchError((error: HttpErrorResponse) => {
        console.error(error);
        return throwError(error);
      })
    );
  }

  removeAllTasks(id: number): Observable<any> {
    return of([]);
  }

}
