import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription, throwError } from 'rxjs';
import { catchError, map, tap, timeout } from 'rxjs/operators';
import { Board } from './board';
import { FfTodoAbstractRequestService } from './ff-todo-abstract-request.service';
import { FfTodoCommonService } from './ff-todo-common.service';
import { PivotResponse } from './pivot-response';
import { Task } from './task';
import { Todo } from './todo';

@Injectable({
  providedIn: 'root'
})
export class FfTodoRealRequestService implements FfTodoAbstractRequestService, OnInit, OnDestroy {

  private boardPath!: string;
  private todoPath!: string;
  private taskPath!: string;
  private pivotPath!: string;

  private timeoutInterval!: number;

  public backendSelected!: string;
  private backendSelectedListener!: Subscription;

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

  constructor(
      private http: HttpClient,
      private common: FfTodoCommonService) {

    this.timeoutInterval = 8000;

    this.backendSelectedListener = this.common.backendSelectedChange.subscribe(id => {
      this.backendSelected = id;
      this.resetBackend();
    });
  
    this.common.triggerBackend();
    this.common.setRealServiceStatus(true);
  }

  ngOnInit(): void {
  }

  ngOnDestroy() : void {
    this.backendSelectedListener.unsubscribe();
  }

  resetBackend()
  {
    let backendUrlTemp = this.common.getCurrentBackendUrl();
    this.boardPath = backendUrlTemp + 'board';
    this.todoPath = backendUrlTemp + 'todo';
    this.taskPath = backendUrlTemp + 'task';
    this.pivotPath = backendUrlTemp + 'pivot';
  }

  getBoard(id : number) : Observable<Board> {
    return this.http.get<Board>(`${this.boardPath}/${id}`).pipe(
      timeout(this.timeoutInterval),
      tap((board : Board) => console.log(`Fetched Board: (${JSON.stringify(board)})`)),
      catchError((error: HttpErrorResponse) => {
        console.error(error.message);
        return throwError(error.message);
      })
    );
  }

  getBoardIds() : Observable<Number[]> {
    return this.http.get<Number[]>(`${this.boardPath}`).pipe(
      timeout(this.timeoutInterval),
      tap((todos : Number[]) => console.log(`Fetched ${todos.length} Board ID(s)`)),
      catchError((error: HttpErrorResponse) => {
        console.error(error.message);
        return throwError(error.message);
      })
    );
  }

  addBoard(board: Board): Observable<Board> {
    return this.http.put<Board>(`${this.boardPath}`, board, this.httpOptions).pipe(
      timeout(this.timeoutInterval),
      tap((newBoard: Board) => console.log(`Added new Board: ${JSON.stringify(newBoard)}`)),
      catchError((error: HttpErrorResponse) => {
        console.error(error.message);
        return throwError(error.message);
      })
    )
  }

  editBoard(id : number, patchedBoard: Board): Observable<void> {
    return this.http.patch<void>(`${this.boardPath}/${patchedBoard.id}`, patchedBoard).pipe(
      timeout(this.timeoutInterval),
      tap(() => console.log(`Edited Board with ID (${patchedBoard.id}) to (${JSON.stringify(patchedBoard)})`)),
      catchError((error: HttpErrorResponse) => {
        console.error(error.message);
        return throwError(error.message);
      })
    );
  }

  removeBoard(id: number): Observable<void> {
    return this.http.delete<void>(`${this.boardPath}/${id}`).pipe(
      timeout(this.timeoutInterval),
      tap(() => console.log(`Removed Board with ID (${id})`)),
      catchError((error: HttpErrorResponse) => {
        console.error(error.message);
        return throwError(error.message);
      })
    );
  }

  getBoardNameMaxLength() : Observable<Number> {
    return this.http.get<Number>(`${this.boardPath}/name-max-length`).pipe(
      timeout(this.timeoutInterval),
      tap((maxLength : Number) => console.log(`Fetched maximum name length for all Boards: (${maxLength})`)),
      catchError((error: HttpErrorResponse) => {
        console.error(error.message);
        return throwError(error.message);
      })
    );
  }

