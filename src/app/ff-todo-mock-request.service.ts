import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Todo } from './todo';
import { Task } from './task';
import { FfTodoCommonService } from './ff-todo-common.service';
import { Board } from './board';
import { FfTodoAbstractRequestService } from './ff-todo-abstract-request.service';

@Injectable({
  providedIn: 'root'
})
export class FfTodoMockRequestService implements FfTodoAbstractRequestService{

  private baseurl = 'ff-todo/';
  private boardPath! : string;
  private todoPath! : string;
  private taskPath! : string;

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
      private http: HttpClient,
      private common: FfTodoCommonService) {
    this.boardPath = this.baseurl + 'board';
    this.todoPath = this.baseurl + 'todo';
    this.taskPath = this.baseurl + 'task';

    this.common.setRealServiceStatus(false);
  }

  getBoard(id : number) : Observable<Board> {
    return this.http.get<Board>(`${this.boardPath}/${id}`).pipe(
      map((board : Board) => { return board; }),
      tap((board : Board) => console.log(`Fetched Board: (${JSON.stringify(board)})`)),
      catchError((error: HttpErrorResponse) => {
        console.error(error.message);
        return throwError(error.message);
      })
    );
  }

  getBoards() : Observable<Number[]> {
    return this.http.get<Board[]>(`${this.boardPath}`).pipe(
      map((boards : Board[]) => boards.map(board => board.id)),
      tap((todos : Number[]) => console.log(`Fetched ${todos.length} Board ID(s)`)),
      catchError((error: HttpErrorResponse) => {
        console.error(error.message);
        return throwError(error.message);
      })
    );
  }

  addBoard(board: Board): Observable<Board> {
    return this.http.post<Board>(`${this.boardPath}`, board, this.httpOptions).pipe(
      tap((newBoard: Board) => console.log(`Added new Board: ${JSON.stringify(newBoard)}`)),
      catchError((error: HttpErrorResponse) => {
        console.error(error.message);
        return throwError(error.message);
      })
    )
  }

  editBoard(id : number, patchedBoard: Board): Observable<any> {
    return this.http.put(`${this.boardPath}/${patchedBoard.id}`, patchedBoard).pipe(
      tap(() => console.log(`Edited Board with ID (${patchedBoard.id}) to (${JSON.stringify(patchedBoard)})`)),
      catchError((error: HttpErrorResponse) => {
        console.error(error.message);
        return throwError(error.message);
      })
    );
  }

  removeBoard(id: number): Observable<any> {
    return this.http.delete(`${this.boardPath}/${id}`).pipe(
      tap(() => console.log(`Removed Board with ID (${id})`)),
      catchError((error: HttpErrorResponse) => {
        console.error(error.message);
        return throwError(error.message);
      })
    );
  }

  getBoardNameMaxLength() : Observable<Number> {
    return of(64);
  }

  getBoardDescriptionMaxLength() : Observable<Number> {
    return of(1024);
  }

  getBoardAuthorMaxLength() : Observable<Number> {
    return of(128);
  }

  getBoardReadonlyTodosSetting(id : number) : Observable<Boolean> {
    return of(false);
  }

  setBoardReadonlyTodosSetting(id : number, readonly: Boolean) : Observable<void> {
    return of();
  }

  getBoardReadonlyTasksSetting(id : number) : Observable<Boolean> {
    return of(false);
  }

  setBoardReadonlyTasksSetting(id : number, readonly: Boolean) : Observable<void> {
    return of();
  }

  getTodo(id : number) : Observable<Todo> {
    return this.http.get<Todo>(`${this.todoPath}/${id}`).pipe(
      tap((todo : Todo) => console.log(`Fetched Todo: (${JSON.stringify(todo)})`)),
      catchError((error: HttpErrorResponse) => {
        console.error(error.message);
        return throwError(error.message);
      })
    );
  }

  getTodos() : Observable<Todo[]> {
    return this.http.get<Todo[]>(`${this.todoPath}`).pipe(
      tap((todos : Todo[]) => console.log(`Fetched ${todos.length} Todo(s)`)),
      catchError((error: HttpErrorResponse) => {
        console.error(error.message);
        return throwError(error.message);
      })
    );
  }

  getTodosFromBoard(id : number) : Observable<Todo[]> {
    return this.http.get<Todo[]>(`${this.todoPath}`).pipe(
      map((todos : Todo[]) => {
        let filtered_todos = todos.filter(todo => todo.boardId == id);
        if (filtered_todos.length)
        {
          console.log(`Fetched ${filtered_todos.length} Todo(s) from Board with ID (${id})`);
        }
        return filtered_todos;
      }),
      catchError((error: HttpErrorResponse) => {
        console.error(error.message);
        return throwError(error.message);
      })
    );
  }

  addTodo(id : number, todo: Todo): Observable<Todo> {
    todo.dateCreated = todo.dateModified = new Date();
    todo.boardId = id;
    return this.http.post<Todo>(`${this.todoPath}`, todo, this.httpOptions).pipe(
      tap((newTodo: Todo) => console.log(`Added new Todo: ${JSON.stringify(newTodo)}`)),
      catchError((error: HttpErrorResponse) => {
        console.error(error.message);
        return throwError(error.message);
      })
    )
  }

  editTodo(id : number, patchedTodo: Todo): Observable<any> {
    patchedTodo.dateModified = new Date();
    return this.http.put(`${this.todoPath}/${id}`, patchedTodo).pipe(
      tap(() => console.log(`Edited Todo with ID (${patchedTodo.id}) to (${JSON.stringify(patchedTodo)})`)),
      catchError((error: HttpErrorResponse) => {
        console.error(error.message);
        return throwError(error.message);
      })
    );
  }

  cloneTodo(id : number, phase : number, boardId : number): Observable<Todo> {
    return this.http.get<Todo>(`${this.todoPath}/${id}`).pipe(
      map((todo: Todo) => {
        let clonedTodo = todo;

        clonedTodo.id = NaN;
        clonedTodo.name += " (cloned)";
        clonedTodo.phase = phase;
        clonedTodo.boardId = boardId;

        this.addTodo(boardId, clonedTodo).subscribe();

        console.log(`Cloned Todo with ID (${id}): ${JSON.stringify(clonedTodo)}`);

        return clonedTodo;
      }),
      catchError((error: HttpErrorResponse) => {
        console.error(error.message);
        return throwError(error.message);
      })
    );
  }

  removeTodo(id: number): Observable<any> {
    return this.http.delete(`${this.todoPath}/${id}`).pipe(
      tap(() => console.log(`Removed Todo with ID (${id})`)),
      catchError((error: HttpErrorResponse) => {
        console.error(error.message);
        return throwError(error.message);
      })
    );
  }

  removeAllTodos(id: number): Observable<any> {
    return this.http.get<Todo[]>(`${this.todoPath}`).pipe(
      map((todos : Todo[]) => {
        for (let todo of todos)
        {
          if (todo.boardId == id)
          {
            this.removeTodo(todo.id).subscribe();
          }
        }
      }),
      tap(() => console.log(`Removed all Todos from Board with ID (${id})`)),
      catchError((error: HttpErrorResponse) => {
        console.error(error.message);
        return throwError(error.message);
      })
    );
  }

  getTodoNameMaxLength() : Observable<Number> {
    return of(128);
  }

  getTodoDescriptionMaxLength() : Observable<Number> {
    return of(1024);
  }

  getTodoPhaseRange() : Observable< Array<Number> > {
    return of([0,2]);
  }

  getTasksFromTodo(todoId: number): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.taskPath}`).pipe(
      map((tasks : Task[]) => {
        let filtered_tasks = tasks.filter(task => task.todoId == todoId);
        if (filtered_tasks.length)
        {
          console.log(`Fetched ${filtered_tasks.length} Task(s) from Todo with ID (${todoId})`);
        }
        return filtered_tasks;
      }),
      catchError((error: HttpErrorResponse) => {
        console.error(error.message);
        return throwError(error.message);
      })
    );
  }

  addTask(task: Task, todoId: number): Observable<Task> {
    task.todoId = todoId;
    return this.http.post<Task>(`${this.taskPath}`, task, this.httpOptions).pipe(
      tap((newTask: Task) => console.log(`Added new Task for Todo with ID (${todoId}): ${JSON.stringify(newTask)}`)),
      catchError((error: HttpErrorResponse) => {
        console.error(error.message);
        return throwError(error.message);
      })
    )
  }

  editTask(patchedTask: Task): Observable<any> {
    return this.http.put(`${this.taskPath}/${patchedTask.id}`, patchedTask).pipe(
      tap(() => console.log(`Edited Task with ID (${patchedTask.id}) to (${JSON.stringify(patchedTask)})`)),
      catchError((error: HttpErrorResponse) => {
        console.error(error.message);
        return throwError(error.message);
      })
    );
  }

  removeTask(id: number): Observable<any> {
    return this.http.delete(`this.taskPath/id`).pipe(
      tap(() => console.log(`Removed Task with ID (${id})`)),
      catchError((error: HttpErrorResponse) => {
        console.error(error.message);
        return throwError(error.message);
      })
    );
  }

  removeAllTasks(id: number): Observable<any> {
    return this.http.get<Task[]>(`${this.taskPath}`).pipe(
      map((tasks : Task[]) => {
        for (let task of tasks)
        {
          if (task.todoId == id)
          {
            this.removeTask(task.id).subscribe();
          }
        }
      }),
      tap(() => console.log(`Removed all Tasks from Todo with ID (${id})`)),
      catchError((error: HttpErrorResponse) => {
        console.error(error.message);
        return throwError(error.message);
      })
    );
  }

  getTaskNameMaxLength() : Observable<Number> {
    return of(32);
  }
}
