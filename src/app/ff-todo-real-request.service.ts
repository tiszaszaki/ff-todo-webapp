import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap, timeout } from 'rxjs/operators';
import { environment } from 'src/environments/environment.stage';
import { Board } from './board';
import { ShiftDirection } from './shift-direction';
import { Task } from './task';
import { Todo } from './todo';

@Injectable({
  providedIn: 'root'
})
export class FfTodoRealRequestService {

  private backendUrl!: string;
  private boardPath!: string;
  private todoPath!: string;
  private taskPath!: string;

  private timeoutInterval!: number;

  private boardTodoPath(id: number): string
  {
    return `${this.boardPath}/${id}/todo`;
  }

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
    this.backendUrl = environment.apiUrl;
    this.boardPath = this.backendUrl + 'board';
    this.todoPath = this.backendUrl + 'todo';
    this.taskPath = this.backendUrl + 'task';

    this.timeoutInterval = 5000;
  }

  getBoard(id : number) : Observable<Board> {
    return this.http.get<Board>(`${this.boardPath}/${id}`).pipe(
        timeout(this.timeoutInterval),
        tap((board : Board) => console.log(`Fetched Board: (${JSON.stringify(board)})`)),
        catchError((error: HttpErrorResponse) => {
          console.error(error);
          return throwError(error);
        })
    );
  }

  getBoards() : Observable<Number[]> {
    return this.http.get<Number[]>(`${this.boardPath}`).pipe(
        timeout(this.timeoutInterval),
        tap((todos : Number[]) => console.log(`Fetched ${todos.length} Board ID(s)`)),
        catchError((error: HttpErrorResponse) => {
          console.error(error);
          return throwError(error);
        })
    );
  }

  addBoard(board: Board): Observable<Board> {
    return this.http.put<Board>(`${this.boardPath}`, board, this.httpOptions).pipe(
      timeout(this.timeoutInterval),
      tap((newBoard: Board) => console.log(`Added new Board: ${JSON.stringify(newBoard)}`)),
      catchError((error: HttpErrorResponse) => {
        console.error(error);
        return throwError(error);
      })
    )
  }

  editBoard(id : number, patchedBoard: Board): Observable<any> {
    return this.http.patch(`${this.boardPath}/${patchedBoard.id}`, patchedBoard).pipe(
      timeout(this.timeoutInterval),
      tap(_ => console.log(`Edited Board with ID (${patchedBoard.id}) to (${JSON.stringify(patchedBoard)})`)),
      catchError((error: HttpErrorResponse) => {
        console.error(error);
        return throwError(error);
      })
    );
  }

  removeBoard(id: number): Observable<any> {
    return this.http.delete(`${this.boardPath}/${id}`).pipe(
      timeout(this.timeoutInterval),
      tap(_ => console.log(`Removed Board with ID (${id})`)),
      catchError((error: HttpErrorResponse) => {
        console.error(error);
        return throwError(error);
      })
    );
  }

  getBoardDescriptionMaxLength() : Observable<Number> {
    return this.http.get<Number>(`${this.boardPath}/description-max-length`).pipe(
        timeout(this.timeoutInterval),
        tap((maxLength : Number) => console.log(`Fetched maximum description length for all Boards: (${maxLength})`)),
        catchError((error: HttpErrorResponse) => {
          console.error(error);
          return throwError(error);
        })
    );
  }

  getTodoDescriptionMaxLength() : Observable<Number> {
    return this.http.get<Number>(`${this.todoPath}/description-max-length`).pipe(
        timeout(this.timeoutInterval),
        tap((maxLength : Number) => console.log(`Fetched maximum description length for all Todos: (${maxLength})`)),
        catchError((error: HttpErrorResponse) => {
          console.error(error);
          return throwError(error);
        })
    );
  }

  getTodoPhaseRange() : Observable< Array<Number> > {
    return this.http.get< Array<Number> >(`${this.todoPath}/phase-val-range`).pipe(
        timeout(this.timeoutInterval),
        tap((result : Array<Number>) => console.log(`Fetched phase range for all Todos: (${result})`)),
        catchError((error: HttpErrorResponse) => {
          console.error(error);
          return throwError(error);
        })
    );
  }

  getBoardReadonlyTodosSetting(id : number) : Observable<Boolean> {
    return this.http.get<Boolean>(`${this.boardPath}/${id}/readonly-todos`).pipe(
        timeout(this.timeoutInterval),
        tap((readonly : Boolean) => console.log(`Fetched Read-only Todos settings for Board with ID (${id}): (${readonly})`)),
        catchError((error: HttpErrorResponse) => {
          console.error(error);
          return throwError(error);
        })
    );
  }

  setBoardReadonlyTodosSetting(id : number, readonly: Boolean) : Observable<void> {
    return this.http.patch<void>(`${this.boardPath}/${id}/readonly-todos/${readonly}`, undefined).pipe(
        timeout(this.timeoutInterval),
        tap(_ => console.log(`Set Read-only Todos settings for Board with ID (${id}) to (${readonly})`)),
        catchError((error: HttpErrorResponse) => {
          console.error(error);
          return throwError(error);
        })
    );
  }

  getBoardReadonlyTasksSetting(id : number) : Observable<Boolean> {
    return this.http.get<Boolean>(`${this.boardPath}/${id}/readonly-tasks`).pipe(
        timeout(this.timeoutInterval),
        tap((readonly : Boolean) => console.log(`Fetched Read-only Tasks settings for Board with ID (${id}): (${readonly})`)),
        catchError((error: HttpErrorResponse) => {
          console.error(error);
          return throwError(error);
        })
    );
  }

  setBoardReadonlyTasksSetting(id : number, readonly: Boolean) : Observable<void> {
    return this.http.patch<void>(`${this.boardPath}/${id}/readonly-tasks/${readonly}`, undefined).pipe(
        timeout(this.timeoutInterval),
        tap(_ => console.log(`Set Read-only Tasks settings for Board with ID (${id}) to (${readonly})`)),
        catchError((error: HttpErrorResponse) => {
          console.error(error);
          return throwError(error);
        })
    );
  }

  getTodo(id : number) : Observable<Todo> {
    return this.http.get<Todo>(`${this.todoPath}/${id}`).pipe(
        timeout(this.timeoutInterval),
        tap((todo : Todo) => console.log(`Fetched Todo: (${JSON.stringify(todo)})`)),
        catchError((error: HttpErrorResponse) => {
          console.error(error);
          return throwError(error);
        })
    );
  }

  getTodos() : Observable<Todo[]> {
    return this.http.get<Todo[]>(`${this.todoPath}`).pipe(
        timeout(this.timeoutInterval),
        tap((todos : Todo[]) => console.log(`Fetched ${todos.length} Todo(s)`)),
        catchError((error: HttpErrorResponse) => {
          console.error(error);
          return throwError(error);
        })
    );
  }

  getTodosFromBoard(id : number) : Observable<Todo[]> {
    return this.http.get<Todo[]>(`${this.boardTodoPath(id)}s`).pipe(
        timeout(this.timeoutInterval),
        tap((todos : Todo[]) => console.log(`Fetched ${todos.length} Todo(s) from Board with ID (${id})`)),
        catchError((error: HttpErrorResponse) => {
          console.error(error);
          return throwError(error);
        })
    );
  }

  addTodo(id: number, todo: Todo): Observable<Todo> {
    return this.http.put<Todo>(`${this.boardTodoPath(id)}`, todo, this.httpOptions).pipe(
      timeout(this.timeoutInterval),
      tap((newTodo: Todo) => console.log(`Added new Todo: ${JSON.stringify(newTodo)}`)),
      catchError((error: HttpErrorResponse) => {
        console.error(error);
        return throwError(error);
      })
    )
  }

  cloneTodo(id : number, phase: number): Observable<void> {
    return this.http.patch<void>(`${this.todoPath}/${id}/clone/${phase}`, undefined).pipe(
      timeout(this.timeoutInterval),
      tap(() => console.log(`Cloned Todo with ID (${id})`)),
      catchError((error: HttpErrorResponse) => {
        console.error(error);
        return throwError(error);
      })
    );
  }

  editTodo(id : number, patchedTodo: Todo): Observable<any> {
    return this.http.patch(`${this.todoPath}/${patchedTodo.id}`, patchedTodo).pipe(
      timeout(this.timeoutInterval),
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
      timeout(this.timeoutInterval),
      tap(_ => console.log(`Shifted Todo with ID (${id}) to the ${dirStr}`)),
      catchError((error: HttpErrorResponse) => {
        console.error(error);
        return throwError(error);
      })
    );
  }

  removeTodo(id: number): Observable<any> {
    return this.http.delete(`${this.todoPath}/${id}`).pipe(
      timeout(this.timeoutInterval),
      tap(_ => console.log(`Removed Todo with ID (${id})`)),
      catchError((error: HttpErrorResponse) => {
        console.error(error);
        return throwError(error);
      })
    );
  }

  removeAllTodos(id: number): Observable<any> {
    return this.http.delete(`${this.boardTodoPath(id)}/clear`).pipe(
      timeout(this.timeoutInterval),
      tap(_ => console.log(`Removed all Todos from Board with ID (${id})`)),
      catchError((error: HttpErrorResponse) => {
        console.error(error);
        return throwError(error);
      })
    );
  }

  removeAllTodosFromBoard(id: Number): Observable<any> {
    return this.http.delete(`${this.boardPath}/${id}/clear`).pipe(
      timeout(this.timeoutInterval),
      tap(_ => console.log(`Removed all Todos from Board with ID (${id})`)),
      catchError((error: HttpErrorResponse) => {
        console.error(error);
        return throwError(error);
      })
    );
  }

  addTask(task: Task, todoId: number): Observable<Task> {
    return this.http.put<Task>(`${this.todoTaskPath(todoId)}`, task, this.httpOptions).pipe(
      timeout(this.timeoutInterval),
      tap((newTask: Task) => console.log(`Added new Task for Todo with ID (${todoId}): ${JSON.stringify(newTask)}`)),
      catchError((error: HttpErrorResponse) => {
        console.error(error);
        return throwError(error);
      })
    )
  }

  editTask(patchedTask: Task): Observable<any> {
    return this.http.patch(`${this.taskPath}/${patchedTask.id}`, patchedTask).pipe(
      timeout(this.timeoutInterval),
      tap(_ => console.log(`Edited Task with ID (${patchedTask.id}) to (${JSON.stringify(patchedTask)})`)),
      catchError((error: HttpErrorResponse) => {
        console.error(error);
        return throwError(error);
      })
    );
  }

  checkTask(id: number): Observable<any> {
    return this.http.patch(`${this.taskPath}/${id}/check`, undefined).pipe(
      timeout(this.timeoutInterval),
      tap(_ => console.log(`Checked Task with ID (${id})`)),
      catchError((error: HttpErrorResponse) => {
        console.error(error);
        return throwError(error);
      })
    );
  }

  removeTask(id: number): Observable<any> {
    return this.http.delete(`${this.taskPath}/${id}`).pipe(
      timeout(this.timeoutInterval),
      tap(_ => console.log(`Removed Task with ID (${id})`)),
      catchError((error: HttpErrorResponse) => {
        console.error(error);
        return throwError(error);
      })
    );
  }

  removeAllTasks(todoId: number): Observable<any> {
    return this.http.delete(`${this.todoTaskPath(todoId)}/clear`).pipe(
      timeout(this.timeoutInterval),
      tap(_ => console.log(`Removed all Tasks from Todo with ID (${todoId})`)),
      catchError((error: HttpErrorResponse) => {
        console.error(error);
        return throwError(error);
      })
    );
  }

}