  getBoardDescriptionMaxLength() : Observable<Number> {
    return this.http.get<Number>(`${this.boardPath}/description-max-length`).pipe(
      timeout(this.timeoutInterval),
      tap((maxLength : Number) => console.log(`Fetched maximum description length for all Boards: (${maxLength})`)),
      catchError((error: HttpErrorResponse) => {
        console.error(error.message);
        return throwError(error.message);
      })
    );
  }

  getBoardAuthorMaxLength() : Observable<Number> {
    return this.http.get<Number>(`${this.boardPath}/author-max-length`).pipe(
      timeout(this.timeoutInterval),
      tap((maxLength : Number) => console.log(`Fetched maximum author length for all Boards: (${maxLength})`)),
      catchError((error: HttpErrorResponse) => {
        console.error(error.message);
        return throwError(error.message);
      })
    );
  }

  getBoardReadonlyTodosSetting(id : number) : Observable<Boolean> {
    return this.http.get<Boolean>(`${this.boardPath}/${id}/readonly-todos`).pipe(
      timeout(this.timeoutInterval),
      tap((readonly : Boolean) => console.log(`Fetched Read-only Todos settings for Board with ID (${id}): (${readonly})`)),
      catchError((error: HttpErrorResponse) => {
        console.error(error.message);
        return throwError(error.message);
      })
    );
  }

  setBoardReadonlyTodosSetting(id : number, readonly: Boolean) : Observable<void> {
    return this.http.patch<void>(`${this.boardPath}/${id}/readonly-todos/${readonly}`, undefined).pipe(
      timeout(this.timeoutInterval),
      tap(() => console.log(`Set Read-only Todos settings for Board with ID (${id}) to (${readonly})`)),
      catchError((error: HttpErrorResponse) => {
        console.error(error.message);
        return throwError(error.message);
      })
    );
  }

  getBoardReadonlyTasksSetting(id : number) : Observable<Boolean> {
    return this.http.get<Boolean>(`${this.boardPath}/${id}/readonly-tasks`).pipe(
      timeout(this.timeoutInterval),
      tap((readonly : Boolean) => console.log(`Fetched Read-only Tasks settings for Board with ID (${id}): (${readonly})`)),
      catchError((error: HttpErrorResponse) => {
        console.error(error.message);
        return throwError(error.message);
      })
    );
  }

  setBoardReadonlyTasksSetting(id : number, readonly: Boolean) : Observable<void> {
    return this.http.patch<void>(`${this.boardPath}/${id}/readonly-tasks/${readonly}`, undefined).pipe(
      timeout(this.timeoutInterval),
      tap(() => console.log(`Set Read-only Tasks settings for Board with ID (${id}) to (${readonly})`)),
      catchError((error: HttpErrorResponse) => {
        console.error(error.message);
        return throwError(error.message);
      })
    );
  }

  getTodo(id : number) : Observable<Todo> {
    return this.http.get<Todo>(`${this.todoPath}/${id}`).pipe(
      timeout(this.timeoutInterval),
      tap((todo : Todo) => console.log(`Fetched Todo: (${JSON.stringify(todo)})`)),
      catchError((error: HttpErrorResponse) => {
        console.error(error.message);
        return throwError(error.message);
      })
    );
  }

  getTodos() : Observable<Todo[]> {
    return this.http.get<Todo[]>(`${this.todoPath}`).pipe(
      timeout(this.timeoutInterval),
      tap((todos : Todo[]) => console.log(`Fetched ${todos.length} Todo(s)`)),
      catchError((error: HttpErrorResponse) => {
        console.error(error.message);
        return throwError(error.message);
      })
    );
  }

