import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { Todo } from './todo';
import { Task } from './task';

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
        tap((todos : Todo[]) => console.log(`Fetched ${todos.length} Todo(s)`)),
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

  removeTodo(id: number): Observable<any> {
    return this.http.delete(this.todoPath + id).pipe(
      tap(_ => console.log(`Removed Todo with ID (${id})`)),
      catchError((error: HttpErrorResponse) => {
        console.error(error);
        return throwError(error);
      })
    );
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

  addTask(task: Task, todoId: number): Observable<Task> {
    return new Observable<Task>();
  }

  editTask(id: number, task: Task): Observable<any> {
    return new Observable<any>();
  }

  checkTask(id: number): Observable<any> {
    return new Observable<any>();
  }

  removeTask(id: number): Observable<any> {
    return new Observable<any>();
  }
  
}
