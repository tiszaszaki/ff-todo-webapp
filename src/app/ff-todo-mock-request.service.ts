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
    return this.http.post<Todo>(this.baseurl, todo).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error(error);
        return throwError(error);
      })
    )
  }

  editTodo(patchedTodo: Todo): Observable<any> {
    return this.http.put(this.baseurl + patchedTodo.id, patchedTodo);
  }

  removeTodo(id: number): Observable<any> {
    return this.http.delete(this.baseurl + id);
  }
}