  getTodosFromBoard(id : number) : Observable<Todo[]> {
    return this.http.get<Todo[]>(`${this.boardTodoPath(id)}s`).pipe(
      timeout(this.timeoutInterval),
      tap((todos : Todo[]) => console.log(`Fetched ${todos.length} Todo(s) from Board with ID (${id})`)),
      catchError((error: HttpErrorResponse) => {
        console.error(error.message);
        return throwError(error.message);
      })
    );
  }

  addTodo(id: number, todo: Todo): Observable<Todo> {
    return this.http.put<Todo>(`${this.boardTodoPath(id)}`, todo, this.httpOptions).pipe(
      timeout(this.timeoutInterval),
      tap((newTodo: Todo) => console.log(`Added new Todo: ${JSON.stringify(newTodo)}`)),
      catchError((error: HttpErrorResponse) => {
        console.error(error.message);
        return throwError(error.message);
      })
    )
  }

  cloneTodo(id : number, phase: number, boardId: number): Observable<Todo> {
    return this.http.get<Todo>(`${this.todoPath}/${id}/clone/${phase}/${boardId}`, undefined).pipe(
      timeout(this.timeoutInterval),
      tap((clonedTodo: Todo) => console.log(`Cloned Todo with ID (${id}): ${JSON.stringify(clonedTodo)}`)),
      catchError((error: HttpErrorResponse) => {
        console.error(error.message);
        return throwError(error.message);
      })
    );
  }

  editTodo(id : number, patchedTodo: Todo): Observable<void> {
    return this.http.patch<void>(`${this.todoPath}/${patchedTodo.id}`, patchedTodo).pipe(
      timeout(this.timeoutInterval),
      tap(() => console.log(`Edited Todo with ID (${patchedTodo.id}) to (${JSON.stringify(patchedTodo)})`)),
      catchError((error: HttpErrorResponse) => {
        console.error(error.message);
        return throwError(error.message);
      })
    );
  }

