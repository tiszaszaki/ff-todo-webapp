import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

import { Observable, of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { Todo } from './todo';

@Injectable({
  providedIn: 'root'
})
export class FfTodoMockRequestService {

  private baseurl = 'ff-todo/todo/';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }

  getTodo(id : number) : Observable<Todo> {
    return this.http.get<Todo>(this.baseurl + id)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error(error);
          return throwError(error);
        })
    );
  }

  getTodos() : Observable<Todo[]> {
    return this.http.get<Todo[]>(this.baseurl)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error(error);
          return throwError(error);
        })
    );
  }

  addTodo(todo: Todo): Observable<Todo> {
    todo.id = -1;
    return this.http.post<Todo>(this.baseurl, todo, this.httpOptions).pipe(
      tap((newTodo: Todo) => console.log(`Added new todo: ${todo}`)),
      catchError((error: HttpErrorResponse) => {
        console.error(error);
        return throwError(error);
      })
    )
  }

  editTodo(id : number, patchedTodo: Todo): Observable<any> {
    return this.http.put(this.baseurl + patchedTodo.id, patchedTodo);
  }

  removeTodo(id: number): Observable<any> {
    return this.http.delete(this.baseurl + id);
  }
}
