import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Todo } from './todo';

@Injectable({
  providedIn: 'root'
})
export class FfTodoRealRequestService {

  private backendUrl!: string;
  private todoPath1!: string;
  private todoPath2!: string;
  private taskPath!: string;

  private httpOptions = {
    headers: new HttpHeaders({ 
      'Content-Type': 'application/json',
    })
  };

  constructor(private http: HttpClient) {
    this.backendUrl = 'ff-todo/';
    this.todoPath1 = this.backendUrl + 'todo';
    this.todoPath2 = this.backendUrl + 'todo/';
    this.taskPath = this.backendUrl + 'task/';
  }

  getTodo(id : number) : Observable<Todo> {
    return this.http.get<Todo>(this.todoPath2 + id).pipe(
        tap((todo : Todo) => console.log(`Fetched Todo: (${JSON.stringify(todo)})`)),
        catchError((error: HttpErrorResponse) => {
          console.error(error);
          return throwError(error);
        })
    );
  }

  getTodos() : Observable<Todo[]> {
    return this.http.get<Todo[]>(this.todoPath1).pipe(
        tap((todos : Todo[]) => console.log(`Fetched ${todos.length} Todo(s)`)),
        catchError((error: HttpErrorResponse) => {
          console.error(error);
          return throwError(error);
        })
    );
  }

  addTodo(todo: Todo): Observable<Todo> {
    return this.http.post<Todo>(this.todoPath1, todo, this.httpOptions).pipe(
      tap((newTodo: Todo) => console.log(`Added new Todo: ${JSON.stringify(newTodo)}`)),
      catchError((error: HttpErrorResponse) => {
        console.error(error);
        return throwError(error);
      })
    )
  }

  editTodo(id : number, patchedTodo: Todo): Observable<any> {
    return this.http.put(this.todoPath2 + patchedTodo.id, patchedTodo).pipe(
      tap(_ => console.log(`Edited Todo with ID (${patchedTodo.id}) to (${JSON.stringify(patchedTodo)})`)),
      catchError((error: HttpErrorResponse) => {
        console.error(error);
        return throwError(error);
      })
    );
  }

  removeTodo(id: number): Observable<any> {
    return this.http.delete(this.todoPath2 + id).pipe(
      tap(_ => console.log(`Removed Todo with ID (${id})`)),
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