  removeTodo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.todoPath}/${id}`).pipe(
      timeout(this.timeoutInterval),
      tap(() => console.log(`Removed Todo with ID (${id})`)),
      catchError((error: HttpErrorResponse) => {
        console.error(error.message);
        return throwError(error.message);
      })
    );
  }

  removeAllTodos(id: number): Observable<Number> {
    return this.http.delete<Number>(`${this.boardTodoPath(id)}/clear`).pipe(
      timeout(this.timeoutInterval),
      tap((count : Number) => console.log(`Removed all Todos (${count}) from Board with ID (${id})`)),
      catchError((error: HttpErrorResponse) => {
        console.error(error.message);
        return throwError(error.message);
      })
    );
  }

  getTodoNameMaxLength() : Observable<Number> {
    return this.http.get<Number>(`${this.todoPath}/name-max-length`).pipe(
      timeout(this.timeoutInterval),
      tap((maxLength : Number) => console.log(`Fetched maximum name length for all Todos: (${maxLength})`)),
      catchError((error: HttpErrorResponse) => {
        console.error(error.message);
        return throwError(error.message);
      })
    );
  }

  getTodoDescriptionMaxLength() : Observable<Number> {
    return this.http.get<Number>(`${this.todoPath}/description-max-length`).pipe(
      timeout(this.timeoutInterval),
      tap((maxLength : Number) => console.log(`Fetched maximum description length for all Todos: (${maxLength})`)),
      catchError((error: HttpErrorResponse) => {
        console.error(error.message);
        return throwError(error.message);
      })
    );
  }

  getTodoPhaseRange() : Observable< Array<Number> > {
    return this.http.get< Array<Number> >(`${this.todoPath}/phase-val-range`).pipe(
        timeout(this.timeoutInterval),
        tap((result : Array<Number>) => console.log(`Fetched phase range for all Todos: (${result})`)),
        catchError((error: HttpErrorResponse) => {
          console.error(error.message);
          return throwError(error.message);
        })
    );
  }

  getTodoPhaseName(idx : number) : Observable<String> {
    return this.http.get<{phase:String}>(`${this.todoPath}/phase-name/${idx}`).pipe(
      timeout(this.timeoutInterval),
      tap((result : {phase: String}) => console.log(`Fetched phase name with index (${idx}) for all Todos: (${result.phase})`)),
      map((result : {phase: String}) => result.phase),
      catchError((error: HttpErrorResponse) => {
        console.error(error.message);
        return throwError(error.message);
      })
    );
  }

  getTasks() : Observable<Task[]> {
    return this.http.get<Task[]>(`${this.taskPath}`).pipe(
      timeout(this.timeoutInterval),
      tap((tasks : Task[]) => console.log(`Fetched ${tasks.length} Task(s)`)),
      catchError((error: HttpErrorResponse) => {
        console.error(error.message);
        return throwError(error.message);
      })
    );
  }

  getTasksFromTodo(todoId: number): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.todoTaskPath(todoId)}s`).pipe(
      timeout(this.timeoutInterval),
      tap((tasks : Task[]) => console.log(`Fetched ${tasks.length} Task(s) from Todo with ID (${todoId})`)),
      catchError((error: HttpErrorResponse) => {
        console.error(error.message);
        return throwError(error.message);
      })
    );
  }

  addTask(task: Task, todoId: number): Observable<Task> {
    return this.http.put<Task>(`${this.todoTaskPath(todoId)}`, task, this.httpOptions).pipe(
      timeout(this.timeoutInterval),
      tap((newTask: Task) => console.log(`Added new Task for Todo with ID (${todoId}): ${JSON.stringify(newTask)}`)),
      catchError((error: HttpErrorResponse) => {
        console.error(error.message);
        return throwError(error.message);
      })
    )
  }

  editTask(patchedTask: Task): Observable<void> {
    return this.http.patch<void>(`${this.taskPath}/${patchedTask.id}`, patchedTask).pipe(
      timeout(this.timeoutInterval),
      tap(() => console.log(`Edited Task with ID (${patchedTask.id}) to (${JSON.stringify(patchedTask)})`)),
      catchError((error: HttpErrorResponse) => {
        console.error(error.message);
        return throwError(error.message);
      })
    );
  }

  removeTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.taskPath}/${id}`).pipe(
      timeout(this.timeoutInterval),
      tap(() => console.log(`Removed Task with ID (${id})`)),
      catchError((error: HttpErrorResponse) => {
        console.error(error.message);
        return throwError(error.message);
      })
    );
  }

  removeAllTasks(todoId: number): Observable<Number> {
    return this.http.delete<Number>(`${this.todoTaskPath(todoId)}/clear`).pipe(
      timeout(this.timeoutInterval),
      tap((count) => console.log(`Removed all Tasks (${count}) from Todo with ID (${todoId})`)),
      catchError((error: HttpErrorResponse) => {
        console.error(error.message);
        return throwError(error.message);
      })
    );
  }

  getTaskNameMaxLength() : Observable<Number> {
    return this.http.get<Number>(`${this.taskPath}/name-max-length`).pipe(
      timeout(this.timeoutInterval),
      tap((maxLength : Number) => console.log(`Fetched maximum name length for all Tasks: (${maxLength})`)),
      catchError((error: HttpErrorResponse) => {
        console.error(error.message);
        return throwError(error.message);
      })
    );
  }

  pivotQuery(pivotId: string) : Observable<PivotResponse> {
    return this.http.get<PivotResponse>(`${this.pivotPath}/${pivotId}`).pipe(
      timeout(this.timeoutInterval),
      tap((result : PivotResponse) => console.log(`Fetched pivot table with ID (${pivotId}) which has ${result.records.length} record(s)`)),
      catchError((error: HttpErrorResponse) => {
        console.error(error.message);
        return throwError(error.message);
      })
    );
  }
}
