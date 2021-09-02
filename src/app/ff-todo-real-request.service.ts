import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ShiftDirection } from './shift-direction';
import { Task } from './task';
import { Todo } from './todo';

@Injectable({
  providedIn: 'root'
})
export class FfTodoRealRequestService {

  private backendUrl!: string;
  private todoPath!: string;
  private taskPath!: string;

  private todoTaskPath(id: number): string
  {
    return `${this.todoPath}/${id}/task`;
  }

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };

  constructor(private http: HttpClient) {
    this.backendUrl = 'http://localhost:8080/ff-todo/';
    this.todoPath = this.backendUrl + 'todo';
    this.taskPath = this.backendUrl + 'task';
  }

  getTodo(id : number) : Observable<Todo> {
    return this.http.get<Todo>(`${this.todoPath}/${id}`).pipe(
        tap((todo : Todo) => console.log(`Fetched Todo: (${JSON.stringify(todo)})`)),
        catchError((error: HttpErrorResponse) => {
          console.error(error);
          return throwError(error);
        })
    );
  }

  getTodos() : Observable<Todo[]> {
    return this.http.get<Todo[]>(`${this.todoPath}`).pipe(
        tap((todos : Todo[]) => console.log(`Fetched ${todos.length} Todo(s)`)),
        catchError((error: HttpErrorResponse) => {
          console.error(error);
          return throwError(error);
        })
    );
  }

  searchTodoByField(term: String, field: String): Observable<Todo[]> {
    return of([]);
  }

  addTodo(todo: Todo): Observable<Todo> {
    return this.http.put<Todo>(`${this.todoPath}`, todo, this.httpOptions).pipe(
      tap((newTodo: Todo) => console.log(`Added new Todo: ${JSON.stringify(newTodo)}`)),
      catchError((error: HttpErrorResponse) => {
        console.error(error);
        return throwError(error);
      })
    )
  }

  editTodo(id : number, patchedTodo: Todo): Observable<any> {
    return this.http.patch(`${this.todoPath}/${patchedTodo.id}`, patchedTodo).pipe(
      tap(_ => console.log(`Edited Todo with ID (${patchedTodo.id}) to (${JSON.stringify(patchedTodo)})`)),
      catchError((error: HttpErrorResponse) => {
        console.error(error);
        return throwError(error);
      })
    );
  }

  shiftTodo(id : number, dir: ShiftDirection): Observable<any> {
    let dirStr=JSON.stringify(dir).toLowerCase();
    return this.http.patch(`${this.todoPath}/${id}/shift/${dirStr}`, undefined).pipe(
      tap(_ => console.log(`Shifted Todo with ID (${id}) to the ${dirStr}`)),
      catchError((error: HttpErrorResponse) => {
        console.error(error);
        return throwError(error);
      })
    );
  }

  removeTodo(id: number): Observable<any> {
    return this.http.delete(`${this.todoPath}/${id}`).pipe(
      tap(_ => console.log(`Removed Todo with ID (${id})`)),
      catchError((error: HttpErrorResponse) => {
        console.error(error);
        return throwError(error);
      })
    );
  }

  removeAllTodos(): Observable<any> {
    return this.http.delete(`${this.todoPath}/clear`).pipe(
      tap(_ => console.log(`Removed all Todos`)),
      catchError((error: HttpErrorResponse) => {
        console.error(error);
        return throwError(error);
      })
    );
  }

  addTask(task: Task, todoId: number): Observable<Task> {
    return this.http.put<Task>(`${this.todoTaskPath(todoId)}`, task, this.httpOptions).pipe(
      tap((newTask: Task) => console.log(`Added new Task for Todo with ID (${todoId}): ${JSON.stringify(newTask)}`)),
      catchError((error: HttpErrorResponse) => {
        console.error(error);
        return throwError(error);
      })
    )
  }

  editTask(patchedTask: Task): Observable<any> {
    return this.http.patch(`${this.taskPath}/${patchedTask.id}`, patchedTask).pipe(
      tap(_ => console.log(`Edited Task with ID (${patchedTask.id}) to (${JSON.stringify(patchedTask)})`)),
      catchError((error: HttpErrorResponse) => {
        console.error(error);
        return throwError(error);
      })
    );
  }

  checkTask(id: number): Observable<any> {
    return this.http.patch(`${this.taskPath}/${id}/check`, undefined).pipe(
      tap(_ => console.log(`Checked Task with ID (${id})`)),
      catchError((error: HttpErrorResponse) => {
        console.error(error);
        return throwError(error);
      })
    );
  }

  removeTask(id: number): Observable<any> {
    return this.http.delete(`${this.taskPath}/${id}`).pipe(
      tap(_ => console.log(`Removed Task with ID (${id})`)),
      catchError((error: HttpErrorResponse) => {
        console.error(error);
        return throwError(error);
      })
    );
  }

  removeAllTasks(todoId: number): Observable<any> {
    return this.http.delete(`${this.todoTaskPath(todoId)}/clear`).pipe(
      tap(_ => console.log(`Removed all Tasks from Todo with ID (${todoId})`)),
      catchError((error: HttpErrorResponse) => {
        console.error(error);
        return throwError(error);
      })
    );
  }

}
